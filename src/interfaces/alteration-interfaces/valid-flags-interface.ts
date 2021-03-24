
export interface ValidFlagsIF {
  isValidEffectiveDate: boolean,
  isValidCourtNum: boolean,
  isValidStaffPayment?: boolean,
  isValidCertify?: boolean,
  isValidDocumentOptionalEmail?: boolean
  // To be expanded for any components that need validation before file and pay
}
