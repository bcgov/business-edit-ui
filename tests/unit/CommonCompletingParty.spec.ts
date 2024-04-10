import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import CompletingParty from '@/components/common/CompletingParty.vue'
import { CompletingParty as CompletingPartyShared } from '@bcrs-shared-components/completing-party/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Test Case Data
// GP will come soon
const firmTestCases = [
  {
    entityType: 'SP',
    isPremium: false,
    isStaff: false
  },
  {
    entityType: 'GP',
    isPremium: true,
    isStaff: false
  }
]

for (const test of firmTestCases) {
  const type = test.isPremium ? 'premium' : test.isStaff ? 'staff' : 'regular'

  // FUTURE: Fix the error in BaseAddress in sbc-common
  describe.skip(`Completing Party view for a ${test.entityType} as a ${type} user`, () => {
    let wrapper: any

    beforeAll(() => {
      store.stateModel.tombstone.keycloakRoles = ['staff']
      store.stateModel.tombstone.businessId = 'BC1234567'
      store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
      store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
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
      wrapper = mount(
        CompletingParty,
        { vuetify }
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('displays Completing Party section', async () => {
      expect(wrapper.findComponent(CompletingParty).exists()).toBe(true)
      expect(wrapper.findComponent(CompletingPartyShared).exists()).toBe(true)

      expect(wrapper.find('#completing-party-section').exists()).toBe(true)
      expect(wrapper.find('#completing-party').exists()).toBe(true)
      const input1 = wrapper.find('#person__first-name')
      const input2 = wrapper.find('#person__middle-name')
      const input3 = wrapper.find('#person__last-name')
      expect(input1.exists()).toBe(true)
      expect(input2.exists()).toBe(true)
      expect(input3.exists()).toBe(true)

      // verify name lengths are valid
      await input1.setValue('Name length is okay')
      await input2.setValue('Name length is okay')
      await input3.setValue('Name length is okay')
      expect(input1.element.value).toBe('Name length is okay')
      expect(input2.element.value).toBe('Name length is okay')
      expect(input3.element.value).toBe('Name length is okay')
      const validMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(validMessages.length).toBe(0)

      // verify name lengths are invalid
      await input1.setValue('Name length is over 20')
      await input2.setValue('Name length is over 20')
      await input3.setValue('Name length is over 30 with many characters')
      const errorMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(errorMessages.length).toBe(3)
      expect(errorMessages.at(0).text()).toBe('Cannot exceed 20 characters')
      expect(errorMessages.at(1).text()).toBe('Cannot exceed 20 characters')
      expect(errorMessages.at(2).text()).toBe('Cannot exceed 20 characters')
    })
  })
}
