import { ActionIF, ActionKvIF, AddressesIF, BusinessInformationIF, CertifyIF, EntitySnapshotIF,
  NameRequestIF, NameTranslationIF, OrgPersonIF, FeesIF, ResourceIF, FilingDataIF,
  CorrectionInformationIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF,
  NaicsIF, ShareClassIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces/'
import { FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export const setEntityType: ActionIF = ({ commit }, entityType: CorpTypeCd): void => {
  commit('mutateEntityType', entityType)
}

export const setBusinessId: ActionIF = ({ commit }, businessId): void => {
  commit('mutateBusinessId', businessId)
}

export const setIsSaving: ActionIF = ({ commit }, isSaving): void => {
  commit('mutateIsSaving', isSaving)
}

export const setIsSavingResuming: ActionIF = ({ commit }, isSavingResuming): void => {
  commit('mutateIsSavingResuming', isSavingResuming)
}

export const setIsFilingPaying: ActionIF = ({ commit }, isFilingPaying): void => {
  commit('mutateIsFilingPaying', isFilingPaying)
}

export const setKeycloakRoles: ActionIF = ({ commit }, keycloakRoles): void => {
  commit('mutateKeycloakRoles', keycloakRoles)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setUserInfo: ActionIF = ({ commit }, userInfo): void => {
  commit('mutateUserInfo', userInfo)
}

export const setOrgInfo: ActionIF = ({ commit }, orgInfo): void => {
  commit('mutateOrgInfo', orgInfo)
}

export const setCurrentDate: ActionIF = ({ commit }, dateString: string): void => {
  commit('mutateCurrentDate', dateString)
}

export const setCurrentJsDate: ActionIF = ({ commit }, date: Date): void => {
  commit('mutateCurrentJsDate', date)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective: boolean): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDateTimeString: ActionIF = ({ commit }, dateTime: string): void => {
  commit('mutateEffectiveDateTimeString', dateTime)
}

export const setAlterationEffectiveDateValid: ActionIF = ({ commit }, valid: boolean): void => {
  commit('mutateAlterationEffectiveDateValid', valid)
}

export const setResource: ActionIF = ({ commit }, resource: ResourceIF): void => {
  commit('mutateResource', resource)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState: CertifyIF): void => {
  commit('mutateCertifyState', certifyState)
}

export const setAlterationCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateAlterationCertifyStateValidity', validity)
}

export const setBenClientCorrectionCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateBenClientCorrectionCertifyStateValidity', validity)
}

export const setChangeCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateChangeCertifyStateValidity', validity)
}

export const setFirmClientCorrectionCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateFirmClientCorrectionCertifyStateValidity', validity)
}

export const setSpecialResolutionCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateSpecialResolutionCertifyStateValidity', validity)
}

export const setDocumentOptionalEmail: ActionIF = ({ commit }, documentOptionalEmail: string): void => {
  commit('mutateDocumentOptionalEmail', documentOptionalEmail)
}

export const setAlterationDocumentOptionalEmailValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateAlterationDocumentOptionalEmailValidity', validity)
}

export const setChangeDocumentOptionalEmailValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateChangeDocumentOptionalEmailValidity', validity)
}

export const setSpecialResolutionDocumentOptionalEmailValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateSpecialResolutionDocumentOptionalEmailValidity', validity)
}

export const setCompletingParty: ActionIF = ({ commit }, cp: CompletingPartyIF): void => {
  commit('mutateCompletingParty', cp)
}

export const setChangeCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateChangeCompletingPartyValidity', validity)
}

export const setConversionCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateConversionCompletingPartyValidity', validity)
}

export const setFirmClientCorrectionCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateFirmClientCorrectionCompletingPartyValidity', validity)
}

export const setSpecialResolutionCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateSpecialResolutionCompletingPartyValidity', validity)
}

export const setTransactionalFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateTransactionalFolioNumber', folioNumber)
}

export const setAlterationTransactionalFolioNumberValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateAlterationTransactionalFolioNumberValidity', validity)
}

export const setChangeTransactionalFolioNumberValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateChangeTransactionalFolioNumberValidity', validity)
}

export const setSpecialResolutionTransactionalFolioNumberValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateSpecialResolutionTransactionalFolioNumberValidity', validity)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact: ContactPointIF): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setOfficeAddresses: ActionIF = ({ commit }, addresses: AddressesIF): void => {
  commit('mutateOfficeAddresses', addresses)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInformation): void => {
  commit('mutateAccountInformation', accountInformation)
}

export const setBusinessInformation: ActionIF = ({ commit }, businessInformation: BusinessInformationIF): void => {
  commit('mutateBusinessInformation', businessInformation)
}

export const setCorrectionInformation: ActionIF = ({ commit }, correctionInformation: CorrectionInformationIF)
: void => {
  commit('mutateCorrectionInformation', correctionInformation)
}

export const setCorrectionStartDate: ActionIF = ({ commit }, startDate: string): void => {
  commit('mutateCorrectionStartDate', startDate)
}

export const setNameRequest: ActionIF = ({ commit }, nameRequest: NameRequestIF): void => {
  commit('mutateNameRequest', nameRequest)
}

export const setNameTranslations: ActionIF = ({ commit }, nameTranslations: NameTranslationIF[]): void => {
  commit('mutateNameTranslations', nameTranslations)
}

export const setFilingId: ActionIF = ({ commit }, filingId: number): void => {
  commit('mutateFilingId', filingId)
}

export const setPeopleAndRoles: ActionIF = ({ commit }, peopleAndRoles: OrgPersonIF[]) => {
  commit('mutatePeopleAndRoles', peopleAndRoles)
}

