import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import BusinessContactInfo from '@/components/common/YourCompany/BusinessContactInfo.vue'
import ConversionNOB from '@/components/Conversion/ConversionNOB.vue'

// for some reason, ChangeBusinessType cannot be imported by its filename
// also, it needs to precede the other imports
// (otherwise a bunch of tests in this file fail)
import { AssociationType, ChangeBusinessType, NatureOfBusiness } from '@/components/common/YourCompany'

import CorrectNameOptions from '@/components/common/YourCompany/CompanyName/CorrectNameOptions.vue'
import FolioInformation from '@/components/common/YourCompany/FolioInformation.vue'
import OfficeAddresses from '@/components/common/YourCompany/OfficeAddresses.vue'
import YourCompany from '@/components/common/YourCompany/YourCompany.vue'
import { BenAlterationResource } from '@/resources/Alteration/BEN'
import { SpConversionResource } from '@/resources/Conversion/SP'
import { BenCorrectionResource } from '@/resources/Correction/BEN'
import { SpCorrectionResource } from '@/resources/Correction/SP'

import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes, NameRequestStates, NameRequestTypes } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

const flagsCompanyInfo = {
  isValidCompanyName: false,
  isValidBusinessType: false,
  isValidNameTranslation: false,
  isValidNatureOfBusiness: false,
  isValidAddress: false,
  isValidContactInfo: false,
  isValidFolioInfo: false,
  isValidOrgPersons: false,
  isValidAssociationType: false
}

describe('YourCompany in a BEN correction', () => {
  setActivePinia(createPinia())
  const store = useStore()
  let wrapper: any

  beforeEach(() => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = BenCorrectionResource
    wrapper = mount(YourCompany, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany component and default subcomponents', async () => {
    expect(wrapper.findComponent(YourCompany).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)

    // Not a premium account
    expect(wrapper.findComponent(FolioInformation).exists()).toBe(false)

    // Not currently editing Company Name
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(false)
  })

  it('renders the FolioInformation component when account is premium', async () => {
    store.stateModel.accountInformation.accountType = 'PREMIUM'
    await Vue.nextTick()

    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
  })

  it('renders the CORRECT label for editing a name option', async () => {
    const editLabel = wrapper.find('#btn-correct-company-name').text()
    expect(editLabel).toBe('Correct')
  })

  it('renders the CorrectNameOptions component when correcting Company Name', async () => {
    // Click the `Correct` btn
    await wrapper.find('#btn-correct-company-name').trigger('click')
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(true)
  })

  it('hides the business type for corrections', async () => {
    expect(wrapper.find('#company-type-section').exists()).toBe(false)
  })
})

