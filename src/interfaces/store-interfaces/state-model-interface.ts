import {
  AccountInformationIF, AddressesIF, CertifyIF, NameRequestIF, TombStoneIF, PeopleAndRolesIF, ShareStructureIF,
  EffectiveDateTimeIF, IncorporationAgreementIF, BusinessInformationIF, CorrectedFilingIF, FilingDataIF,
  StaffPaymentStepIF, DetailIF, NameTranslationIF, EntitySnapshotIF, DocumentDeliveryIF, FeesIF, NewAlterationIF,
  ValidationFlagsIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF } from '@bcrs-shared-components/interfaces/'

/** Data object used internally only (not to/from API). */
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombStoneIF
  completingParty: CompletingPartyIF
  newAlteration: NewAlterationIF
  accountInformation: AccountInformationIF
  businessContact: ContactPointIF
  businessInformation: BusinessInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  certifyState: CertifyIF
  documentDelivery: DocumentDeliveryIF
  officeAddresses: AddressesIF
  peopleAndRoles: PeopleAndRolesIF
  shareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  effectiveDateTime: EffectiveDateTimeIF
  correctedFiling: CorrectedFilingIF
  entitySnapshot: EntitySnapshotIF
  staffPaymentStep: StaffPaymentStepIF
  filingData: FilingDataIF
  detail: DetailIF
  editingFlags: {
    companyName: boolean
    nameTranslations: boolean
    officeAddresses: boolean
    folioNumber: boolean
    peopleAndRoles: boolean
    shareStructure: boolean
    incorporationAgreement: boolean
  }
  validationFlags: ValidationFlagsIF
  validFlags: {
    // FUTURE: move all flags here
    defineCompanyStep: boolean
  }
  summaryMode: boolean,
  currentFees: FeesIF,
  feePrices: FeesIF
}
