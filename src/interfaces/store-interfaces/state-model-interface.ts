import {
  AccountInformationIF, AddressesIF, CertifyIF, NameRequestIF, TombStoneIF, PeopleAndRolesIF, ShareStructureIF,
  EffectiveDateTimeIF, CorrectionInformationIF, BusinessInformationIF, FilingDataIF, StaffPaymentStepIF,
  DetailIF, NameTranslationIF, EntitySnapshotIF, DocumentDeliveryIF, FeesIF, NewAlterationIF, ValidationFlagsIF
} from '@/interfaces/'
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
  staffPaymentStep: StaffPaymentStepIF
  filingData: FilingDataIF[]
  detail: DetailIF
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
  feePrices: FeesIF[]
}
