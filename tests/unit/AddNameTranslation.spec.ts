import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store'
import { createLocalVue, mount } from '@vue/test-utils'
import AddNameTranslation from '@/components/common/YourCompany/NameTranslations/AddNameTranslation.vue'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

function resetStore (): void {
  store.state.stateModel.nameTranslations = []
}

// Local references
const addTranslationInput = '#name-translation-input'
const okBtn = '#name-translation-btn-ok'
const cancelBtn = '#name-translation-btn-cancel'

describe('Add Name Translation component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    // Init Store
    store.state.stateModel.nameTranslations = []

    wrapperFactory = (propsData: any) => {
      return mount(AddNameTranslation, {
        localVue,
        router,
        store,
        vuetify,
        propsData: { ...propsData }
      })
    }
  })

  it('displays the input field and buttons in the Add Name Translation form', () => {
    const wrapper = wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Verify Action btns and there default states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    // done button not disabled anymore, validation done by validation function
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('enables the Done button when the input field meets validation rules', async () => {
    const wrapper = wrapperFactory()
    const vm: any = wrapper.vm

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field values
    vm.$el.querySelector(addTranslationInput).textContent = 'Mock Name Translation'
    wrapper.find(addTranslationInput).setValue('MockNameTranslation')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    wrapper.find(addTranslationInput).trigger('input')
    expect(wrapper.find(addTranslationInput).text()).toEqual('Mock Name Translation')

    // Verify Action btns and there states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    // Verify that is adding function returns true
    expect(vm.isAddingTranslation).toBeTruthy()

    wrapper.destroy()
  })

  it('enables the Done button when the input field meets validation rules in French characters', async () => {
    const wrapper = wrapperFactory()
    const vm: any = wrapper.vm

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field values
    vm.$el.querySelector(addTranslationInput).textContent = 'Nom commercial simulé'
    wrapper.find(addTranslationInput).setValue('Nom commercial simulé')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    wrapper.find(addTranslationInput).trigger('input')
    expect(wrapper.find(addTranslationInput).text()).toEqual('Nom commercial simulé')

    // Verify Action btns and there states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('shows the validation message when the input field does NOT meet validation rules', async () => {
    const wrapper = wrapperFactory()
    const vm: any = wrapper.vm

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field values
    vm.$el.querySelector(addTranslationInput).textContent = 'Mock Fail 1212'
    wrapper.find(addTranslationInput).setValue('Mock Fail 1212')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    wrapper.find(addTranslationInput).trigger('input')
    expect(wrapper.find(addTranslationInput).text()).toEqual('Mock Fail 1212')

    // Verify Action btns and there states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    // done button not disabled anymore, validation done by validation function
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    vm.$refs.nameTranslationForm.validate()

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Invalid character')

    wrapper.destroy()
  })

  it('opens the Add Name Translation with the correct Name when Editing a Name Translation', async () => {
    const wrapper = wrapperFactory({ editNameTranslation: 'Mock Name Edit' })
    const vm: any = wrapper.vm
    await flushPromises()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Verify Action btns and there states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    // Verify that is adding functions returns false
    expect(vm.isAddingTranslation).toBeFalsy()

    wrapper.destroy()
  })

  it('shows the validaton message when editing a name translation that does NOT meet validation', async () => {
    const wrapper = wrapperFactory({ editNameTranslation: 'Mock Name Edit' })
    const vm: any = wrapper.vm
    await flushPromises()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Edit the name
    wrapper.find(addTranslationInput).setValue('Mock edit fail 1212')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    // Verify Action btns and there states
    expect(wrapper.find(okBtn).exists()).toBeTruthy()
    // done button not disabled anymore, validation done by validation function
    expect(wrapper.find(okBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    vm.$refs.nameTranslationForm.validate()

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Invalid character')

    wrapper.destroy()
  })
})
