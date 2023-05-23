import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import EntityName from '@/components/common/YourCompany/EntityName.vue'

import { BcAlterationResource } from '@/resources/Alteration/BC'
import { BenAlterationResource } from '@/resources/Alteration/BEN'
import { CccAlterationResource } from '@/resources/Alteration/CCC'
import { UlcAlterationResource } from '@/resources/Alteration/ULC'

import { GpChangeResource } from '@/resources/Change/GP'
import { SpChangeResource } from '@/resources/Change/SP'

import { GpConversionResource } from '@/resources/Conversion/GP'
import { SpConversionResource } from '@/resources/Conversion/SP'

import { BcCorrectionResource } from '@/resources/Correction/BC'
import { BenCorrectionResource } from '@/resources/Correction/BEN'
import { CccCorrectionResource } from '@/resources/Correction/CCC'
import { GpCorrectionResource } from '@/resources/Correction/GP'
import { SpCorrectionResource } from '@/resources/Correction/SP'
import { UlcCorrectionResource } from '@/resources/Correction/ULC'

import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/CP'

import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorrectNameOptions, FilingTypes, NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NameRequestStates } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

const alterationTests = [
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: BcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: BcAlterationResource,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: BenAlterationResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: BenAlterationResource,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: CccAlterationResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: CccAlterationResource,
    isNumberedCompany: false,
    expectedOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: UlcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.ALTERATION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: UlcAlterationResource,
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
    resourceModel: GpChangeResource,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CHANGE_OF_REGISTRATION,
    entityType: CorpTypeCd.SOLE_PROP,
    resourceModel: SpChangeResource,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  }
]

const conversionTests = [
  {
    filingType: FilingTypes.CONVERSION,
    entityType: CorpTypeCd.PARTNERSHIP,
    resourceModel: GpConversionResource,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CONVERSION,
    entityType: CorpTypeCd.SOLE_PROP,
    resourceModel: SpConversionResource,
    isNumberedCompany: null,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  }
]

const correctionTests = [
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: BenCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    resourceModel: BenCorrectionResource,
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
    resourceModel: CccCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_CCC,
    resourceModel: CccCorrectionResource,
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
    resourceModel: GpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: BcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_COMPANY,
    resourceModel: BcCorrectionResource,
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
    resourceModel: SpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: UlcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: [CorrectNameOptions.CORRECT_NEW_NR]
  },
  {
    filingType: FilingTypes.CORRECTION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    resourceModel: UlcCorrectionResource,
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
    resourceModel: CpSpecialResolutionResource,
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
      expect(vm.correctionNameChoices).toEqual(test.expectedOptions)

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
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = BenAlterationResource

    wrapper = mount(EntityName, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the business type and message after changing to a numbered Company', async () => {
    expect(wrapper.find('.company-name').text()).toBe('Mock Original Name')

    // Set new Name
    store.stateModel.nameRequest.legalName = 'My Benefit Company'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.info-text')

    expect(wrapper.find('.company-name').text()).toBe('My Benefit Company')
    expect(companyInfo.at(0).text()).toBe('BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('The name of this business will be the current Incorporation ' +
      'Number followed by "B.C. Ltd."')
  })

  it('displays the Name Request information when NR data changes', async () => {
    store.stateModel.nameRequest.nrNumber = 'NR1234567'
    store.stateModel.nameRequest.legalType = CorpTypeCd.BC_CORPORATION
    store.stateModel.nameRequest.expiry = '2021-03-10T08:00:00+00:00'
    store.stateModel.nameRequest.status = NameRequestStates.APPROVED
    store.stateModel.nameRequest.requestType = NrRequestActionCodes.NEW_BUSINESS
    store.stateModel.nameRequest.applicant = {
      fullName: 'Mock Full Name',
      fullAddress: '123 Mock Lane, Victoria, BC, 1t2 3t4, CA',
      phoneNumber: '2501234567'
    } as any
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.company-info')

    // Verify the conflict flag is true when the NR legal type is different than the current business type
    expect(wrapper.vm.isConflictingLegalType).toBe(true)

    expect(companyInfo.at(0).text()).toBe('Business Type:  BC Company')
    expect(companyInfo.at(1).text()).toBe('Request Type:  New Business')
    expect(companyInfo.at(2).text()).toBe('Expiry Date:  March 10, 2021 at 12:00 am Pacific time')
    expect(companyInfo.at(3).text()).toBe('Status:  approved')

    const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')

    expect(nameRequestApplicantInfo.at(0).text()).toBe('Name:  Mock Full Name')
    expect(nameRequestApplicantInfo.at(1).text()).toBe('Address:  123 Mock Lane, Victoria, BC, 1t2 3t4, CA')
    expect(nameRequestApplicantInfo.at(2).text()).toBe('Email:  N/A')
    expect(nameRequestApplicantInfo.at(3).text()).toBe('Phone:  (250) 123-4567')
  })
})
