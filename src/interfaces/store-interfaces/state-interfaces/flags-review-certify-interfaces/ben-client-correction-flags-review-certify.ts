/**
 * Validity flags for BEN Client correction Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - add any new components that need validation before filing and paying
 */
export interface BenClientCorrectionFlagsReviewCertifyIF {
  isValidDetailComment: boolean,
  isValidCertify: boolean,
  isValidStaffPayment: boolean
}
