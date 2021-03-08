import {
  AccountInformationIF, AlterationFilingIF, CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF, PeopleAndRolesIF,
  ShareStructureIF, EffectiveDateTimeIF, IncorporationAgreementIF, BusinessInformationIF, IncorporationFilingIF,
  FilingDataIF, StaffPaymentStepIF, DetailIF, NameTranslationIF, BusinessSnapshotIF
} from '@/interfaces'

/** Data object used internally only (not to/from API). */
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombStoneIF
  accountInformation: AccountInformationIF
  businessInformation: BusinessInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  certifyState: CertifyIF
  defineCompanyStep: DefineCompanyIF
  peopleAndRolesStep: PeopleAndRolesIF
  shareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  effectiveDateTime: EffectiveDateTimeIF
  originalIA: IncorporationFilingIF
  originalAlteration: AlterationFilingIF
  originalSnapshot: BusinessSnapshotIF[]
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
  summaryMode: boolean
}
