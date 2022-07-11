import { EmptyNameRequest, StateModelIF, EmptyFees } from '@/interfaces/'
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
    correctedFilingId: null,
    isSaving: false,
    isSavingResuming: false,
    isFilingPaying: false,
    ignoreChanges: false,
    haveUnsavedChanges: false,
    folioNumber: '',
    transactionalFolioNumber: '',
    type: ''
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
      isValidNatureOfBusiness: true,
      isValidAddress: true,
      isValidContactInfo: true,
      isValidFolioInfo: true,
      isValidOrgPersons: true,
      isValidShareStructure: true,
      isValidCompanyProvisions: true,
      isValidResolutionDate: true
    },
    flagsReviewCertify: {
      // NB: this must be in same order as ComponentsReviewCertify enum!
      isValidEffectiveDate: true,
      isValidDocumentOptionalEmail: true,
      isValidCompletingParty: true,
      isValidTransactionalFolioNumber: true,
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
  businessContact: cloneDeep(EmptyContactPoint),
  businessInformation: {
    legalType: null,
    identifier: ''
  },
  nameRequest: {
    legalType: null,
    legalName: '',
    nrNumber: '',
    details: {},
    applicant: {
      firstName: '',
      middleName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      countryTypeCode: '',
      postalCode: '',
      stateProvinceCode: ''
    },
    filingId: null
  },
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
    valid: false,
    changed: false,
    orgPeople: []
  },
  shareStructureStep: {
    valid: false,
    changed: false,
    resolutionDates: [],
    previousResolutionDates: [],
    shareClasses: []
  },
  incorporationAgreementStep: {
    valid: false,
    changed: false,
    agreementType: null
  },
  effectiveDateTime: {
    isFutureEffective: null,
    dateTimeString: ''
  },
  correctedFiling: null,
  entitySnapshot: null,
  staffPaymentStep: {
    valid: false,
    staffPayment: {
      option: NaN,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    }
  },
  filingData: {
    filingTypeCode: null,
    entityType: null,
    priority: false,
    waiveFees: false
  },
  detail: {
    valid: false,
    comment: ''
  },
  editingFlags: {
    companyName: false,
    nameTranslations: false,
    officeAddresses: false,
    folioNumber: false,
    peopleAndRoles: false,
    shareStructure: false,
    incorporationAgreement: false
  },
  validFlags: {
    defineCompanyStep: false
  },
  summaryMode: false,
  currentFees: cloneDeep(EmptyFees),
  feePrices: cloneDeep(EmptyFees)
}
