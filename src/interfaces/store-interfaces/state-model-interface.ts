import {
  AccountInformationIF, AddressesIF, BusinessInformationIF, CertifyIF, CorrectionInformationIF,
  DocumentDeliveryIF, DocumentIdIF, EffectiveDateTimeIF, EntitySnapshotIF, FeesIF, FilingDataIF, NameTranslationIF,
  NewAlterationIF, PeopleAndRolesIF, RestorationStateIF, RulesMemorandumIF, ShareStructureIF,
  StateFilingRestorationIF, TombStoneIF, ValidationFlagsIF
} from '@/interfaces/'
import {
  CompletingPartyIF, ContactPointIF, NameRequestIF, SpecialResolutionIF, StaffPaymentIF
} from '@bcrs-shared-components/interfaces/'

export interface EditingFlagsIF {
  companyName: boolean
  associationType: boolean
  nameTranslations: boolean
  officeAddresses: boolean
  peopleAndRoles: boolean
  shareStructure: boolean
  rules: boolean
  memorandum: boolean
  specialResolution: boolean
}

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
  nameRequestLegalName: string
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
  rules: RulesMemorandumIF
  memorandum: RulesMemorandumIF
  editingFlags: EditingFlagsIF
  validationFlags: ValidationFlagsIF
  summaryMode: boolean,
  currentFees: FeesIF[],
  feePrices: FeesIF[],
  specialResolution: SpecialResolutionIF
  restoration: RestorationStateIF
  stateFilingRestoration: StateFilingRestorationIF,
  // document record service
  documentIdState: DocumentIdIF
}
