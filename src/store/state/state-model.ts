import { EmptyBusinessInfo, EmptyFees, StateModelIF } from '@/interfaces/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { EmptyContactPoint, EmptyNameRequest } from '@bcrs-shared-components/interfaces/'
import { cloneDeep } from 'lodash'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    filingType: null,
    authRoles: [],
    userInfo: null,
    orgInfo: null,
    businessId: '',
    entityType: null,
    currentDate: '',
    filingId: 0,
    isSaving: false,
    isSavingResuming: false,
    isFilingPaying: false,
    ignoreChanges: false,
    haveUnsavedChanges: false,
    folioNumber: '',
    transactionalFolioNumber: '',
    nameChangedByType: false,
    nameChangedToNumber: false,
    entityTypeChangedByName: false
  },
  completingParty: null,
  newAlteration: {
    provisionsRemoved: null,
    courtOrder: {
      fileNumber: '',
      hasPlanOfArrangement: false
    }
  },
  validationFlags: {
    appValidate: false,
    componentValidate: false,
    flagsCompanyInfo: {
      // NB: this must be in same order as ComponentsCompanyInfo enum!
      isValidCompanyName: true,
      isValidBusinessType: true,
      isValidNameTranslation: true,
      isValidStartDate: true,
      isValidNatureOfBusiness: true,
      isValidAddress: true,
      isValidContactInfo: true,
      isValidFolioInfo: true,
      isValidOrgPersons: true,
      isValidShareStructure: true,
      isValidCompanyProvisions: true,
      isValidResolutionDate: true,
      isValidAssociationType: true,
      isValidRules: true,
      isValidMemorandum: true,
      isValidSpecialResolution: true,
      isValidSpecialResolutionSignature: true,
      isValidRelationship: true,
      isValidApprovalType: true,
      isValidExtensionTime: true
    },
    flagsReviewCertify: {
      // NB: this must be in same order as ComponentsReviewCertify enum!
      isValidSpecialResolutionConfirm: true,
      isValidEffectiveDate: true,
      isValidDocumentOptionalEmail: true,
      isValidCompletingParty: true,
      isValidTransactionalFolioNumber: true,
      isValidDetailComment: true,
      isValidCertify: false, // initially un-certified
      isValidCourtOrder: true,
      isValidStaffPayment: true
    }
  },
  accountInformation: {
    accountType: '',
    id: null,
    label: '',
    type: ''
  },
  businessContact: { ...EmptyContactPoint },
  businessInformation: { ...EmptyBusinessInfo },
  correctionInformation: {
    comment: '',
    correctedFilingDate: null,
    correctedFilingId: null,
    correctedFilingType: null,
    parties: null,
    startDate: null,
    type: null
  },
  nameRequest: cloneDeep(EmptyNameRequest),
  nameRequestLegalName: null,
  nameTranslations: [],
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  documentDelivery: {
    documentOptionalEmail: ''
  },
  officeAddresses: null,
  peopleAndRoles: {
    changed: false,
    orgPeople: []
  },
  shareStructureStep: {
    changed: false,
    resolutionDates: [],
    shareClasses: []
  },
  effectiveDateTime: {
    isFutureEffective: null,
    dateTimeString: ''
  },
  entitySnapshot: null,
  staffPayment: {
    option: StaffPaymentOptions.NONE,
    routingSlipNumber: '',
    bcolAccountNumber: '',
    datNumber: '',
    folioNumber: '',
    isPriority: false
  },
  filingData: [{
    filingTypeCode: null,
    entityType: null,
    priority: false,
    waiveFees: false
  }],
  detailComment: '',
  editingFlags: {
    companyName: false,
    associationType: false,
    nameTranslations: false,
    officeAddresses: false,
    peopleAndRoles: false,
    shareStructure: false,
    rules: false,
    memorandum: false,
    specialResolution: false
  },
  summaryMode: false,
  currentFees: [cloneDeep(EmptyFees)],
  feePrices: [cloneDeep(EmptyFees)],
  specialResolution: {
    resolution: '',
    signatory: {
      givenName: '',
      familyName: '',
      additionalName: ''
    },
    resolutionConfirmed: false
  },
  restoration: {
    approvalType: null,
    courtOrder: {
      fileNumber: null
    },
    expiry: null,
    relationships: [],
    type: null
  },
  stateFilingRestoration: null,
  rules: null,
  memorandum: null
}
