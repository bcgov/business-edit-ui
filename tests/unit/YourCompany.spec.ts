import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
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
import { BenefitCompanyResource as BenAlterationResource } from '@/resources/Alteration/BenefitCompanyResource'
import { SoleProprietorshipResource as SpConversionResource } from '@/resources/Conversion/SoleProprietorshipResource'

import { BenCorrectionResource } from '@/resources/Correction/BenefitCompany'
import { CccCorrectionResource } from '@/resources/Correction/CommunityContributionCompany'
import { GpCorrectionResource } from '@/resources/Correction/GeneralPartnership'
import { BcCorrectionResource } from '@/resources/Correction/LimitedCompany'
import { SpCorrectionResource } from '@/resources/Correction/SoleProprietorship'
import { UlcCorrectionResource } from '@/resources/Correction/UnlimitedLiabilityCompany'

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
  const store = getVuexStore()
  let wrapper: any

  beforeEach(() => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.resourceModel = BenCorrectionResource
    wrapper = mount(YourCompany, { vuetify, store })
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
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
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

const tests = [
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

for (const test of tests) {
  const type = test.isNumberedCompany ? 'numbered' : 'named'

  describe('Name Change Options in a correction', () => {
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

describe('YourCompany in a SP alteration', () => {
  const store = getVuexStore()
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'SP'
    }
  }

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.summaryMode = false
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.resourceModel = BenAlterationResource

    wrapper = mount(YourCompany, { vuetify, store })
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
    store.state.stateModel.nameRequest.legalName = 'My Benefit Company'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.info-text')

    expect(wrapper.find('.company-name').text()).toBe('My Benefit Company')
    expect(companyInfo.at(0).text()).toBe('BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('The name of this business will be the current Incorporation ' +
      'Number followed by "B.C. Ltd."')
  })

  it('displays the Name Request information when NR data changes', async () => {
    store.state.stateModel.nameRequest.nrNumber = 'NR1234567'
    store.state.stateModel.nameRequest.legalType = 'CR'
    store.state.stateModel.nameRequest.expiry = '2021-03-10T08:00:00+00:00'
    store.state.stateModel.nameRequest.status = 'APPROVED'
    store.state.stateModel.nameRequest.requestType = 'NEW'
    store.state.stateModel.nameRequest.applicant = {
      fullName: 'Mock Full Name',
      fullAddress: '123 Mock Lane, Victoria, BC, 1t2 3t4, CA',
      phoneNumber: '2501234567'
    }
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
    const store = getVuexStore()
    let wrapper: any

    beforeEach(() => {
      store.state.stateModel.nameRequest.applicant = {
        fullName: 'Mock Full Name',
        fullAddress: '123 Mock Lane, Victoria, BC, 1t2 3t4, CA',
        phoneNumber: phoneNumber
      }
      store.state.stateModel.nameRequest.nrNumber = 'NR1234567'
      store.state.stateModel.tombstone.filingType = 'alteration'
      wrapper = mount(YourCompany, { vuetify, store })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('formats something', async () => {
      store.state.stateModel.nameRequest.applicant.phoneNumber = phoneNumber
      await Vue.nextTick()
      const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')
      expect(nameRequestApplicantInfo.at(3).text()).toBe(`Phone:  ${outPuts[index]}`)
    })
  })
})

describe('YourCompany in a SP conversion', () => {
  const store = getVuexStore()
  let wrapper: any

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.summaryMode = false
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.tombstone.filingType = 'conversion'
    store.state.resourceModel = SpConversionResource
    store.state.stateModel.validationFlags.componentValidate = true
    store.state.stateModel.validationFlags.flagsCompanyInfo = flagsCompanyInfo
    wrapper = mount(YourCompany, { vuetify, store })
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
    store.state.stateModel.validationFlags.flagsCompanyInfo.isValidNatureOfBusiness = false
    wrapper = mount(YourCompany, { vuetify, store })
    expect(wrapper.find('#nature-of-business.invalid-section').exists()).toBeTruthy()
  })
})

describe('YourCompany in a SP correction', () => {
  const store = getVuexStore()
  let wrapper: any

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.summaryMode = false
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.resourceModel = SpCorrectionResource
    store.state.stateModel.validationFlags.componentValidate = true
    store.state.stateModel.validationFlags.flagsCompanyInfo = flagsCompanyInfo
    store.state.stateModel.businessInformation.foundingDate = '2021-04-13T00:00:00+00:00'
    store.state.stateModel.businessInformation.startDate = '2021-04-13'
    wrapper = mount(YourCompany, { vuetify, store })
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
    store.state.stateModel.tombstone.entityType = 'CP'
    wrapper = mount(YourCompany, { vuetify, store })
    expect(wrapper.findComponent(YourCompany).exists()).toBeTruthy()
    expect(wrapper.findComponent(AssociationType).exists()).toBeTruthy()
  })
})
