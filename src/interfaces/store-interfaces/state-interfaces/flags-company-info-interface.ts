/**
 * Validity flags for Company Info page components. Note:
 * - order doesn't matter in an object
 * - this list must match `ComponentsCompanyInfo`
 * - add any new components that need validation before proceeding to Review and Confirm page
 */
export interface FlagsCompanyInfoIF {
  isValidCompanyName: boolean
  isValidBusinessType: boolean
  isValidNameTranslation: boolean
  isValidNatureOfBusiness: boolean
  isValidAddress: boolean
  isValidContactInfo: boolean
  isValidFolioInfo: boolean
  isValidOrgPersons: boolean
  isValidShareStructure: boolean
  isValidCompanyProvisions: boolean
  isValidResolutionDate: boolean
  isValidStartDate: boolean
  isValidAssociationType: boolean
  isValidSpecialResolutionForm: boolean
}
