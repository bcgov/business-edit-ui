import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { mount } from '@vue/test-utils'
import YourCompany from '@/components/common/YourCompany/YourCompany.vue'

import { BcAlterationResource } from '@/resources/Alteration/BC'
import { BenAlterationResource } from '@/resources/Alteration/BEN'
import { CccAlterationResource } from '@/resources/Alteration/CCC'
import { UlcAlterationResource } from '@/resources/Alteration/ULC'

import { GpConversionResource } from '@/resources/Conversion/GP'
import { SpConversionResource } from '@/resources/Conversion/SP'

import { GpChangeResource } from '@/resources/Change/GP'
import { SpChangeResource } from '@/resources/Change/SP'

import { BcCorrectionResource } from '@/resources/Correction/BC'
import { BenCorrectionResource } from '@/resources/Correction/BEN'
import { CccCorrectionResource } from '@/resources/Correction/CCC'
import { GpCorrectionResource } from '@/resources/Correction/GP'
import { SpCorrectionResource } from '@/resources/Correction/SP'
import { UlcCorrectionResource } from '@/resources/Correction/ULC'

import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/CP'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

//
// ALTERATION TESTS
//
const alterationTests = [
  {
    entityType: 'BC',
    resourceModel: BcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'BC',
    resourceModel: BcAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    entityType: 'BEN',
    resourceModel: BenAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'BEN',
    resourceModel: BenAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    entityType: 'CC',
    resourceModel: CccAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'CC',
    resourceModel: CccAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  },
  {
    entityType: 'ULC',
    resourceModel: UlcAlterationResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'ULC',
    resourceModel: UlcAlterationResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number']
  }
]

for (const test of alterationTests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in an alteration filing', () => {
    const store = getVuexStore()

    it(`sets the correct options for a ${type} ${test.entityType}`, async () => {
      // init
      store.state.stateModel.tombstone.filingType = 'alteration'
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(YourCompany, {
        vuetify,
        store,
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

//
// CONVERSION TESTS
//
const conversionTests = [
  {
    entityType: 'GP',
    resourceModel: GpConversionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'SP',
    resourceModel: SpConversionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  }
]

for (const test of conversionTests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in a conversion filing', () => {
    const store = getVuexStore()

    it(`sets the correct options for a ${type} ${test.entityType}`, async () => {
      // init
      store.state.stateModel.tombstone.filingType = 'conversion'
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(YourCompany, {
        vuetify,
        store,
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

//
// CHANGE TESTS
//
const changeTests = [
  {
    entityType: 'GP',
    resourceModel: GpChangeResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'SP',
    resourceModel: SpChangeResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  }
]

for (const test of changeTests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in a change filing', () => {
    const store = getVuexStore()

    it(`sets the correct options for a ${type} ${test.entityType}`, async () => {
      // init
      store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(YourCompany, {
        vuetify,
        store,
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

//
// CORRECTION TESTS
//
const correctionTests = [
  {
    entityType: 'BEN',
    resourceModel: BenCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'BEN',
    resourceModel: BenCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    entityType: 'CC',
    resourceModel: CccCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'CC',
    resourceModel: CccCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    entityType: 'GP',
    resourceModel: GpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'BC',
    resourceModel: BcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'BC',
    resourceModel: BcCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  },
  {
    entityType: 'SP',
    resourceModel: SpCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'ULC',
    resourceModel: UlcCorrectionResource,
    isNumberedCompany: true,
    expectedOptions: ['correct-new-nr']
  },
  {
    entityType: 'ULC',
    resourceModel: UlcCorrectionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr', 'correct-name-to-number', 'correct-name']
  }
]

for (const test of correctionTests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in a correction filing', () => {
    const store = getVuexStore()

    it(`sets the correct options for a ${type} ${test.entityType}`, async () => {
      // init
      store.state.stateModel.tombstone.filingType = 'correction'
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(YourCompany, {
        vuetify,
        store,
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

//
// SPECIAL RESOLUTION TESTS
//
const specialResolutionTests = [
  {
    entityType: 'CP',
    resourceModel: CpSpecialResolutionResource,
    isNumberedCompany: false,
    expectedOptions: ['correct-new-nr']
  }
]

for (const test of specialResolutionTests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in a special resolution filing', () => {
    const store = getVuexStore()

    it(`sets the correct options for a ${type} ${test.entityType}`, async () => {
      // init
      store.state.stateModel.tombstone.filingType = 'specialResolution'
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      // mount
      const wrapper = mount(YourCompany, {
        vuetify,
        store,
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
