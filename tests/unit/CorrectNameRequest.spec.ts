import Vue from 'vue'
import Vuetify from 'vuetify'
import { AxiosInstance as axios } from '@/utils/'
import sinon from 'sinon'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import CorrectNameRequest from '@/components/common/YourCompany/CorrectName/CorrectNameRequest.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/enums'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

function getLastEvent (wrapper: Wrapper<any>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectNameRequest', () => {
  const wrapperFactory = (props: any = {}) => {
    return mount(CorrectNameRequest, {
      propsData: {
        props
      },
      vuetify
    })
  }
  const get = sinon.stub(axios, 'get')

  beforeAll(() => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
  })

  it('renders the CorrectNameRequest Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)

    wrapper.destroy()
  })

  it('verify the text fields and there label', async () => {
    const wrapper = wrapperFactory()

    const textFields = wrapper.findAll('.text-input-field')
    const nrInput = textFields.at(0)
    const phoneInput = textFields.at(1)
    const emailInput = textFields.at(2)

    expect(nrInput.text()).toContain('Enter the NR Number')
    expect(phoneInput.text()).toContain('Applicant\'s Phone Number')
    expect(emailInput.text()).toContain('Applicant\'s Notification Email')

    wrapper.destroy()
  })

  it('verifies inputs when valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  it('verifies inputs when valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  it('verifies inputs when valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '1234567'
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  // the spaces between 'NR' and the numbers are ignored
  it('verifies valid NR input', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR   1234567'
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '123123NR'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  // the leading or trailing spaces of a NR are invalid
  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '   NR 1234567'
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  // the leading or trailing spaces are invalid
  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567    '
    vm.applicantPhone = '123 456 7890'
    vm.applicantEmail = 'mock@example.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  it('verifies invalid email', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '123123NR'
    vm.applicantEmail = 'mockemail.com'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  it('verifies invalid phone', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '123123NR'
    vm.applicantPhone = '123 456 7890 1212'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  it('verifies missing values', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '123123NR'
    vm.applicantPhone = ''
    vm.applicantEmail = ''

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  it('emits true when the form is valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = ''

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(getLastEvent(wrapper, 'isValid')).toBe(true)

    wrapper.destroy()
  })

  it('emits false when the form is invalid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = ''
    vm.applicantEmail = ''

    await flushPromises()

    expect(vm.isFormValid).toBe(false)
    expect(getLastEvent(wrapper, 'isValid')).toBe(false)

    wrapper.destroy()
  })

  it('emits done and true when the process is done and the Name Request accepted', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    store.stateModel.tombstone.currentDate = '2021-01-20'

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'BC',
            legalType: 'BC',
            request_action_cd: 'CNV',
            entity_type_cd: 'CR',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'isSaved')).toBe(true)

    wrapper.destroy()
  })

  it('emits done and false when the process is done but Name Request phone is rejected', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'BC',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    vm.nameRequestNumber = ''
    vm.applicantPhone = ''
    vm.applicantEmail = ''
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8258'
    vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'isSaved')).toBe(false)

    wrapper.destroy()
  })

  it('emits done and false when the process is done but Name Request email is rejected', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'BC',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    vm.nameRequestNumber = ''
    vm.applicantPhone = ''
    vm.applicantEmail = ''
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = 'mockBad@email.com'
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'isSaved')).toBe(false)

    wrapper.destroy()
  })

  it('emits done and prompts confirm dialog when the Name Request is a type mismatch', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    store.stateModel.tombstone.currentDate = '2021-01-20'

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'BC',
            request_action_cd: 'CNV',
            entity_type_cd: 'BC',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify Confirm Dialog
    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameRequest).text()).toContain('Name Request Type Does Not Match')

    wrapper.destroy()
  })

  it('emits done and verify Name Request accepted for NEW GP filing', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    store.stateModel.tombstone.currentDate = '2021-01-20'
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'GP',
            legalType: 'GP',
            request_action_cd: 'CHG',
            entity_type_cd: 'GP',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'isSaved')).toBe(true)

    wrapper.destroy()
  })

  it('emits done and verify Name Request is a type mismatch for NEW SP filing', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    store.stateModel.tombstone.currentDate = '2021-01-20'
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
          {
            state: 'APPROVED',
            expirationDate: '2022-05-19',
            names: [{
              state: 'APPROVED',
              name: 'Bobs Plumbing'
            }],
            nrNum: 'NR 1234567',
            requestTypeCd: 'SP',
            request_action_cd: 'CHG',
            entity_type_cd: 'SP',
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@example.com'
            }
          }
      }))

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    // Set values and submit form
    vm.nameRequestNumber = 'NR 1234567'
    vm.applicantPhone = '250 516 8257'
    vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(vm.isFormValid).toBe(true)

    // verify Confirm Dialog
    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameRequest).text()).toContain('Name Request Type Does Not Match')

    wrapper.destroy()
  })
})
