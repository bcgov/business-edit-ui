import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, shallowMount } from '@vue/test-utils'
import EntityName from '@/components/common/YourCompany/EntityName.vue'

import { AlterationResourceBc } from '@/resources/Alteration/BC'
import { AlterationResourceBen } from '@/resources/Alteration/BEN'
import { AlterationResourceCc } from '@/resources/Alteration/CC'
import { AlterationResourceUlc } from '@/resources/Alteration/ULC'

import { ChangeResourceGp } from '@/resources/Change/GP'
import { ChangeResourceSp } from '@/resources/Change/SP'

import { ConversionResourceGp } from '@/resources/Conversion/GP'
import { ConversionResourceSp } from '@/resources/Conversion/SP'

import { CorrectionResourceBc } from '@/resources/Correction/BC'
import { CorrectionResourceBen } from '@/resources/Correction/BEN'
import { CorrectionResourceCc } from '@/resources/Correction/CC'
import { CorrectionResourceGp } from '@/resources/Correction/GP'
import { CorrectionResourceSp } from '@/resources/Correction/SP'
import { CorrectionResourceUlc } from '@/resources/Correction/ULC'

import { SpecialResolutionResourceCp } from '@/resources/SpecialResolution/CP'

import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorrectNameOptions, FilingTypes, NameRequestStates, NrRequestActionCodes }
  from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

const alterationTests = [
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: AlterationResourceBc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: AlterationResourceBc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: AlterationResourceBen,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: AlterationResourceBen,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: AlterationResourceCc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: AlterationResourceCc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: AlterationResourceUlc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: AlterationResourceUlc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  }
]

const changeTests = [
  {
    filingType: FilingTypes.CHANGE_OF_REGISTRATION,
    entityType: CorpTypeCd.PARTNERSHIP,
    resourceModel: ChangeResourceGp,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CHANGE_OF_REGISTRATION,
    entityType: CorpTypeCd.SOLE_PROP,
    resourceModel: ChangeResourceSp,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  }
]

const conversionTests = [
  {
    filingType: FilingTypes.CONVERSION,
    entityType: CorpTypeCd.PARTNERSHIP,
    resourceModel: ConversionResourceGp,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CONVERSION,
    entityType: CorpTypeCd.SOLE_PROP,
    resourceModel: ConversionResourceSp,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  }
]

const correctionTests = [
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: CorrectionResourceBen,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: CorrectionResourceBen,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NAME
    ]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: CorrectionResourceCc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: CorrectionResourceCc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NAME
    ]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.PARTNERSHIP,
    resourceModel: CorrectionResourceGp,
    isNumberedCompany: false,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: CorrectionResourceBc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: CorrectionResourceBc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NAME
    ]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.SOLE_PROP,
    resourceModel: CorrectionResourceSp,
    isNumberedCompany: false,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: CorrectionResourceUlc,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: CorrectionResourceUlc,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NAME
    ]
  }
]

const specialResolutionTests = [
  {
    filingType: FilingTypes.SPECIAL_RESOLUTION,
    entityType: CorpTypeCd.COOP,
    resourceModel: SpecialResolutionResourceCp,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  }
]

/** A function that runs the specified test. */
function runTest (test: any) {
  const label = (test.isNumberedCompany === true)
    ? `numbered ${test.entityType}`
    : (test.isNumberedCompany === false)
      ? `named ${test.entityType}`
      : test.entityType

  describe(`Name Change Options for filing type "${test.filingType}"`, () => {
    it(`sets the correct options for a ${label}`, async () => {
      // init
      store.stateModel.tombstone.filingType = test.filingType
      store.stateModel.tombstone.entityType = test.entityType
      store.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(EntityName, {
        vuetify,
        computed: { isNumberedCompany: () => test.isNumberedCompany }
      })
      await Vue.nextTick()
      const vm = wrapper.vm as any

      // verify
      expect(vm.correctNameChoices).toEqual(test.expectedOptions)

      // verify name edit section (if rendered)
      const btn = wrapper.find('#btn-correct-company-name')
      if (btn.exists()) {
        await btn.trigger('click')

        // FUTURE: check button text (Change, Correct, Edit)

        // check for expected Correct Name Options panels
        if (test.expectedOptions.includes(CorrectNameOptions.CORRECT_NEW_NR)) {
          expect(wrapper.find('#x-panel-correct-new-nr').exists()).toBe(true)
        }
        if (test.expectedOptions.includes(CorrectNameOptions.CORRECT_NAME_TO_NUMBER)) {
          expect(wrapper.find('#x-panel-correct-name-to-number').exists()).toBe(true)
        }
        if (test.expectedOptions.includes(CorrectNameOptions.CORRECT_NAME)) {
          expect(wrapper.find('#x-panel-correct-name').exists()).toBe(true)
        }
      }

      // cleanup
      wrapper.destroy()
    })
  })
}