export const setPeopleAndRolesChanged: ActionIF = ({ commit }, changed: boolean) => {
  commit('mutatePeopleAndRolesChanged', changed)
}

export const setPeopleAndRolesValidity: ActionIF = ({ commit }, validity: boolean) => {
  commit('mutatePeopleAndRolesValidity', validity)
}

export const setShareClasses: ActionIF = ({ commit }, shareClasses: ShareClassIF[]) => {
  commit('mutateShareClasses', shareClasses)
}

export const setShareStructureChanged: ActionIF = ({ commit }, changed: boolean) => {
  commit('mutateShareStructureChanged', changed)
}

export const setCreateShareStructureStepValidity: ActionIF = ({ commit }, validity: boolean) => {
  commit('mutateCreateShareStructureStepValidity', validity)
}

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges: boolean): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveUnsavedChanges: ActionIF = ({ commit }, haveUnsavedChanges: boolean): void => {
  commit('mutateHaveUnsavedChanges', haveUnsavedChanges)
}

export const setEntitySnapshot: ActionIF = ({ commit }, entitySnapshot: EntitySnapshotIF): void => {
  commit('mutateEntitySnapshot', entitySnapshot)
}

export const setStaffPayment: ActionIF = ({ commit }, staffPayment): void => {
  commit('mutateStaffPayment', staffPayment)
}

export const setBenStaffCorrectionStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateBenStaffCorrectionStaffPaymentValidity', validity)
}

export const setBenClientCorrectionStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateBenClientCorrectionStaffPaymentValidity', validity)
}

export const setAlterationStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateAlterationStaffPaymentValidity', validity)
}

export const setChangeStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateChangeStaffPaymentValidity', validity)
}

export const setFirmClientCorrectionStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateFirmClientCorrectionStaffPaymentValidity', validity)
}

export const setFirmStaffCorrectionStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateFirmStaffCorrectionStaffPaymentValidity', validity)
}

export const setSpecialResolutionStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateSpecialResolutionStaffPaymentValidity', validity)
}

export const setFilingData: ActionIF = ({ commit }, filingData: FilingDataIF[]): void => {
  commit('mutateFilingData', filingData)
}

export const setDetailComment: ActionIF = ({ commit }, comment: string): void => {
  commit('mutateDetailComment', comment)
}

export const setBenStaffCorrectionDetailValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateBenStaffCorrectionDetailValidity', validity)
}

export const setBenClientCorrectionDetailValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateBenClientCorrectionDetailValidity', validity)
}

export const setFirmClientCorrectionDetailValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateFirmClientCorrectionDetailValidity', validity)
}

export const setFirmStaffCorrectionDetailValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateFirmStaffCorrectionDetailValidity', validity)
}

export const setEditingCompanyName: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingCompanyName', editing)
}

export const setEditingNameTranslations: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingNameTranslations', editing)
}

export const setEditingOfficeAddresses: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingOfficeAddresses', editing)
}

export const setEditingFolioNumber: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingFolioNumber', editing)
}

export const setEditingPeopleAndRoles: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingPeopleAndRoles', editing)
}

export const setEditingShareStructure: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingShareStructure', editing)
}

export const setSummaryMode: ActionIF = ({ commit }, summaryMode: boolean): void => {
  commit('mutateSummaryMode', summaryMode)
}

export const setFilingType: ActionIF = ({ commit }, filingType: FilingTypes): void => {
  commit('mutateFilingType', filingType)
}

export const setProvisionsRemoved: ActionIF = ({ commit }, provisionsRemoved: boolean): void => {
  commit('mutateProvisionsRemoved', provisionsRemoved)
}

export const setNewResolutionDates: ActionIF = ({ commit }, resolutionDates: string[]): void => {
  commit('mutateSpecialResolutionDates', resolutionDates)
}

export const setFileNumber: ActionIF = ({ commit }, courtOrderNumber: string): void => {
  commit('mutateFileNumber', courtOrderNumber)
}

export const setHasPlanOfArrangement: ActionIF = ({ commit }, hasPoa: boolean): void => {
  commit('mutateHasPlanOfArrangement', hasPoa)
}

export const setAppValidate: ActionIF = ({ commit }, validate: boolean): void => {
  commit('mutateAppValidate', validate)
}

export const setComponentValidate: ActionIF = ({ commit }, validate: boolean): void => {
  commit('mutateComponentValidate', validate)
}

export const setAlterationValidCourtOrder: ActionIF = ({ commit }, isValid: boolean): void => {
  commit('mutateAlterationValidCourtOrder', isValid)
}

export const setChangeValidCourtOrder: ActionIF = ({ commit }, isValid: boolean): void => {
  commit('mutateChangeValidCourtOrder', isValid)
}

export const setCurrentFees: ActionIF = ({ commit }, fees: FeesIF[]): void => {
  commit('mutateCurrentFees', fees)
}

export const setFeePrices: ActionIF = ({ commit }, feePrices: FeesIF[]): void => {
  commit('mutateFeePrices', feePrices)
}

export const setValidComponent: ActionIF = ({ commit }, kv: ActionKvIF): void => {
  commit('mutateIsValidComponent', kv)
}

export const setNaics: ActionIF = ({ commit }, naics: NaicsIF): void => {
  commit('mutateNaics', naics)
}

export const setSpecialResolution = ({ commit }, specialResolution: SpecialResolutionIF) => {
  commit('mutateSpecialResolution', specialResolution)
}

export const setSpecialResolutionConfirmStateValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateSpecialResolutionConfirmStateValidity', validity)
}
