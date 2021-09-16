// Libraries
import { axios } from '@/utils'
import { Component, Mixins } from 'vue-property-decorator'
import { CorpTypeCd, NameRequestStates, NameRequestTypes } from '@/enums'
import { DateMixin } from '@/mixins'
import { NrResponseIF } from '@/interfaces'

/**
 * Mixin for processing Name Request objects.
 */
@Component({})
export default class NameRequestMixin extends Mixins(DateMixin) {
  /**
   * Fetches an NR and validates it against the applicant's information.
   * Throws an error if there is a problem.
   * @param nrNumber the name request number to validate
   * @param phone the applicant's phone number
   * @param email the applicant's email address
   * @returns the name request response payload
   */
  async validateNameRequest (nrNumber: string, phone?: string, email?: string): Promise<NrResponseIF> {
    const nrResponse: NrResponseIF = await this.fetchNameRequest(nrNumber).catch(error => {
      this.$root.$emit('invalid-name-request', NameRequestStates.NOT_FOUND)
      throw new Error(`Fetch Name Request error: ${error}`)
    })

    // validate email
    if (email && nrResponse.applicants?.emailAddress !== email) {
      this.$root.$emit('invalid-name-request', NameRequestStates.INCORRECT_EMAIL)
      throw new Error(`Incorrect Email`)
    }

    // validate phone
    if (phone && nrResponse.applicants?.phoneNumber !== phone) {
      this.$root.$emit('invalid-name-request', NameRequestStates.INCORRECT_PHONE)
      throw new Error(`Incorrect Phone`)
    }

    // ensure NR is valid
    if (!nrResponse || !this.isNrValid(nrResponse)) {
      this.$root.$emit('invalid-name-request', NameRequestStates.INVALID)
      throw new Error('Invalid Name Request')
    }

    // ensure NR is consumable
    const state = this.getNrState(nrResponse)
    if (state !== NameRequestStates.APPROVED) {
      this.$root.$emit('invalid-name-request', state)
      throw new Error(`Invalid Name request state: ${state}`)
    }

    // Convert NR type of BC to BEN to align with COLIN
    if (nrResponse.entity_type_cd === CorpTypeCd.BC_COMPANY) {
      nrResponse.entity_type_cd = CorpTypeCd.BENEFIT_COMPANY
    }

    // Convert NR type of CR to BC to align with COLIN
    if (nrResponse.entity_type_cd === CorpTypeCd.BC_CORPORATION) {
      nrResponse.entity_type_cd = CorpTypeCd.BC_COMPANY
    }

    return nrResponse
  }

  /**
   * Fetches name request data.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the NR data, or null if not found
   */
  private async fetchNameRequest (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      })
  }

  /**
   * Returns True if the Name Request data is valid.
   * @param nr the name request response payload
   * */
  isNrValid (nr: any): boolean {
    return Boolean(nr &&
      nr.state &&
      nr.names?.length > 0 &&
      nr.nrNum &&
      nr.requestTypeCd &&
      [NameRequestTypes.CHANGE_OF_NAME, NameRequestTypes.CONVERSION].includes(nr.request_action_cd)
    )
  }

  /**
   * Returns the Name Request's state.
   * @param nr the name request response payload
   */
  getNrState (nr: any): NameRequestStates {
    // Ensure a NR payload is provided.
    if (!nr) {
      return null
    }

    // If the NR is awaiting consent, it is not consumable.
    // null = consent not required
    // R = consent received
    // N = consent waived
    if (nr.state === NameRequestStates.CONDITIONAL &&
      nr.consentFlag !== null && nr.consentFlag !== 'R' && nr.consentFlag !== 'N') {
      return NameRequestStates.NEED_CONSENT
    }

    // If the NR's root state is not APPROVED or CONDITIONAL, it is not consumable.
    // EXPIRED or CONSUMED should not return NOT_APPROVED.
    if (![NameRequestStates.APPROVED, NameRequestStates.CONDITIONAL,
      NameRequestStates.EXPIRED, NameRequestStates.CONSUMED].includes(nr.state)) {
      return NameRequestStates.NOT_APPROVED
    }

    // Otherwise, the NR is consumable.
    return nr.state // APPROVED or CONDITIONAL or CONSUMED or EXPIRED
  }

  /**
   * Returns the Name Request's approved name.
   * @param nr the name request response payload
   */
  getNrApprovedName (nr: any): string {
    if (nr.names?.length > 0) {
      return nr.names.find(name => [NameRequestStates.APPROVED, NameRequestStates.CONDITION].includes(name.state)).name
    }
    return '' // should never happen
  }

  /** Map the request type to a display description
   * @param nrRequestType The name request type code
   */
  getNrRequestDesc (nrRequestType: NameRequestTypes): string {
    switch (nrRequestType) {
      case NameRequestTypes.NEW:
        return 'New Business'
      case NameRequestTypes.CHANGE_OF_NAME:
        return 'Change of Name'
      case NameRequestTypes.CONVERSION:
        return 'Conversion'
    }
  }
}
