/**
 * Validity flags for Company Info page components. Note:
 * - order doesn't matter in an object
 * - add any new components that need validation before proceeding to Review and Confirm page
 * - this list must match `ComponentsCompanyInfo`
 */
export interface FlagsCompanyInfoIF {
  isValidCompanyName: boolean
  isValidBusinessType: boolean
  isValidNameTranslation: boolean
  isValidStartDate: boolean
  isValidNatureOfBusiness: boolean
  isValidAddress: boolean
  isValidContactInfo: boolean
  isValidFolioInfo: boolean
  isValidOrgPersons: boolean
  isValidShareStructure: boolean
  isValidCompanyProvisions: boolean
  isValidResolutionDate: boolean
  isValidAssociationType: boolean
  isValidRules: boolean
  isValidMemorandum: boolean
  isValidSpecialResolution: boolean
  isValidSpecialResolutionSignature: boolean
  isValidRelationship: boolean
  isValidApprovalType: boolean
  isValidExtensionTime: boolean
}
