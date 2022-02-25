import {
  AccountInformationIF, AlterationFilingIF, CertifyIF, NameRequestIF, TombStoneIF, PeopleAndRolesIF, ShareStructureIF,
  EffectiveDateTimeIF, IncorporationAddressIf, IncorporationAgreementIF, BusinessInformationIF, IncorporationFilingIF,
  FilingDataIF, StaffPaymentStepIF, DetailIF, NameTranslationIF, EntitySnapshotIF, DocumentDeliveryIF, FeesIF,
  NewAlterationIF
} from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/** Data object used internally only (not to/from API). */
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombStoneIF
  newAlteration: NewAlterationIF
  accountInformation: AccountInformationIF
  businessContact: ContactPointIF
  businessInformation: BusinessInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  certifyState: CertifyIF
  documentDelivery: DocumentDeliveryIF
  officeAddresses: IncorporationAddressIf | {}
  peopleAndRolesStep: PeopleAndRolesIF
  shareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  effectiveDateTime: EffectiveDateTimeIF
  originalIA: IncorporationFilingIF
  originalAlteration: AlterationFilingIF
  entitySnapshot: EntitySnapshotIF
  staffPaymentStep: StaffPaymentStepIF
  filingData: FilingDataIF
  detail: DetailIF
  changedFlags: {
    // FUTURE: move all flags here
    defineCompanyStep: boolean
  }
  editingFlags: {
    companyName: boolean
    nameTranslations: boolean
    officeAddresses: boolean
    folioNumber: boolean
    peopleAndRoles: boolean
    shareStructure: boolean
    incorporationAgreement: boolean
  }
  validFlags: {
    // FUTURE: move all flags here
    defineCompanyStep: boolean
  }
  summaryMode: boolean,
  currentFees: FeesIF,
  feePrices: FeesIF
}
