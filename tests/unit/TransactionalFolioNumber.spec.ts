import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Transactional Folio Number component', () => {
  it('initializes with default props', () => {
    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: {}
    })
    const vm: any = wrapper.vm

    // verify template
    expect(wrapper.findComponent(TransactionalFolioNumber).exists()).toBe(true)
    expect(wrapper.find('#transactional-folio-number-section').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Folio or Reference Number for this Filing')
    expect(wrapper.find('label').text()).toBe('Folio or ReferenceNumber') // no space between Reference and Number
    expect(wrapper.find('#folio-number-input').exists()).toBe(true)

    // verify props
    expect(vm.sectionNumber).toBe('')
    expect(vm.validate).toBe(false)

    // verify local property and getter
    expect(vm.folioNumber).toBe('')
    expect(vm.sectionValid).toBe(true)

    wrapper.destroy()
  })

  it('displays section title using Section Number prop', () => {
    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: { sectionNumber: '123.' }
    })

    // verify title
    expect(wrapper.find('h2').text()).toBe('123. Folio or Reference Number for this Filing')

    wrapper.destroy()
  })

  it('uses existing Folio Number when there is no Transactional Folio Number', () => {
    store.stateModel.tombstone.folioNumber = 'A123'

    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: {}
    })
    const vm: any = wrapper.vm

    // verify Folio Number
    expect(vm.folioNumber).toBe('A123')

    // cleanup
    store.stateModel.tombstone.folioNumber = ''

    wrapper.destroy()
  })

  it('uses Transactional Folio Number if it exists', () => {
    store.stateModel.tombstone.folioNumber = 'A123'
    store.stateModel.tombstone.transactionalFolioNumber = 'B456'

    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: {}
    })
    const vm: any = wrapper.vm

    // verify Folio Number
    expect(vm.folioNumber).toBe('B456')

    // cleanup
    store.stateModel.tombstone.folioNumber = ''
    store.stateModel.tombstone.transactionalFolioNumber = ''

    wrapper.destroy()
  })

  it('sets store values and no error styling when valid Transactional Folio Number is entered', async () => {
    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: { validate: true }
    })
    const vm: any = wrapper.vm

    // verify initial Folio Number and store
    expect(vm.folioNumber).toBe('')
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('')

    // enter a valid folio number
    const input = wrapper.find('#folio-number-input')
    await input.setValue('A123')
    await input.trigger('change')

    // verify updated Folio Number and store
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('A123')
    expect(store.stateModel.validationFlags.flagsReviewCertify.isValidTransactionalFolioNumber).toBe(true)

    // verify no error styling
    expect(wrapper.find('.error-text').exists()).toBe(false)
    expect(wrapper.find('label').classes('error-text')).toBe(false)

    // cleanup
    store.stateModel.tombstone.transactionalFolioNumber = ''

    wrapper.destroy()
  })

  it('sets store values and error styling when invalid Transactional Folio Number is entered', async () => {
    const wrapper = mount(TransactionalFolioNumber, {
      vuetify,
      propsData: { validate: true }
    })
    const vm: any = wrapper.vm

    // verify initial Folio Number and store
    expect(vm.folioNumber).toBe('')
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('')

    // enter a folio number that is too long
    const input = wrapper.find('#folio-number-input')
    await input.setValue('1234567890123456789012345678901')
    await input.trigger('change')

    // verify updated Folio Number and store
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('1234567890123456789012345678901')
    expect(store.stateModel.validationFlags.flagsReviewCertify.isValidTransactionalFolioNumber).toBe(false)

    // verify error styling
    expect(wrapper.find('.error-text').exists()).toBe(true)
    expect(wrapper.find('label').classes('error-text')).toBe(true)

    // cleanup
    store.stateModel.tombstone.transactionalFolioNumber = ''

    wrapper.destroy()
  })
})