describe('YourCompany in a SP alteration', () => {
  setActivePinia(createPinia())
  const store = useStore()
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'SP'
    }
  }

  beforeEach(() => {
    // Set Original business Data
    store.stateModel.summaryMode = false
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType as CorpTypeCd
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = BenAlterationResource

    wrapper = mount(YourCompany, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany Component and default subcomponents', async () => {
    expect(wrapper.findComponent(YourCompany).exists()).toBe(true)
    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    // Only shows on CP.
    expect(wrapper.findComponent(AssociationType).exists()).toBe(false)

    // Not currently editing Company Name
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(false)
  })

  it('renders the CHANGE label for editing a name option', async () => {
    const editLabel = wrapper.find('#btn-correct-company-name').text()
    expect(editLabel).toBe('Change')
  })

  it('renders the CorrectNameOptions when correcting Company Name', async () => {
    // Click the `Correct` btn
    await wrapper.find('#btn-correct-company-name').trigger('click')

    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(true)
  })

  it('displays the business type and message after changing to a numbered Company', async () => {
    expect(wrapper.find('.company-name').text()).toBe('Mock Original Name')

    // Set new Name
    store.stateModel.nameRequest.legalName = 'My Benefit Company'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.info-text')

    expect(wrapper.find('.company-name').text()).toBe('My Benefit Company')
    expect(companyInfo.at(0).text()).toBe('BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('The name of this business will be the current Incorporation ' +
      'Number followed by "B.C. Ltd."')
  })

  it('displays the Name Request information when NR data changes', async () => {
    store.stateModel.nameRequest.nrNumber = 'NR1234567'
    store.stateModel.nameRequest.legalType = 'CR' as CorpTypeCd
    store.stateModel.nameRequest.expiry = '2021-03-10T08:00:00+00:00'
    store.stateModel.nameRequest.status = NameRequestStates.APPROVED
    store.stateModel.nameRequest.requestType = NameRequestTypes.NEW
    store.stateModel.nameRequest.applicant = {
      fullName: 'Mock Full Name',
      fullAddress: '123 Mock Lane, Victoria, BC, 1t2 3t4, CA',
      phoneNumber: '2501234567'
    } as any
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.company-info')

    // Verify the conflict flag is true when the NR legal type is different than the current business type
    expect(wrapper.vm.isConflictingLegalType).toBe(true)

    expect(companyInfo.at(0).text()).toBe('Business Type:  BC Company')
    expect(companyInfo.at(1).text()).toBe('Request Type:  New Business')
    expect(companyInfo.at(2).text()).toBe('Expiry Date:  March 10, 2021 at 12:00 am Pacific time')
    expect(companyInfo.at(3).text()).toBe('Status:  approved')

    const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')

    expect(nameRequestApplicantInfo.at(0).text()).toBe('Name:  Mock Full Name')
    expect(nameRequestApplicantInfo.at(1).text()).toBe('Address:  123 Mock Lane, Victoria, BC, 1t2 3t4, CA')
    expect(nameRequestApplicantInfo.at(2).text()).toBe('Email:  N/A')
    expect(nameRequestApplicantInfo.at(3).text()).toBe('Phone:  (250) 123-4567')
  })
})

