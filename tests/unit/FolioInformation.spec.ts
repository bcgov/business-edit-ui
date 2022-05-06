import Vue from 'vue'
import Vuetify from 'vuetify'
import sinon from 'sinon'
import { mount } from '@vue/test-utils'
import { axios } from '@/utils/'
import { getVuexStore } from '@/store/'
import FolioInformation from '@/components/common/YourCompany/FolioInformation.vue'
import { FolioNumber as FolioNumberShared } from '@bcrs-shared-components/folio-number/'
import AuthServices from '@/services/auth-services'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Folio Information component', () => {
  it('renders itself and its sub-component', () => {
    const wrapper = mount(FolioInformation, { vuetify, store })

    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
    expect(wrapper.findComponent(FolioNumberShared).exists()).toBe(true)

    wrapper.destroy()
  })

  it('defaults Invalid Section prop', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      store,
      propsData: {}
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('accepts Invalid Section prop', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      store,
      propsData: { invalidSection: true }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('gets Original Folio Number for a correction', () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.originalIA.header.folioNumber = 'A123'

    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    expect(vm.originalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('gets Original Folio Number for an alteration', () => {
    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } }

    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    expect(vm.originalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('does not update folio number for a correction', async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.originalIA.header.folioNumber = ''

    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    const mockUpdateFolioNumber = jest.spyOn((AuthServices as any), 'updateFolioNumber')

    await vm.onNewFolioNumber('A123')

    expect(mockUpdateFolioNumber).not.toHaveBeenCalled()
    expect(store.state.stateModel.tombstone.folioNumber).toBe('A123')
    expect(store.state.stateModel.tombstone.transactionalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('updates folio number for an alteration', async () => {
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.state.stateModel.tombstone.businessId = 'BC1234567'
    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.originalIA.header.folioNumber = ''

    // mock auth "patch business" endpoint
    sinon.stub(axios, 'patch').withArgs('myhost/basePath/auth/entities/BC1234567')

    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    const mockUpdateFolioNumber = jest.spyOn((AuthServices as any), 'updateFolioNumber')

    await vm.onNewFolioNumber('A123')

    expect(mockUpdateFolioNumber).toHaveBeenCalledWith('A123', 'BC1234567')
    expect(store.state.stateModel.tombstone.folioNumber).toBe('A123')
    expect(store.state.stateModel.tombstone.transactionalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('emits Have Changes event', async () => {
    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    await vm.onHaveChanges(true)

    expect(wrapper.emitted('haveChanges')).toEqual([[true]])

    wrapper.destroy()
  })

  it('updates store and emits Is Editing event', async () => {
    const wrapper = mount(FolioInformation, { vuetify, store })
    const vm: any = wrapper.vm

    await vm.onIsEditing(true)

    expect(store.state.stateModel.editingFlags.folioNumber).toBe(true)
    expect(store.state.stateModel.validationFlags.flagsCompanyInfo['isValidFolioInfo']).toBe(false)
    expect(wrapper.emitted('isEditing')).toEqual([[true]])

    wrapper.destroy()
  })
})
