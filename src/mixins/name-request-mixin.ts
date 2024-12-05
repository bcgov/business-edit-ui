import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { NameRequestStates, NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { LegalServices } from '@/services/'
import { ResourceIF } from '@/interfaces/'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'
import { useStore } from '@/store/store'
import { StatusCodes } from 'http-status-codes'

/**
 * Mixin for processing Name Request objects.
 */
@Component({})
export default class NameRequestMixin extends Vue {
  @Getter(useStore) getResource!: ResourceIF

  /**
   * Fetches an NR and validates it against the applicant's information.
   * Throws an error if there is a problem.
   * @param nrNumber the name request number to validate
   * @param phone the applicant's phone number
   * @param email the applicant's email address
   * @returns the name request object
   */
  async fetchValidateNameRequest (nrNumber: string, phone?: string, email?: string): Promise<NameRequestIF> {
    const nameRequest = await LegalServices.fetchNameRequest(nrNumber, phone, email).catch(error => {
      if (error?.response?.status === StatusCodes.NOT_FOUND) {
        this.$root.$emit('invalid-name-request', NameRequestStates.NOT_FOUND)
        throw new Error(`${nrNumber} not found`) // Sent invalid NR number
      }
      if (error?.response?.status === StatusCodes.BAD_REQUEST) {
        this.$root.$emit('invalid-name-request', 'INCORRECT_CONTACT')
        throw new Error('Sent invalid email or phone number.') // Sent invalid email or phone
      }
      if (error?.response?.status === StatusCodes.FORBIDDEN) {
        this.$root.$emit('invalid-name-request', 'NO_CONTACT')
        throw new Error('Not sent email or phone number.') // Not sent the email or phone
      }
      throw new Error(`Fetch Name Request error: ${error}`)
    })

    // ensure NR is valid
    const invalid = this.isNrInvalid(nameRequest)
    if (invalid) {
      this.$root.$emit('invalid-name-request', NameRequestStates.INVALID)
      throw new Error('Invalid Name Request')
    }

    // ensure NR is consumable
    const state = this.getNrState(nameRequest)
    if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
      this.$root.$emit('invalid-name-request', state)
      throw new Error(`Invalid Name request state: ${state}`)
    }

    return nameRequest
  }

  /**
   * Returns True if the Name Request data is invalid.
   * @param nr the name request response payload
   * */
  isNrInvalid (nr: any): boolean {
    // see also CorrectNameRequest.vue::nameRequestErrorText()
    const validRequestActionCodes = [
      NrRequestActionCodes.CHANGE_NAME,
      NrRequestActionCodes.CONVERSION,
      NrRequestActionCodes.RESTORE
    ]
    return Boolean(
      !nr ||
      !nr.state ||
      !nr.expirationDate ||
      !this.getNrApprovedName(nr) ||
      !nr.nrNum ||
      !nr.requestTypeCd ||
      !validRequestActionCodes.includes(nr.request_action_cd)
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
    // Y = consent required
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
   * Returns the Name Request's approved name (or undefined or null if not found).
   * @param nr the name request response payload
   */
  getNrApprovedName (nr: any): string {
    const names = nr?.names as Array<any>
    if (names?.length > 0) {
      return names.find(name => [NameRequestStates.APPROVED, NameRequestStates.CONDITION].includes(name.state))?.name
    }
    return null // should never happen
  }

  /** Map the request type to a display description.
   * @param nrRequestType The name request type code
   */
  getNrRequestDesc (nrRequestType: NrRequestActionCodes): string {
    switch (nrRequestType) {
      case NrRequestActionCodes.NEW_BUSINESS: return 'New Business'
      case NrRequestActionCodes.CHANGE_NAME: return 'Change of Name'
      case NrRequestActionCodes.CONVERSION: return 'Conversion'
      case NrRequestActionCodes.RESTORE: return 'Restoration'
      default: return null // should never happen
    }
  }
}
