import { CourtOrderIF, FlagsReviewCertifyIF, FlagsCompanyInfoIF } from './'

export interface NewAlterationIF {
  appValidate: boolean
  componentValidate: boolean
  provisionsRemoved: boolean
  courtOrder: CourtOrderIF
  flagsReviewCertify: FlagsReviewCertifyIF
  flagsCompanyInfo: FlagsCompanyInfoIF
}
