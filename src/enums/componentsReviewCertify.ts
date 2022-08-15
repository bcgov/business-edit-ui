/**
 * List of components on Review and Certify page. Note:
 * - these values MUST match component IDs to scroll correctly
 * - order this according to component layout
 * - this list must match `FlagsReviewCertifyIF`
 */
export enum ComponentsReviewCertify {
  'effective-date-time',
  'document-delivery-section',
  'completing-party-section',
  'transactional-folio-number-section',
  'detail-section',
  'special-resolution-confirm', // to focus on this component before certify
  'certify-section',
  'court-order',
  'staff-payment'
}
