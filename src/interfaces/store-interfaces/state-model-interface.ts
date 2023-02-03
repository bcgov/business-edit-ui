import { AccountInformationIF, AddressesIF, BusinessInformationIF, CertifyIF,
  CorrectionInformationIF, DocumentDeliveryIF, EffectiveDateTimeIF, EntitySnapshotIF,
  FeesIF, FilingDataIF, PeopleAndRolesIF, NameRequestIF, NameTranslationIF,
  NewAlterationIF, RestorationStateIF, ShareStructureIF, TombStoneIF,
  ValidationFlagsIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, SpecialResolutionIF, StaffPaymentIF }
  from '@bcrs-shared-components/interfaces/'

/** Data object used internally only (not to/from API). */
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombStoneIF
  completingParty: CompletingPartyIF
  newAlteration: NewAlterationIF
  accountInformation: AccountInformationIF
  businessContact: ContactPointIF
  businessInformation: BusinessInformationIF
  correctionInformation: CorrectionInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  certifyState: CertifyIF
  documentDelivery: DocumentDeliveryIF
  officeAddresses: AddressesIF
  peopleAndRoles: PeopleAndRolesIF
  shareStructureStep: ShareStructureIF
  effectiveDateTime: EffectiveDateTimeIF
  entitySnapshot: EntitySnapshotIF
  staffPayment: StaffPaymentIF
  filingData: FilingDataIF[]
  detailComment: string
  editingFlags: {
    companyName: boolean
    nameTranslations: boolean
    officeAddresses: boolean
    folioNumber: boolean
    peopleAndRoles: boolean
    shareStructure: boolean
  }
  validationFlags: ValidationFlagsIF
  summaryMode: boolean,
  currentFees: FeesIF[],
  feePrices: FeesIF[],
  specialResolution: SpecialResolutionIF
  restoration: RestorationStateIF
}
