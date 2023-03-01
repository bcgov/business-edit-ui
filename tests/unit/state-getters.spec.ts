import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import Actions from '@/components/common/Actions.vue'
import { getExpiryDateString, getFormattedExpiryText } from '@/store/getters'
import { mutateRestorationExpiry } from '@/store/mutations'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('State Getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.correctionInformation.type = 'CLIENT'

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  it('returns correct values for "Is Busy Saving" et al getters', async () => {
    // initially, these getters should be false
    expect(vm.isSaving).toBe(false)
    expect(vm.isSavingResuming).toBe(false)
    expect(vm.isFilingPaying).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Saving flag works
    await vm.$store.commit('mutateIsSaving', true)
    expect(vm.isSaving).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    await vm.$store.commit('mutateIsSaving', false)
    expect(vm.isCorrectionEditing).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Saving Resuming flag works
    await vm.$store.commit('mutateIsSavingResuming', true)
    expect(vm.isSavingResuming).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    await vm.$store.commit('mutateIsSavingResuming', false)
    expect(vm.isSavingResuming).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Filing Saving flag works
    await vm.$store.commit('mutateIsFilingPaying', true)
    expect(vm.isFilingPaying).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    await vm.$store.commit('mutateIsFilingPaying', false)
    expect(vm.isFilingPaying).toBe(false)
    expect(vm.isBusySaving).toBe(false)
  })

  // FUTURE: fix this to work for non-correction filing
  xit('returns correct values for "Is Filing Valid" getter', async () => {
    // initially, this getter should be false
    expect(vm.isCorrectionValid).toBe(false)

    // verify that the People And Roles Valid flag alone does nothing
    await vm.$store.commit('mutatePeopleAndRolesValidity', true)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutatePeopleAndRolesValidity', false)

    // verify that the Detail Valid flag alone does nothing
    await vm.$store.commit('mutateDetailValidity', true)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateDetailValidity', false)

    // verify that the Certify State Valid flag alone does nothing
    await vm.$store.commit('mutateCertifyStateValidity', true)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateCertifyStateValidity', false)

    // verify that the Staff Payment Valid flag alone does nothing
    await vm.$store.commit('mutateStaffPaymentValidity', true)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateStaffPaymentValidity', false)

    // verify that all flags works
    await vm.$store.commit('mutatePeopleAndRolesValidity', true)
    await vm.$store.commit('mutateCreateShareStructureStepValidity', true)
    await vm.$store.commit('mutateDetailValidity', true)
    await vm.$store.commit('mutateCertifyState', {
      valid: true,
      certifiedBy: 'user'
    })
    await vm.$store.commit('mutateCertifyStateValidity', true)
    await vm.$store.commit('mutateStaffPaymentValidity', true)
    expect(vm.isCorrectionValid).toBe(true)
    await vm.$store.commit('mutatePeopleAndRolesValidity', false)
    await vm.$store.commit('mutateDetailValidity', false)
    await vm.$store.commit('mutateCertifyState', {
      valid: false,
      certifiedBy: ''
    })
    await vm.$store.commit('mutateCertifyStateValidity', false)
    await vm.$store.commit('mutateStaffPaymentValidity', false)
    expect(vm.isCorrectionValid).toBe(false)
  })

  it('returns correct values for "Is Correction  Valid" getter', async () => {
    function mutateIsValidComponent (key: string, value: any): Promise<void> {
      return vm.$store.commit('mutateIsValidComponent', { key, value })
    }

    // initially, this getter should be false
    // (because certify state is initially invalid)
    expect(vm.isCorrectionValid).toBe(false)

    // set all flags to valid
    await mutateIsValidComponent('isValidCompanyName', true)
    await mutateIsValidComponent('isValidNameTranslation', true)
    await mutateIsValidComponent('isValidAddress', true)
    await mutateIsValidComponent('isValidOrgPersons', true)
    await mutateIsValidComponent('isValidShareStructure', true)
    await vm.$store.commit('mutateDetailValidity', true)
    await vm.$store.commit('mutateCertifyStateValidity', true)
    await vm.$store.commit('mutateStaffPaymentValidity', true)

    // now, this getter should be true
    expect(vm.isCorrectionValid).toBe(true)

    // verify that the Valid Company Name flag alone affects validity
    await mutateIsValidComponent('isValidCompanyName', false)
    expect(vm.isCorrectionValid).toBe(false)
    await mutateIsValidComponent('isValidCompanyName', true)

    // verify that the Valid Name Translation flag alone affects validity
    await mutateIsValidComponent('isValidNameTranslation', false)
    expect(vm.isCorrectionValid).toBe(false)
    await mutateIsValidComponent('isValidNameTranslation', true)

    // verify that the Valid Address flag alone affects validity
    await mutateIsValidComponent('isValidAddress', false)
    expect(vm.isCorrectionValid).toBe(false)
    await mutateIsValidComponent('isValidAddress', true)

    // verify that the Valid Org Persons flag alone affects validity
    await mutateIsValidComponent('isValidOrgPersons', false)
    expect(vm.isCorrectionValid).toBe(false)
    await mutateIsValidComponent('isValidOrgPersons', true)

    // verify that the Valid Share Structure flag alone affects validity
    await mutateIsValidComponent('isValidShareStructure', false)
    expect(vm.isCorrectionValid).toBe(false)
    await mutateIsValidComponent('isValidShareStructure', true)

    // verify that the Valid Detail Comment flag alone affects validity
    await vm.$store.commit('mutateDetailValidity', false)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateDetailValidity', true)

    // verify that the Valid Certify flag alone affects validity
    await vm.$store.commit('mutateCertifyStateValidity', false)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateCertifyStateValidity', true)

    // verify that the Valid Staff Payment flag alone affects validity
    await vm.$store.commit('mutateStaffPaymentValidity', false)
    expect(vm.isCorrectionValid).toBe(false)
    await vm.$store.commit('mutateStaffPaymentValidity', true)

    // this getter should be true again
    expect(vm.isCorrectionValid).toBe(true)
  })

  it('returns correct values for "Is Editing" getter', async () => {
    // initially, this getter should be false
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Company Name flag works
    await vm.$store.commit('mutateEditingCompanyName', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingCompanyName', false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Name Translations flag works
    await vm.$store.commit('mutateEditingNameTranslations', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingNameTranslations', false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Office Addresses flag works
    await vm.$store.commit('mutateEditingOfficeAddresses', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingOfficeAddresses', false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Folio Number flag works
    await vm.$store.commit('mutateEditingFolioNumber', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingFolioNumber', false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing People And Roles flag works
    await vm.$store.commit('mutateEditingPeopleAndRoles', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingPeopleAndRoles', false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Share Structure flag works
    await vm.$store.commit('mutateEditingShareStructure', true)
    expect(vm.isCorrectionEditing).toBe(true)
    await vm.$store.commit('mutateEditingShareStructure', false)
    expect(vm.isCorrectionEditing).toBe(false)
  })
})

describe('Alteration getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.newAlteration.provisionsRemoved = false
    store.state.stateModel.shareStructureStep = {
      resolutionDates: [],
      shareClasses: []
    }
    store.state.stateModel.nameRequest = {
      legalName: 'MyLegalName',
      business: {
        legalName: 'MyLegalName',
        legalType: 'BEN'
      },
      incorporationApplication: {},
      registration: {}
    }
    store.state.stateModel.entitySnapshot = {
      businessInfo: {
        legalName: 'MyLegalName',
        legalType: 'BEN',
        naicsCode: '100000'
      },
      shareStructure: {
        shareClasses: []
      },
      addresses: {
        businessOffice: null
      }
    }

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  it('returns correct values for "Has Alteration Changed" getter', async () => {
    // initially, this getter should be false
    expect(vm.hasAlterationDataChanged).toBe(false)

    // verify that business name changes are detected
    store.state.stateModel.nameRequest.legalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.state.stateModel.nameRequest.legalName = 'MyLegalName'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.state.stateModel.tombstone.entityType = 'BEN2'
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.state.stateModel.tombstone.entityType = 'BEN'
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that name translation changes are detected
    store.state.stateModel.nameTranslations = [{ action: 'ACTION' }]
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.state.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that share structure changes are detected
    store.state.stateModel.shareStructureStep.shareClasses = [{}]
    expect(vm.hasShareStructureChanged).toBe(true)
    store.state.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // verify that provisions removed is detected
    store.state.stateModel.newAlteration.provisionsRemoved = true
    expect(vm.areProvisionsRemoved).toBe(true)
    store.state.stateModel.newAlteration.provisionsRemoved = false
    expect(vm.areProvisionsRemoved).toBe(false)

    // verify that new resolution dates are detected
    // store.state.stateModel.shareStructureStep.resolutionDates = ['s']
    // expect(vm.haveNewResolutionDates).toBe(true)
    // store.state.stateModel.shareStructureStep.resolutionDates = []
    // expect(vm.haveNewResolutionDates).toBe(false)

    // finally, this getter should be false
    expect(vm.hasAlterationDataChanged).toBe(false)
  })
})

describe('BEN correction getters', () => {
  let vm: any

  const newAddress = {
    deliveryAddress: { postalCode: 'V8V 8V8' },
    mailingAddress: { postalCode: 'V8V 8V8' }
  }

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = null
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.entitySnapshot = {
      businessInfo: {
        legalName: 'MyLegalName',
        legalType: 'BEN'
      },
      shareStructure: {
        shareClasses: []
      }
    }

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  it('returns correct values for "Has Correction Changed" getter', async () => {
    // initially, this getter should be false (default value)
    expect(vm.hasCorrectionDataChanged).toBe(false)

    // verify that business name changes are detected
    store.state.stateModel.nameRequest.legalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.state.stateModel.nameRequest.legalName = 'MyLegalName'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.state.stateModel.tombstone.entityType = 'BEN2'
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.state.stateModel.tombstone.entityType = 'BEN'
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that name translation changes are detected
    store.state.stateModel.nameTranslations = [{ action: 'ACTION' }]
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.state.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that registered mailing address changes are detected
    store.state.stateModel.officeAddresses = { registeredOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that registered delivery address changes are detected
    store.state.stateModel.officeAddresses = { registeredOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records mailing address changes are detected
    store.state.stateModel.officeAddresses = { recordsOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records delivery address changes are detected
    store.state.stateModel.officeAddresses = { recordsOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that people and roles changes are detected
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        deliveryAddress: {},
        mailingAddress: {},
        officer: {},
        roles: []
      }
    ]
    expect(vm.havePeopleAndRolesChanged).toBe(true)
    store.state.stateModel.peopleAndRoles.orgPeople = []
    expect(vm.havePeopleAndRolesChanged).toBe(false)

    // verify that share structure changes are detected
    store.state.stateModel.shareStructureStep.shareClasses = [{}]
    expect(vm.hasShareStructureChanged).toBe(true)
    store.state.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // finally, this getter should be false
    expect(vm.hasCorrectionDataChanged).toBe(false)
  })
})

describe('SP/GP correction getters', () => {
  let vm: any

  const naics = {
    naicsCode: '100000',
    naicsDescription: 'NAICS description'
  }
  const newAddress = {
    deliveryAddress: { postalCode: 'V8V 8V8' },
    mailingAddress: { postalCode: 'V8V 8V8' }
  }
  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.nameRequest = {
      legalName: 'MyLegalName',
      business: {
        legalName: 'MyLegalName',
        legalType: 'BEN'
      },
      incorporationApplication: {},
      registration: {}
    }
    store.state.stateModel.entitySnapshot = {
      businessInfo: {
        legalName: 'MyLegalName',
        legalType: 'SP',
        naicsCode: '100000',
        naicsDescription: 'NAICS description'
      },
      shareStructure: {
        shareClasses: []
      }
    }
    store.state.stateModel.correctionInformation = {
      startDate: ''
    }
    store.state.stateModel.officeAddresses = null
    store.state.stateModel.businessInformation = naics

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  it('returns correct values for "Has Correction Changed" getter', async () => {
    // initially, this getter should be false (default value)
    expect(vm.hasCorrectionDataChanged).toBe(false)

    // verify that business name changes are detected
    store.state.stateModel.nameRequest.legalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.state.stateModel.nameRequest.legalName = 'MyLegalName'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.state.stateModel.tombstone.entityType = 'SP2'
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.state.stateModel.tombstone.entityType = 'SP'
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that business start date changes are detected
    store.state.stateModel.correctionInformation.startDate = '2022-08-03'
    expect(vm.hasBusinessStartDateChanged).toBe(true)
    store.state.stateModel.correctionInformation.startDate = ''
    expect(vm.hasBusinessStartDateChanged).toBe(false)

    // verify that name translation changes are detected
    store.state.stateModel.nameTranslations = [{ action: 'ACTION' }]
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.state.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that registered mailing address changes are detected
    store.state.stateModel.officeAddresses = { businessOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that registered delivery address changes are detected
    store.state.stateModel.officeAddresses = { businessOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records mailing address changes are detected
    store.state.stateModel.officeAddresses = { businessOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records delivery address changes are detected
    store.state.stateModel.officeAddresses = { businessOffice: newAddress }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that people and roles changes are detected
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        deliveryAddress: {},
        mailingAddress: {},
        officer: {},
        roles: []
      }
    ]
    expect(vm.havePeopleAndRolesChanged).toBe(true)
    store.state.stateModel.peopleAndRoles.orgPeople = []
    expect(vm.havePeopleAndRolesChanged).toBe(false)

    // verify that share structure changes are detected
    store.state.stateModel.shareStructureStep.shareClasses = [{}]
    expect(vm.hasShareStructureChanged).toBe(true)
    store.state.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // verify that the nature of business changes are detected
    store.state.stateModel.businessInformation = {
      naicsCode: '',
      naicsDescription: 'NAICS description 2'
    }
    expect(vm.hasNaicsChanged).toBe(true)
    store.state.stateModel.businessInformation = naics
    expect(vm.hasNaicsChanged).toBe(false)

    // finally, this getter should be false
    expect(vm.hasCorrectionDataChanged).toBe(false)
  })
})

describe('test restoration expiry date', () => {
  it('when no expiry date provided returns visible error', () => {
    expect(store.getters.getFormattedExpiryText()).toEqual('[no expiry date]')
  })

  it('displays appropriate text when restoration expiry date is set', () => {
    store.commit('mutateRestorationExpiry', '2023-12-31')
    // pass in date to force today's date to Feb 28th
    expect(store.getters.getFormattedExpiryText(new Date('2023-02-28')))
      .toEqual('10 months, expires on Dec 31, 2023')
  })

  it('getExpiryDateString() works correctly', () => {
    store.commit('mutateRestorationExpiry', '2023-12-31')
    expect(store.getters.getExpiryDateString).toEqual('2023-12-31')
  })
})