describe('YourCompany in a SP alteration: formats multiple phone numbers correctly', () => {
  const phoneNumbers = ['123 456 7890', '0987654321', '123 456 7890', '123-456-7890', '456 7890', null]
  const outPuts = ['(123) 456-7890', '(098) 765-4321', '(123) 456-7890', '(123) 456-7890', 'N/A', 'N/A']

  phoneNumbers.forEach((phoneNumber, index) => {
    setActivePinia(createPinia())
    const store = useStore()
    let wrapper: any

    beforeEach(() => {
      store.stateModel.nameRequest.applicant = {
        fullName: 'Mock Full Name',
        fullAddress: '123 Mock Lane, Victoria, BC, 1t2 3t4, CA',
        phoneNumber: phoneNumber
      } as any
      store.stateModel.nameRequest.nrNumber = 'NR1234567'
      store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
      wrapper = mount(YourCompany, { vuetify })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('formats something', async () => {
      store.stateModel.nameRequest.applicant.phoneNumber = phoneNumber
      await Vue.nextTick()
      const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')
      expect(nameRequestApplicantInfo.at(3).text()).toBe(`Phone:  ${outPuts[index]}`)
    })
  })
})

describe('YourCompany in a SP conversion', () => {
  setActivePinia(createPinia())
  const store = useStore()
  let wrapper: any

  beforeEach(() => {
    // Set Original business Data
    store.stateModel.summaryMode = false
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.CONVERSION
    store.resourceModel = SpConversionResource
    store.stateModel.validationFlags.componentValidate = true
    store.stateModel.validationFlags.flagsCompanyInfo = flagsCompanyInfo as any
    wrapper = mount(YourCompany, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany component and default subcomponents', async () => {
    expect(wrapper.findComponent(YourCompany).exists()).toBeTruthy()
    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBeTruthy()
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBeFalsy()
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBeTruthy()
    expect(wrapper.findComponent(ConversionNOB).exists()).toBeTruthy()
    // Not currently editing Company Name
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBeFalsy()
  })

  it('renders the NatureOfBusiness component with invalid styling', async () => {
    store.stateModel.validationFlags.flagsCompanyInfo.isValidNatureOfBusiness = false
    wrapper = mount(YourCompany, { vuetify })
    expect(wrapper.find('#nature-of-business.invalid-section').exists()).toBeTruthy()
  })
})

describe('YourCompany in a SP correction', () => {
  let wrapper: any

  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useStore()
    // Set Original business Data
    store.stateModel.summaryMode = false
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.resourceModel = SpCorrectionResource
    store.stateModel.validationFlags.componentValidate = true
    store.stateModel.validationFlags.flagsCompanyInfo = flagsCompanyInfo as any
    store.stateModel.businessInformation.foundingDate = '2021-04-13T00:00:00+00:00'
    store.stateModel.businessInformation.startDate = '2021-04-13'
    wrapper = mount(YourCompany, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany component and default subcomponents', async () => {
    expect(wrapper.findComponent(YourCompany).exists()).toBeTruthy()
    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBeTruthy()
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBeTruthy()
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBeTruthy()
    expect(wrapper.findComponent(NatureOfBusiness).exists()).toBeTruthy()
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBeFalsy()
    expect(wrapper.find('#business-start-date').exists()).toBeTruthy()
  })

  it('renders the editing component for Business Name', async () => {
    // verify the correct button is available
    const correctBtn = wrapper.find('#btn-correct-company-name')
    await correctBtn.trigger('click')
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBeTruthy()
  })

  it('renders the non-editing component for Business Type', async () => {
    // verify the correct button is not available
    expect(wrapper.find('#btn-correct-business-type').exists()).toBeFalsy()
    const infoText = wrapper.findAll('#change-business-type .info-text')
    expect(infoText.at(0).text()).toBe('BC Sole Proprietorship')
  })

  it('renders the editing component for Business Start Date', async () => {
    const businessSD = wrapper.find('#business-start-date')
    expect(businessSD.exists()).toBeTruthy()
    expect(businessSD.findAll('label').at(0).text()).toBe('Business Start Date')
    expect(businessSD.findAll('span').at(0).text()).toBe('April 13, 2021')
  })

  it('renders the editing component for Nature of Business', async () => {
    // verify the correct button is available
    const natureOfBusiness = wrapper.find('#nature-of-business')
    expect(natureOfBusiness.exists()).toBeTruthy()
    expect(natureOfBusiness.findAll('label').at(0).text()).toBe('Nature of Business')
    expect(natureOfBusiness.findAll('span').at(0).text()).toBe('Statistics Canada website')

    const textField = wrapper.find('#nature-of-business').findAll('p')
    expect(textField.at(0).text()).toContain('Enter one or more keywords')
  })

  it('renders the editing component for Business Address', async () => {
    // verify the correct button is available
    expect(wrapper.find('#btn-correct-office-addresses').exists()).toBeTruthy()
    const officeAddresses = wrapper.find('#office-addresses')
    expect(officeAddresses.findAll('.info-text').exists()).toBeTruthy()
    expect(officeAddresses.findAll('.info-text').at(0).text()).toBe('(Not entered)')
    expect(officeAddresses.findAll('.info-text').at(1).text()).toBe('(Not entered)')
  })

  it('renders the editing component for Business Contact Information', async () => {
    // verify the correct button is not available
    expect(wrapper.find('#contact-info-edit-btn').exists()).toBeFalsy()
    const contactInfo = wrapper.find('#contact-info')
    expect(contactInfo.findAll('label').exists()).toBeTruthy()
    expect(contactInfo.findAll('label').at(1).text()).toBe('Email Address')
    expect(contactInfo.findAll('label').at(2).text()).toBe('Phone Number')
    expect(contactInfo.find('#lbl-email').text()).toBe('(Not entered)')
    expect(contactInfo.find('#lbl-no-phone').text()).toBe('(Not entered)')
  })

  it('renders association type for CP', async () => {
    const store = useStore()
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    const wrapper2 = mount(YourCompany, { vuetify })
    expect(wrapper2.findComponent(YourCompany).exists()).toBeTruthy()
    expect(wrapper2.findComponent(AssociationType).exists()).toBeTruthy()
  })
})
