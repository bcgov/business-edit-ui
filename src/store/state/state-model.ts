import { EmptyFees, EmptyNameRequest, StateModelIF } from '@/interfaces/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { EmptyContactPoint } from '@bcrs-shared-components/interfaces/'
import { cloneDeep } from 'lodash'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    filingType: null,
    keycloakRoles: [],
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
    transactionalFolioNumber: ''
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
      isValidCreateSpecialResolution: true,
      isValidApprovalType: true,
      isValidExtensionTime: true
    },
    flagsReviewCertify: {
      // NB: this must be in same order as ComponentsReviewCertify enum!
      isValidEffectiveDate: true,
      isValidDocumentOptionalEmail: true,
      isValidCompletingParty: true,
      isValidTransactionalFolioNumber: true,
      isValidDetailComment: true,
      isValidSpecialResolutionConfirm: true,
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
  businessInformation: {
    legalType: null,
    identifier: '',
    associationType: null
  },
  correctionInformation: {
    comment: '',
    correctedFilingDate: null,
    correctedFilingId: null,
    correctedFilingType: null,
    parties: null,
    startDate: null,
    type: null
  },
  nameRequest: { ...EmptyNameRequest },
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
    nameTranslations: false,
    officeAddresses: false,
    folioNumber: false,
    peopleAndRoles: false,
    shareStructure: false
  },
  summaryMode: false,
  currentFees: [cloneDeep(EmptyFees)],
  feePrices: [cloneDeep(EmptyFees)],
  specialResolution: {
    resolution: '',
    signatory: {
      givenName: '',
      familyName: '',
      additionalName: null
    },
    resolutionConfirmed: false
  },
  restoration: {
    approvalType: null,
    approvalTypeValid: true,
    businessNameValid: false,
    expiry: null,
    expiryValid: true,
    type: null
  },
  stateFilingRestoration: null
}
