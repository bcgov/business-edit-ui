/**
 * Validity flags for Change Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - this list must match `ChangeReviewCertify`
 * - add any new components that need validation before filing and paying
 */
export interface ChangeFlagsReviewCertifyIF {
  isValidDocumentOptionalEmail?: boolean // staff only
  isValidCompletingParty: boolean
  isValidTransactionalFolioNumber?: boolean // not staff
  isValidCertify: boolean
  isValidCourtOrder?: boolean // staff only
  isValidStaffPayment?: boolean // staff only
}
