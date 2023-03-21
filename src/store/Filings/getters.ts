import { RoleTypes } from '@/enums'
import { v4 as uuidv4 } from 'uuid'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { RestorationTypes } from '@bcrs-shared-components/enums/restoration-types'
import { EntitySnapshotIF, OrgPersonIF } from '@/interfaces'

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

  getApplicantOrgPerson (_state, getters): OrgPersonIF[] {
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
  },

  /** Whether the entity is a BC Company. */
  isBcCompanyFilings (state: any): boolean {
    return (state.businessInfo.legalType === CorpTypeCd.BC_COMPANY)
  },

  /** Whether the entity is a Community Contribution Company. */
  isBcCccFilings (state: any): boolean {
    return (state.businessInfo.legalType === CorpTypeCd.BC_CCC)
  },

  /** Whether the entity is an Unlimited Liability Company. */
  isBcUlcCompanyFilings (state: any): boolean {
    return (state.businessInfo.legalType === CorpTypeCd.BC_ULC_COMPANY)
  },

  /** Whether the entity is a Benefit Company. */
  isBenefitCompanyFilings (state: any): boolean {
    return (state.businessInfo.legalType === CorpTypeCd.BENEFIT_COMPANY)
  },

  getPayUrlFiling (_state: any): string {
    return sessionStorage.getItem('PAY_API_URL')
  },

  isLimitedConversionRestorationFiling (state: any): boolean {
    console.log('check', state.restorationFiling.restoration.type, RestorationTypes.LTD_TO_FULL)
    return state.restorationFiling.restoration.type === RestorationTypes.LTD_TO_FULL
  },

  isLimitedExtendRestorationFiling (state: any): boolean {
    return state.restorationFiling.restoration.type === RestorationTypes.LTD_EXTEND
  },

  getEntitySnapshotFiling (state: any, getters): EntitySnapshotIF {
    return {
      businessInfo: state.businessInfo,
      authInfo: state.authInfo,
      addresses: state.addresses,
      nameTranslations: state.nameTranslations,
      orgPersons: getters.getApplicantOrgPerson
    }
  }

}
