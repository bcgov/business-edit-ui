/**
 * Validity flags for staff correction Review and Certify page components. Note:
 * - order doesn't matter in an object
 * - add any new components that need validation before filing and paying
 */
export interface FirmStaffCorrectionFlagsReviewCertifyIF {
  isValidDetailComment: boolean,
  isValidStaffPayment: boolean
}