for (const test of alterationTests) runTest(test)
for (const test of changeTests) runTest(test)
for (const test of conversionTests) runTest(test)
for (const test of correctionTests) runTest(test)
for (const test of specialResolutionTests) runTest(test)

describe('Name Changes for a SP alteration', () => {
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: CorpTypeCd.SOLE_PROP
    }
  }

  beforeEach(() => {
    // Set original business Data
    store.stateModel.summaryMode = false
    store.stateModel.nameRequestLegalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = AlterationResourceBen

    wrapper = mount(EntityName, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the business type and message after changing to a numbered Company', async () => {
    expect(wrapper.find('.company-name').text()).toBe('Mock Original Name')

    // Set new Name
    store.stateModel.nameRequestLegalName = 'My Benefit Company'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.info-text')

    expect(wrapper.find('.company-name').text()).toBe('My Benefit Company')
    expect(companyInfo.at(0).text()).toBe('BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('The name of this business will be the current Incorporation ' +
      'Number followed by "B.C. Ltd."')
  })

  it('displays the Name Request information when NR data changes', async () => {
    store.stateModel.nameRequest.nrNum = 'NR1234567'
    store.stateModel.nameRequest.legalType = CorpTypeCd.BC_COMPANY as any
    store.stateModel.nameRequest.expirationDate = '2021-03-10T08:00:00+00:00'
    store.stateModel.nameRequest.state = NameRequestStates.APPROVED
    store.stateModel.nameRequest.request_action_cd = NrRequestActionCodes.NEW_BUSINESS
    store.stateModel.nameRequest.applicants = {
      addrLine1: '123 Mock Lane',
      addrLine2: null,
      addrLine3: null,
      city: 'Victoria',
      countryTypeCd: 'CA',
      emailAddress: null,
      firstName: 'Mock',
      lastName: 'Name',
      middleName: 'Full',
      phoneNumber: '2501234567',
      postalCd: '1t2 3t4',
      stateProvinceCd: 'BC'
    } as any
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.company-info')

    // Verify the conflict flag is true when the NR legal type is different than the current business type
    expect(wrapper.vm.isConflictingLegalType).toBe(true)

    expect(companyInfo.at(0).text()).toBe('Business Type: BC Limited Company')
    expect(companyInfo.at(1).text()).toBe('Request Type: New Business')
    expect(companyInfo.at(2).text()).toBe('Expiry Date: March 10, 2021 at 12:00 am Pacific time')
    expect(companyInfo.at(3).text()).toBe('Status: approved')

    const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')

    expect(nameRequestApplicantInfo.at(0).text()).toBe('Name: Mock Full Name')
    expect(nameRequestApplicantInfo.at(1).text()).toBe('Address: 123 Mock Lane, Victoria, BC, 1t2 3t4, CA')
    expect(nameRequestApplicantInfo.at(2).text()).toBe('Email: N/A')
    expect(nameRequestApplicantInfo.at(3).text()).toBe('Phone: (250) 123-4567')
  })
})

describe('Name Changes by Type change', () => {
  it('displays the edited label when the company name has changed and is not changed by type', () => {
    store.stateModel.tombstone.nameChangedByType = true
    // set up the component with a changed company name and not changed by type
    const wrapper = shallowMount(EntityName, {
      data () {
        return {
          hasCompanyNameChanged: true,
          getEditedLabel: 'Edited'
        }
      }
    })

    // check that the edited label and reminder is displayed
    expect(wrapper.text()).toContain('Edited')
    expect(wrapper.text()).toMatch(
      /We have changed your numbered company\s+name based on the business type you selected\./
    )
  })
})
