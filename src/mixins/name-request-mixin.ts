// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { NameRequestStates, EntityTypes } from '@/enums'
import { NameRequestIF } from '@/interfaces'
import { DateMixin } from '@/mixins'
import { axios } from '@/utils'
import { NOT_FOUND } from 'http-status-codes'

/**
 * Mixin for processing Name Request objects.
 */
@Component({})
export default class NameRequestMixin extends Mixins(DateMixin) {
  /** Fetches NR and validates it. */
  async validateNameRequest (nrNumber: string, applicantPhone?: string, applicantEmail?: string): Promise<any> {
    let nrResponse = await this.fetchNameRequest(nrNumber).catch(error => {
      console.log(error)
      this.$root.$emit('invalid-name-request', NameRequestStates.NOT_FOUND)
      throw new Error(`Fetch Name Request error: ${error}`)
    })

    // Validate email / phone
    if ((applicantPhone && nrResponse.applicants?.phoneNumber !== applicantPhone) ||
      (applicantEmail && nrResponse.applicants?.emailAddress !== applicantEmail)) {
      this.$root.$emit('invalid-name-request', NameRequestStates.NOT_FOUND)
      throw new Error(`Invalid Phone or Email`)
    }

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
    return nrResponse
  }

  /**
   * Fetches name request data.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the NR data, or null if not found
   */
  fetchNameRequest (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      }).catch(error => {
        throw error
      })
  }

  /**
   * Generates Name Request state for the store.
   * @param nr the name request response payload
   * @param filingId the filing id
   */
  generateNameRequestState (nr: any, filingId: number): NameRequestIF {
    return {
      nrNumber: nr.nrNum,
      // TODO: Update entityType to use nr.requestTypeCd when namex supports our entity types
      entityType: EntityTypes.BCOMP,
      filingId: filingId,
      applicant: {
        // Address Information
        addressLine1: nr.applicants.addrLine1,
        addressLine2: nr.applicants.addrLine2,
        addressLine3: nr.applicants.addrLine3,
        city: nr.applicants.city,
        countryTypeCode: nr.applicants.countryTypeCd,
        postalCode: nr.applicants.postalCd,
        stateProvinceCode: nr.applicants.stateProvinceCd,

        // Application contact information
        emailAddress: nr.applicants.emailAddress,
        phoneNumber: nr.applicants.phoneNumber,

        // Application name information
        firstName: nr.applicants.firstName,
        middleName: nr.applicants.middleName,
        lastName: nr.applicants.lastName
      },
      details: {
        approvedName: this._getApprovedName(nr),
        consentFlag: nr.consentFlag,
        expirationDate: nr.expirationDate,
        status: nr.state
      }
    }
  }

  /**
   * Returns True if the Name Request data is valid.
   * @param nr the name request response payload
   * */
  isNrValid (nr: any): boolean {
    // TODO: implement check for supported entity types when namex supports BCOMP
    return Boolean(nr &&
      nr.state &&
      nr.expirationDate &&
      nr.names?.length > 0 &&
      nr.nrNum &&
      nr.requestTypeCd)
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

    // If the NR is expired, it is not consumable.
    const expireDays = this.daysFromToday(nr.expirationDate)
    if (isNaN(expireDays) || expireDays < 1) {
      return NameRequestStates.EXPIRED
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
    if (nr.state !== NameRequestStates.APPROVED && nr.state !== NameRequestStates.CONDITIONAL) {
      return NameRequestStates.NOT_APPROVED
    }

    // If the NR has already been consumed, it is not consumable.
    if (nr.names.some(name => name.consumptionDate)) {
      return NameRequestStates.CONSUMED
    }

    // Otherwise, the NR is consumable.
    return nr.state // APPROVED or CONDITIONAL
  }

  /**
   * Returns the Name Request's approved name.
   * @param nr the name request response payload
   */
  _getApprovedName (nr: any): string {
    if (nr.state === NameRequestStates.APPROVED) {
      return nr.names.find(name => name.state === NameRequestStates.APPROVED).name
    }
    if (nr.state === NameRequestStates.CONDITIONAL) {
      return nr.names.find(name => name.state === NameRequestStates.CONDITION).name
    }
    return '' // should never happen
  }
}
