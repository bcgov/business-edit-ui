export interface ValidFlagsIF {
  isValidEffectiveDate: boolean,
  isValidFileNum: boolean,
  isValidStaffPayment?: boolean,
  isValidCertify?: boolean,
  isValidDocumentOptionalEmail?: boolean
  // To be expanded for any components that need validation before file and pay
}
