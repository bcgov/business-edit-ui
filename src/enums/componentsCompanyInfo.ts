/**
 * List of components on Company Info page. Note:
 * - these values must match component IDs to scroll correctly
 * - order this according to component layout
 * - order must match stateModel.validationFlags.flagsCompanyInfo
 * - this list must match `FlagsCompanyInfoIF`
 */
export enum ComponentsCompanyInfo {
  'company-name-section',
  'change-business-type',
  'name-translation',
  'business-start-date',
  'nature-of-business',
  'office-addresses',
  'business-contact-info',
  'folio-number-section',
  'people-and-roles',
  'share-structures',
  'company-provisions',
  'resolution-dates',
  'association-type',
  'rules',
  'memorandum',
  'special-resolution-editor',
  'special-resolution-signing-party',
  'approval-type-section',
  'relationships-panel',
  'extension-time-section'
}
