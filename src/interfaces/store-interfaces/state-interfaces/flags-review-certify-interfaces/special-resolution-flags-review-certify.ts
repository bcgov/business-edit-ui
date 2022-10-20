/**
 * Validity flags for Special Resolution Review and Certify page components.
 * Note:
 * - order doesn't matter in an object
 * - this list must match `SpecialResolutionReviewCertify`
 * - add any new components that need validation before filing and paying
 */
export interface SpecialResolutionFlagsReviewCertifyIF {
  isValidSpecialResolutionConfirm?: boolean
  isValidDocumentOptionalEmail?: boolean // staff only
  isValidTransactionalFolioNumber?: boolean // not staff
  isValidCompletingParty: boolean
  isValidCertify: boolean
  isValidStaffPayment?: boolean // staff only
}
