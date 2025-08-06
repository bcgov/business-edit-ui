import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount } from '@vue/test-utils'
import {
  AssociationType, BusinessContactInfo, CertifySection, CompletingParty, CourtOrderPoa, Detail, EntityName,
  OfficeAddresses, PeopleAndRoles, RecognitionDateTime, StaffPayment, YourCompanyWrapper
} from '@/components/common/'
import CoopCorrection from '@/views/Correction/CoopCorrection.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AuthorizationRoles, CoopTypes, CorrectionErrorTypes, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { Memorandum, Resolution, Rules } from '@/components/SpecialResolution'
import { AuthServices, LegalServices } from '@/services'
import { setAuthRole } from 'tests/set-auth-roles'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Coop Correction component', () => {
  let wrapper: any
  store.stateModel.tombstone.entityType = CorpTypeCd.COOP
  store.stateModel.tombstone.businessId = 'CP1234567'
  store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
  setAuthRole(store, AuthorizationRoles.STAFF)
  store.stateModel.completingParty = {
    firstName: 'First',
    lastName: 'Last',
    middleName: 'Middle',
    mailingAddress: {
      streetAddress: '123 Completing Ave',
      streetAddressAdditional: '',
      addressCity: 'Party',
      addressRegion: 'BC',
      postalCode: 'V0V 0V0',
      addressCountry: 'CA',
      deliveryInstructions: ''
    }
  }
  store.stateModel.entitySnapshot = {
    resolutions: [{
      date: '2020-02-02',
      id: 1,
      type: 'text'
    }]
  } as any

  beforeEach(async () => {
    // For Entity Snapshot
    LegalServices.fetchBusinessInfo = vi.fn().mockResolvedValue(
      {
        'adminFreeze': false,
        'allowedActions': {
          'filing': {
            'filingSubmissionLink': 'https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/CP1002552/filings',
            'filingTypes': [
              {
                'displayName': 'Admin Freeze',
                'feeCode': 'NOFEE',
                'name': 'adminFreeze'
              },
              {
                'displayName': 'Court Order',
                'feeCode': 'NOFEE',
                'name': 'courtOrder'
              },
              {
                'displayName': "Registrar's Notation",
                'feeCode': 'NOFEE',
                'name': 'registrarsNotation'
              },
              {
                'displayName': "Registrar's Order",
                'feeCode': 'NOFEE',
                'name': 'registrarsOrder'
              }
            ]
          }
        },
        'arMaxDate': '2023-06-15',
        'arMinDate': '2023-01-01',
        'associationType': 'HC',
        'complianceWarnings': [],
        'fiscalYearEndDate': '2022-07-27',
        'foundingDate': '2022-07-27T18:45:39.188112+00:00',
        'goodStanding': true,
        'hasCorrections': false,
        'hasCourtOrders': false,
        'hasRestrictions': false,
        'identifier': 'CP1002552',
        'lastAddressChangeDate': '2022-07-27',
        'lastAnnualGeneralMeetingDate': '',
        'lastAnnualReportDate': '',
        'lastDirectorChangeDate': '2022-08-29',
        'lastLedgerTimestamp': '2022-07-27T18:45:41.945395+00:00',
        'lastModified': '2023-06-05T17:20:51.087429+00:00',
        'legalName': 'SUPER SUPER COOP',
        'legalType': CorpTypeCd.COOP,
        'naicsCode': null,
        'naicsDescription': null,
        'naicsKey': null,
        'nextAnnualReport': '2023-07-27T07:00:00+00:00',
        'state': 'ACTIVE',
        'submitter': 'bcsc/xxx',
        'warnings': []
      }
    )

    AuthServices.fetchAuthInfo = vi.fn().mockResolvedValue({ contact: {
      email: 'hello@haha.com',
      phone: '(525) 252-5544',
      extension: ''
    } })

    LegalServices.fetchBusinessDocuments = vi.fn().mockResolvedValue(
      {
        'documents': {
          'certifiedMemorandum': 'https://xxx/api/v2/businesses/CP1002552/filings/145222/documents/certifiedMemorandum',
          'certifiedRules': 'https://xxx/api/v2/businesses/CP1002552/filings/145222/documents/certifiedRules'
        },
        'documentsInfo': {
          'certifiedMemorandum': {
            'includedInResolution': true,
            'includedInResolutionDate': '2023-06-05T17:20:51.087429+00:00',
            'key': 'test',
            'name': 'CP1002552 - Certified Memorandum - 2023-05-26.pdf',
            'uploaded': '2023-05-26T16:11:27.098606+00:00'
          },
          'certifiedRules': {
            'includedInResolution': true,
            'includedInResolutionDate': '2023-06-05T17:20:51.087429+00:00',
            'key': '304bf897-06ef-4868-94d7-c50419cc366f.pdf',
            'name': 'CP1002552 - Certified Rules - 2023-05-26.pdf',
            'uploaded': '2023-05-26T16:11:27.098606+00:00'
          }
        }
      }
    )

    LegalServices.fetchResolutions = vi.fn().mockResolvedValue([
      {
        'date': '2022-09-05',
        'id': 246918,
        'resolution': 'htgryrtyhrftghfg',
        'signatory': {
          'additionalName': 'HFH',
          'familyName': 'HFHFH',
          'givenName': 'HFGHF'
        },
        'signingDate': '2022-09-05',
        'subType': 'specialResolution',
        'type': 'SPECIAL'
      },
      {
        'date': '2023-05-16',
        'id': 259987,
        'resolution': '<p>fdfd</p>',
        'signatory': {
          'familyName': 'FD',
          'givenName': 'FDFD'
        },
        'signingDate': '2023-05-16',
        'subType': 'specialResolution',
        'type': 'SPECIAL'
      }
    ])

    LegalServices.fetchAddresses = vi.fn().mockResolvedValue([
      {
        'registeredOffice': {
          'deliveryAddress': {
            'addressCity': 'Scarborough',
            'addressCountry': 'CA',
            'addressRegion': 'BC',
            'addressType': 'delivery',
            'deliveryInstructions': null,
            'id': 2660329,
            'postalCode': 'M1B 4B9',
            'streetAddress': '34-70 Alford Cres',
            'streetAddressAdditional': ''
          },
          'mailingAddress': {
            'addressCity': 'Scarborough',
            'addressCountry': 'CA',
            'addressRegion': 'BC',
            'addressType': 'mailing',
            'deliveryInstructions': null,
            'id': 2660328,
            'postalCode': 'M1B 4B9',
            'streetAddress': '34-70 Alford Cres',
            'streetAddressAdditional': ''
          }
        }
      }

    ])

    LegalServices.fetchParties = vi.fn().mockResolvedValue([
      {
        officer: {
          id: 1,
          firstName: 'Joe',
          lastName: 'Swanson',
          middleName: 'P',
          organizationName: '',
          partyType: 'person',
          email: 'completing-party@example.com'
        },
        deliveryAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        mailingAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        roles: [{ appointmentDate: '2022-05-01', roleType: 'Director' }]
      },
      {
        officer: {
          id: 21,
          firstName: 'Joe2',
          lastName: 'Swanson',
          middleName: 'P',
          organizationName: '',
          partyType: 'person',
          email: 'completing-party@example.com'
        },
        deliveryAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        mailingAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        roles: [{ appointmentDate: '2022-05-01', roleType: 'Director' }]
      },
      {
        officer: {
          id: 33,
          firstName: 'Joef',
          lastName: 'Swanson',
          middleName: 'P',
          organizationName: '',
          partyType: 'person',
          email: 'completing-party@example.com'
        },
        deliveryAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        mailingAddress: {
          'addressCity': 'Scarborough',
          'addressCountry': 'CA',
          'addressRegion': 'BC',
          'addressType': 'mailing',
          'deliveryInstructions': null,
          'id': 2660328,
          'postalCode': 'M1B 4B9',
          'streetAddress': '34-70 Alford Cres',
          'streetAddressAdditional': ''
        },
        roles: [{ appointmentDate: '2022-05-01', roleType: 'Director' }]
      }
    ])

    wrapper = mount(CoopCorrection, {
      vuetify,
      propsData: {
        correctionFiling: {
          business: {},
          correction: { correctedFilingId: 123 },
          header: {
            documentIdState: {
              consumerDocumentId: 'DS12345678',
              valid: true
            }
          }
        }
      } })

    await flushPromises()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders COOP Correction view', () => {
    expect(wrapper.findComponent(CoopCorrection).exists()).toBe(true)
  })

  it('loads each component', async () => {
    expect(wrapper.findComponent(YourCompanyWrapper).exists()).toBe(true)
    expect(wrapper.findComponent(EntityName).exists()).toBe(true)
    expect(wrapper.findComponent(AssociationType).exists()).toBe(true)
    expect(wrapper.findComponent(RecognitionDateTime).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Rules).exists()).toBe(true)
    expect(wrapper.findComponent(Memorandum).exists()).toBe(true)
    expect(wrapper.findComponent(Resolution).exists()).toBe(true)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)
  })

  it('not loads resolution when it has no resolution on file', async () => {
    store.stateModel.entitySnapshot.resolutions = []
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(YourCompanyWrapper).exists()).toBe(true)
    expect(wrapper.findComponent(EntityName).exists()).toBe(true)
    expect(wrapper.findComponent(AssociationType).exists()).toBe(true)
    expect(wrapper.findComponent(RecognitionDateTime).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Rules).exists()).toBe(true)
    expect(wrapper.findComponent(Memorandum).exists()).toBe(true)
    expect(wrapper.findComponent(Resolution).exists()).toBe(false)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)
  })

  it('staff view - has the correct components displaying', async () => {
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.STAFF
    await Vue.nextTick()
    expect(wrapper.findComponent(YourCompanyWrapper).isVisible()).toBe(true)
    expect(wrapper.findComponent(EntityName).isVisible()).toBe(true)
    expect(wrapper.findComponent(AssociationType).isVisible()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).isVisible()).toBe(true)
    expect(wrapper.findComponent(PeopleAndRoles).isVisible()).toBe(true)
    expect(wrapper.findComponent(Rules).isVisible()).toBe(true)
    expect(wrapper.findComponent(Memorandum).isVisible()).toBe(true)
    expect(wrapper.findComponent(Resolution).isVisible()).toBe(true)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(false)
    expect(wrapper.findComponent(Detail).isVisible()).toBe(true)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(false)
    expect(wrapper.findComponent(CourtOrderPoa).isVisible()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).isVisible()).toBe(true)
  })

  it('client view - has the correct components displaying', async () => {
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.CLIENT
    await Vue.nextTick()
    expect(wrapper.findComponent(YourCompanyWrapper).isVisible()).toBe(true)
    expect(wrapper.findComponent(EntityName).isVisible()).toBe(true)
    expect(wrapper.findComponent(AssociationType).isVisible()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).isVisible()).toBe(true)
    expect(wrapper.findComponent(PeopleAndRoles).isVisible()).toBe(true)
    expect(wrapper.findComponent(Rules).isVisible()).toBe(true)
    expect(wrapper.findComponent(Memorandum).isVisible()).toBe(true)
    expect(wrapper.findComponent(Resolution).isVisible()).toBe(true)
    expect(wrapper.findComponent(CompletingParty).isVisible()).toBe(true)
    expect(wrapper.findComponent(Detail).isVisible()).toBe(true)
    expect(wrapper.findComponent(CertifySection).isVisible()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoa).isVisible()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).isVisible()).toBe(true)
  })

  it('isCorrectionEditing check no save or no file and pay', async () => {
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.CLIENT
    await Vue.nextTick()

    expect(store.stateModel.editingFlags.associationType).toBe(false)
    expect(store.stateModel.editingFlags.rules).toBe(false)
    expect(store.stateModel.editingFlags.memorandum).toBe(false)
    expect(store.stateModel.editingFlags.specialResolution).toBe(false)
    expect(store.isCorrectionEditing).toBe(false)

    await wrapper.find('#btn-edit-association-type').trigger('click')
    expect(store.stateModel.editingFlags.associationType).toBe(true)
    await wrapper.find('#btn-change-rules').trigger('click')
    expect(store.stateModel.editingFlags.rules).toBe(true)
    await wrapper.find('#btn-change-memorandum').trigger('click')
    expect(store.stateModel.editingFlags.memorandum).toBe(true)
    await wrapper.find('#btn-change-resolution').trigger('click')
    expect(store.stateModel.editingFlags.specialResolution).toBe(true)
    // These editing flags plus more make up isCorrectionEditing
    // This property is used to disable the save and file and pay buttons.
    expect(store.isCorrectionEditing).toBe(true)
  })

  it('isCorrectionValid and hasCorrectionDataChanged', async () => {
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.CLIENT
    await Vue.nextTick()

    expect(store.getFlagsCompanyInfo.isValidAssociationType).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidOrgPersons).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidRules).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidMemorandum).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidSpecialResolution).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidSpecialResolutionSignature).toBe(true)
    expect(store.getFlagsCompanyInfo.isValidResolutionDate).toBe(true)

    // Non edit fields.
    expect(store.getFlagsReviewCertify.isValidDetailComment).toBe(false)
    expect(store.getFlagsReviewCertify.isValidCertify).toBe(false)

    // These validation flags plus more make up isCorrectionValid
    // This property is used enable/disable the file and pay button.
    expect(store.isCorrectionValid).toBe(false)
    expect(store.hasCorrectionDataChanged).toBe(false)
    store.stateModel.nameRequestLegalName = 'SUPER SUPER COOP 2'
    expect(store.hasBusinessNameChanged).toBe(true)
    store.stateModel.businessInformation.associationType = CoopTypes.ORDINARY_COOPERATIVE
    expect(store.hasAssociationTypeChanged).toBe(true)
    store.stateModel.memorandum.includedInResolution = true
    expect(store.hasSpecialResolutionMemorandumChanged).toBe(true)
    store.stateModel.rules.includedInResolution = true
    expect(store.hasSpecialResolutionRulesChanged).toBe(true)
    store.stateModel.specialResolution.resolution = 'NEW RESOLUTION'
    expect(store.hasSpecialResolutionResolutionChanged).toBe(true)
    // These change flags make up hasCorrectionDataChanged
    // This property is used to enable/disable the file and pay button.
    expect(store.hasCorrectionDataChanged).toBe(true)
  })
})
