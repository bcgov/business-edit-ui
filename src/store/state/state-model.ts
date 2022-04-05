import { EmptyNameRequest, StateModelIF, EmptyFees } from '@/interfaces'
import { EmptyContactPoint } from '@bcrs-shared-components/interfaces'
import { cloneDeep } from 'lodash'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    filingType: null,
    keycloakRoles: [],
    authRoles: [],
    userInfo: null,
    businessId: '',
    entityType: null,
    currentDate: '',
    filingDateTime: '',
    filingId: 0,
    correctedFilingId: null,
    isSaving: false,
    isSavingResuming: false,
    isFilingPaying: false,
    ignoreChanges: false,
    haveUnsavedChanges: false,
    folioNumber: '',
    transactionalFolioNumber: ''
  },
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
      isValidTransactionalFolioNumber: true,
      isValidCertify: false, // initially un-signed
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
  originalIA: {
    header: {
      name: '',
      certifiedBy: '',
      date: '',
      folioNumber: '',
      effectiveDate: '',
      isFutureEffective: null
    },
    business: {
      legalType: null,
      identifier: ''
    },
    incorporationApplication: {
      nameRequest: {
        legalType: ''
      },
      nameTranslations: [],
      offices: {},
      contactPoint: {
        email: '',
        phone: '',
        extension: null
      },
      parties: [],
      shareStructure: {
        shareClasses: []
      },
      incorporationAgreement: {
        agreementType: ''
      }
    }
  },
  originalAlteration: {
    header: {
      name: '',
      certifiedBy: '',
      date: '',
      folioNumber: '',
      effectiveDate: '',
      isFutureEffective: null
    },
    business: {
      foundingDate: '',
      legalName: '',
      legalType: '',
      identifier: ''
    },
    alteration: {
      provisionsRemoved: null,
      business: {
        legalType: null,
        identifier: ''
      },
      nameRequest: { ...EmptyNameRequest },
      nameTranslations: [],
      shareStructure: {
        resolutionDates: [],
        shareClasses: []
      },
      contactPoint: {
        email: '',
        phone: '',
        extension: null
      },
      courtOrder: {
        fileNumber: '',
        hasPlanOfArrangement: false
      }
    }
  },
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
  changedFlags: {
    defineCompanyStep: false
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
