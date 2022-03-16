import { FlagsReviewCertifyIF, FlagsCompanyInfoIF } from './'

export interface ValidationFlagsIF {
  appValidate: boolean
  componentValidate: boolean
  flagsReviewCertify: FlagsReviewCertifyIF
  flagsCompanyInfo: FlagsCompanyInfoIF
}
