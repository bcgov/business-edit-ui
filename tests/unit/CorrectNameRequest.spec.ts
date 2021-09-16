// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { axios } from '@/utils'
import sinon from 'sinon'
import flushPromises from 'flush-promises'

// Store
import { getVuexStore } from '@/store'

// Components
import { mount, Wrapper } from '@vue/test-utils'
import { CorrectNameRequest } from '@/components/YourCompany/CompanyName'

Vue.use(Vuetify)

function getLastEvent (wrapper: Wrapper<CorrectNameRequest>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectNameRequest', () => {
  let vuetify: any
  let wrapperFactory: any
  let store: any = getVuexStore()
  const get = sinon.stub(axios, 'get')

  beforeEach(() => {
    vuetify = new Vuetify({})

    wrapperFactory = (props: any) => {
      return mount(CorrectNameRequest, {
        propsData: {
          props
        },
        store,
        vuetify
      })
    }
  })

  it('renders the CorrectNameRequest Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
  })

  it('verify the text fields and there label', async () => {
    const wrapper = wrapperFactory()

    const textFields = wrapper.findAll('.text-input-field')
    let nrInput = textFields.at(0)
    let phoneInput = textFields.at(1)
    let emailInput = textFields.at(2)

    expect(nrInput.text()).toContain('Enter the NR Number')
    expect(phoneInput.text()).toContain('Applicant\'s Phone Number')
    expect(emailInput.text()).toContain('Applicant\'s Notification Email')
  })

  it('verifies inputs when valid', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = '123 456 7890'
    wrapper.vm.applicantEmail = 'mock@email.com'

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(true)
  })

  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = '123123NR'
    wrapper.vm.applicantEmail = 'mock@email.com'

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('verifies invalid email', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = '123123NR'
    wrapper.vm.applicantEmail = 'mockemail.com'

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('verifies invalid phone', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = '123123NR'
    wrapper.vm.applicantPhone = '123 456 7890 1212'

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('verifies missing values', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = '123123NR'
    wrapper.vm.applicantPhone = ''
    wrapper.vm.applicantEmail = ''

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('emits true when the form is valid', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = '250 516 8257'
    wrapper.vm.applicantEmail = ''

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(true)
    expect(getLastEvent(wrapper, 'isValid')).toBe(true)
  })

  it('emits false when the form is invalid', async () => {
    const wrapper = wrapperFactory()

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = ''
    wrapper.vm.applicantEmail = ''

    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(false)
    expect(getLastEvent(wrapper, 'isValid')).toBe(false)
  })

  it('emits done and true when the process is done and the Name Request accepted', async () => {
    const wrapper = wrapperFactory()
    store.state.stateModel.tombstone.currentDate = '2021-01-20'

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise((resolve) => resolve({
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
            applicants: {
              phoneNumber: '250 516 8257',
              emailAddress: 'mock@email.com'
            }
          }
      })))

    // Verify Invalid before input
    expect(wrapper.vm.isFormValid).toBe(false)

    // Set values and submit form
    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = '250 516 8257'
    wrapper.vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'done')).toBe(true)
  })

  it('emits done and false when the process is done but Name Request phone is rejected', async () => {
    const wrapper = wrapperFactory()

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise((resolve) => resolve({
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
              emailAddress: 'mock@email.com'
            }
          }
      })))

    // Verify Invalid before input
    wrapper.vm.nameRequestNumber = ''
    wrapper.vm.applicantPhone = ''
    wrapper.vm.applicantEmail = ''
    expect(wrapper.vm.isFormValid).toBe(false)

    // Set values and submit form
    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = '250 516 8258'
    wrapper.vm.applicantEmail = ''
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'done')).toBe(false)
  })

  it('emits done and false when the process is done but Name Request email is rejected', async () => {
    const wrapper = wrapperFactory()

    // GET NR Data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise((resolve) => resolve({
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
              emailAddress: 'mock@email.com'
            }
          }
      })))

    // Verify Invalid before input
    wrapper.vm.nameRequestNumber = ''
    wrapper.vm.applicantPhone = ''
    wrapper.vm.applicantEmail = ''
    expect(wrapper.vm.isFormValid).toBe(false)

    // Set values and submit form
    wrapper.vm.nameRequestNumber = 'NR 1234567'
    wrapper.vm.applicantPhone = '250 516 8257'
    wrapper.vm.applicantEmail = 'mockBad@email.com'
    await wrapper.setProps({ formType: 'correct-new-nr' })
    await flushPromises()

    expect(wrapper.vm.isFormValid).toBe(true)

    // verify form emission
    expect(getLastEvent(wrapper, 'done')).toBe(false)
  })
})
