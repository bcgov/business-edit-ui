/**
 * Validity flags for Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - this list must match `ComponentsReviewCertify`
 * - this list must match `stateModel`
 */
export interface FlagsReviewCertifyIF {
  isValidEffectiveDate: boolean
  isValidDocumentOptionalEmail?: boolean // staff only
  isValidCompletingParty: boolean
  isValidTransactionalFolioNumber?: boolean // not staff
  isValidDetailComment?: boolean // corrections only
  isValidSpecialResolutionConfirm?: boolean
  isValidCertify: boolean
  isValidCourtOrder?: boolean // staff only
  isValidDocumentId?: boolean // staff only
  isValidStaffPayment?: boolean // staff only
}
