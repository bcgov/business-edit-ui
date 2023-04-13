import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import YourCompany from '@/components/common/YourCompany/YourCompany.vue'

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

Vue.use(Vuetify)
const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

const alterationTests = [
  {
    filingType: 'alteration',
    entityType: 'BC',
    resourceModel: BcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'alteration',
    entityType: 'BC',
    resourceModel: BcAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    filingType: 'alteration',
    entityType: 'BEN',
    resourceModel: BenAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'alteration',
    entityType: 'BEN',
    resourceModel: BenAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    filingType: 'alteration',
    entityType: 'CC',
    resourceModel: CccAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'alteration',
    entityType: 'CC',
    resourceModel: CccAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    filingType: 'alteration',
    entityType: 'ULC',
    resourceModel: UlcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'alteration',
    entityType: 'ULC',
    resourceModel: UlcAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  }
]

const changeTests = [
  {
    filingType: 'changeOfRegistration',
    entityType: 'GP',
    resourceModel: GpChangeResource,
    isNumberedCompany: null,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'changeOfRegistration',
    entityType: 'SP',
    resourceModel: SpChangeResource,
    isNumberedCompany: null,
    expectedOptions: ['correct-new-nr']
  }
]

const conversionTests = [
  {
    filingType: 'conversion',
    entityType: 'GP',
    resourceModel: GpConversionResource,
    isNumberedCompany: null,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'conversion',
    entityType: 'SP',
    resourceModel: SpConversionResource,
    isNumberedCompany: null,
    expectedOptions: ['correct-new-nr']
  }
]

const correctionTests = [
  {
    filingType: 'correction',
    entityType: 'BEN',
    resourceModel: BenCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'BEN',
    resourceModel: BenCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    filingType: 'correction',
    entityType: 'CC',
    resourceModel: CccCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'CC',
    resourceModel: CccCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    filingType: 'correction',
    entityType: 'GP',
    resourceModel: GpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'BC',
    resourceModel: BcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'BC',
    resourceModel: BcCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    filingType: 'correction',
    entityType: 'SP',
    resourceModel: SpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'ULC',
    resourceModel: UlcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    filingType: 'correction',
    entityType: 'ULC',
    resourceModel: UlcCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  }
]

const specialResolutionTests = [
  {
    filingType: 'specialResolution',
    entityType: 'CP',
    resourceModel: CpSpecialResolutionResource,
    isNumberedCompany: null,
    expectedOptions: ['correct-new-nr']
  }
]

/** A function that runs the specified test. */
function runTest (test) {
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
      const wrapper = mount(YourCompany, {
        vuetify,
        computed: { isNumberedCompany: () => test.isNumberedCompany }
      })
      await Vue.nextTick()
      const vm = wrapper.vm as any

      // verify
      expect(vm.nameChangeOptions).toEqual(test.expectedOptions)

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
