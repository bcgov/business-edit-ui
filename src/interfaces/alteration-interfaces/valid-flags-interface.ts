export interface ValidFlagsIF {
  isValidEffectiveDate: boolean,
  isValidFileNum: boolean,
  isValidCertify?: boolean,
  isValidCourtOrder?: boolean,
  isValidStaffPayment?: boolean,
  isValidDocumentOptionalEmail?: boolean
  // To be expanded for any components that need validation before file and pay
}
