import { RoleTypes } from '@/enums'
import { v4 as uuidv4 } from 'uuid'

export default {
  getBusinessInfo (state: any): any {
    return state.businessInfo
  },

  getAddresses (state: any): any {
    return state.addresses
  },

  getRestorationFiling (state: any): any {
    return state.restorationFiling
  },

  getAliases (state: any): any {
    return state.nameTranslations
  },

  getDirectors (state: any): any {
    return state.orgPersons
  },

  getAuthData (state: any): any {
    return state.authInfo
  },

  getStateFilingUrl (_state, getters): any {
    return getters.getBusinessInfo.stateFiling
  },

  getStateFilingData (state: any) {
    return state.stateFilingData
  },

  getApplicantOrgPerson (_state, getters) {
    const parties = getters.getRestorationFiling.restoration?.parties || []

    // find first applicant from fetched parties
    const applicant = parties.find(
      orgPerson => orgPerson.roles.some(role => role.roleType === RoleTypes.APPLICANT)
    )
    if (applicant) {
      let applicantOrgPerson: Array<any> = []
      applicantOrgPerson.push({
        deliveryAddress: applicant.deliveryAddress,
        mailingAddress: applicant.mailingAddress,
        officer: {
          email: applicant.officer.email,
          firstName: applicant.officer.firstName,
          lastName: applicant.officer.lastName,
          middleName: applicant.officer.middleName,
          organizationName: applicant.officer.organizationName,
          partyType: applicant.officer.partyType,
          id: uuidv4()
        },
        roles: applicant.roles
      })
      return applicantOrgPerson
    }
    return {}
  }
}
