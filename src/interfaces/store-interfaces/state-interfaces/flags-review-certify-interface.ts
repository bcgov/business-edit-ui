/**
 * Validity flags for Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - this list must match `ComponentsReviewCertify`
 * - add any new components that need validation before filing and paying
 */
export interface FlagsReviewCertifyIF {
  isValidEffectiveDate: boolean
  isValidDocumentOptionalEmail?: boolean // staff only
  isValidTransactionalFolioNumber?: boolean // not staff
  isValidCertify: boolean
  isValidCourtOrder?: boolean // staff only
  isValidStaffPayment?: boolean // staff only
}
