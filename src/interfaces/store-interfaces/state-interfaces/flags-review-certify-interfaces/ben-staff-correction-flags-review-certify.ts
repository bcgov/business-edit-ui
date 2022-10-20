/**
 * Validity flags for BEN staff correction Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - add any new components that need validation before filing and paying
 */
export interface BenStaffCorrectionFlagsReviewCertifyIF {
  isValidDetailComment: boolean,
  isValidStaffPayment: boolean
}
