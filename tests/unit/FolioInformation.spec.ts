import Vuetify from 'vuetify'
import sinon from 'sinon'
import { mount } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import FolioInformation from '@/components/common/YourCompany/FolioInformation.vue'
import { FolioNumber as FolioNumberShared } from '@bcrs-shared-components/folio-number/'
import AuthServices from '@/services/auth-services'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Folio Information component', () => {
  it('renders correctly when account is not premium', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => false }
    })

    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
    expect(wrapper.findComponent(FolioNumberShared).exists()).toBe(false)

    wrapper.destroy()
  })

  it('renders correctly when account is premium', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })

    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
    expect(wrapper.findComponent(FolioNumberShared).exists()).toBe(true)

    wrapper.destroy()
  })

  it('is not invalid initially', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: {
        isPremiumAccount: () => true,
        getComponentValidate: () => false,
        getFlagsCompanyInfo: () => ({})
      }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('is invalid when global flag is True and component is invalid', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: {
        isPremiumAccount: () => true,
        getComponentValidate: () => true,
        getFlagsCompanyInfo: () => ({ isValidFolioInfo: false })
      }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('is not invalid when global flag is True and component is valid', () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: {
        isPremiumAccount: () => true,
        getComponentValidate: () => true,
        getFlagsCompanyInfo: () => ({ isValidFolioInfo: true })
      }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('gets Original Folio Number for a correction', () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } } as any

    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })
    const vm: any = wrapper.vm

    expect(vm.originalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('gets Original Folio Number for an alteration', () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } } as any

    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })
    const vm: any = wrapper.vm

    expect(vm.originalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('does not update folio number for a correction', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: null } } as any

    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })
    const vm: any = wrapper.vm

    const mockUpdateFolioNumber = vi.spyOn((AuthServices as any), 'updateFolioNumber')

    await vm.onNewFolioNumber('A123')

    expect(mockUpdateFolioNumber).not.toHaveBeenCalled()
    expect(store.stateModel.tombstone.folioNumber).toBe('A123')
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('A123')

    wrapper.destroy()
  })

  it('updates folio number for an alteration', async () => {
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.stateModel.tombstone.businessId = 'BC1234567'
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } } as any

    // mock auth "patch business" endpoint
    sinon.stub(axios, 'patch').withArgs('myhost/basePath/auth/entities/BC1234567')

    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })
    const vm: any = wrapper.vm

    const mockUpdateFolioNumber = vi.spyOn((AuthServices as any), 'updateFolioNumber')

    await vm.onNewFolioNumber('A321')

    expect(mockUpdateFolioNumber).toHaveBeenCalledWith('A321', 'BC1234567')
    expect(store.stateModel.tombstone.folioNumber).toBe('A321')
    expect(store.stateModel.tombstone.transactionalFolioNumber).toBe('A321')

    wrapper.destroy()
  })

  it('sets validity in store', async () => {
    const wrapper = mount(FolioInformation, {
      vuetify,
      computed: { isPremiumAccount: () => true }
    })

    await wrapper.setData({ isEditingFolioNumber: true })
    expect(store.stateModel.validationFlags.flagsCompanyInfo['isValidFolioInfo']).toBe(false)

    await wrapper.setData({ isEditingFolioNumber: false })
    expect(store.stateModel.validationFlags.flagsCompanyInfo['isValidFolioInfo']).toBe(true)

    wrapper.destroy()
  })
})
