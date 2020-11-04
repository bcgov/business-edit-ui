import {
  AccountInformationIF, AlterationFilingIF, CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF, PeopleAndRolesIF,
  ShareStructureIF, DateTimeIF, IncorporationAgreementIF, BusinessInformationIF, IncorporationFilingIF,
  FilingDataIF, StaffPaymentStepIF, DetailIF, NameTranslationIF, NameTranslationDraftIF
} from '@/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombStoneIF
  accountInformation: AccountInformationIF
  businessInformation: BusinessInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF | NameTranslationDraftIF[]
  certifyState: CertifyIF
  defineCompanyStep: DefineCompanyIF
  peopleAndRolesStep: PeopleAndRolesIF
  shareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  incorporationDateTime: DateTimeIF
  originalIA: IncorporationFilingIF
  originalAlteration: AlterationFilingIF
  staffPaymentStep: StaffPaymentStepIF
  filingData: FilingDataIF
  detail: DetailIF
  editingFlags: {
    companyName: boolean
    nameTranslations: boolean
    officeAddresses: boolean
    peopleAndRoles: boolean
    shareStructure: boolean
    incorporationAgreement: boolean
  }
}
