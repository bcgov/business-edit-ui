import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import CompletingParty from '@/components/common/CompletingParty.vue'
import { CompletingParty as CompletingPartyShared } from '@bcrs-shared-components/completing-party/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AuthorizationRoles, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { setAuthRole } from 'tests/set-auth-roles'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Test Case Data
// GP will come soon
const firmTestCases = [
  {
    entityType: 'SP',
    isStaff: false
  },
  {
    entityType: 'GP',
    isStaff: false
  }
]

for (const test of firmTestCases) {
  const type = test.isStaff ? 'staff' : 'regular'

  describe(`Completing Party view for a ${test.entityType} as a ${type} user`, () => {
    let wrapper: any

    beforeAll(() => {
      setAuthRole(store, AuthorizationRoles.STAFF)
      store.stateModel.tombstone.businessId = 'BC1234567'
      store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
      store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
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

      // set all valid values
      await input1.setValue('Name length is okay')
      await input2.setValue('Name length is okay')
      await input3.setValue('Name length is okay')
      // verify input values are updated
      expect(input1.element.value).toBe('Name length is okay')
      expect(input2.element.value).toBe('Name length is okay')
      expect(input3.element.value).toBe('Name length is okay')
      // wait for validation to update
      await wrapper.vm.$nextTick()
      // verify name lengths are valid (no errors)
      const validMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(validMessages.length).toBe(0)

      // set all invalid values
      await input1.setValue('Name length is over 20')
      await input2.setValue('Name length is over 20')
      await input3.setValue('Name length is over 30 with many characters')
      // wait for validation to update
      await wrapper.vm.$nextTick()
      // verify name lengths are invalid
      const errorMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(errorMessages.length).toBe(3)
      expect(errorMessages.at(0).text()).toBe('Cannot exceed 20 characters')
      expect(errorMessages.at(1).text()).toBe('Cannot exceed 20 characters')
      expect(errorMessages.at(2).text()).toBe('Cannot exceed 30 characters')
    })
  })
}
