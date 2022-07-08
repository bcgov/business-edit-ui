import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import Actions from '@/components/common/Actions.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('State Getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.correctedFiling = { incorporationApplication: {} }

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
    expect(vm.isEditing).toBe(false)
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

  it('returns correct values for "Is Filing Valid" getter', async () => {
    // initially, this getter should be false
    expect(vm.isFilingValid).toBe(false)

    // verify that the People And Roles Valid flag alone does nothing
    await vm.$store.commit('mutatePeopleAndRolesValidity', true)
    expect(vm.isFilingValid).toBe(false)
    await vm.$store.commit('mutatePeopleAndRolesValidity', false)

    // verify that the Detail Valid flag alone does nothing
    await vm.$store.commit('mutateDetailValidity', true)
    expect(vm.isFilingValid).toBe(false)
    await vm.$store.commit('mutateDetailValidity', false)

    // verify that the Certify State Valid flag alone does nothing
    await vm.$store.commit('mutateCertifyStateValidity', true)
    expect(vm.isFilingValid).toBe(false)
    await vm.$store.commit('mutateCertifyStateValidity', false)

    // verify that the Staff Payment Valid flag alone does nothing
    await vm.$store.commit('mutateStaffPaymentValidity', true)
    expect(vm.isFilingValid).toBe(false)
    await vm.$store.commit('mutateStaffPaymentValidity', false)

    // verify that all flags works
    await vm.$store.commit('mutatePeopleAndRolesValidity', true)
    await vm.$store.commit('mutateDetailValidity', true)
    await vm.$store.commit('mutateCertifyState', {
      valid: true,
      certifiedBy: 'user'
    })
    await vm.$store.commit('mutateCertifyStateValidity', true)
    await vm.$store.commit('mutateStaffPaymentValidity', true)
    expect(vm.isFilingValid).toBe(true)
    await vm.$store.commit('mutatePeopleAndRolesValidity', false)
    await vm.$store.commit('mutateDetailValidity', false)
    await vm.$store.commit('mutateCertifyState', {
      valid: false,
      certifiedBy: ''
    })
    await vm.$store.commit('mutateCertifyStateValidity', false)
    await vm.$store.commit('mutateStaffPaymentValidity', false)
    expect(vm.isFilingValid).toBe(false)
  })

  it('returns correct values for "Is Editing" getter', async () => {
    // initially, this getter should be false
    expect(vm.isEditing).toBe(false)

    // verify that the Company Name Editing flag works
    await vm.$store.commit('mutateEditingCompanyName', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingCompanyName', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Name Translations Editing flag works
    await vm.$store.commit('mutateEditingNameTranslations', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingNameTranslations', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Office Addresses Editing flag works
    await vm.$store.commit('mutateEditingOfficeAddresses', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingOfficeAddresses', false)
    expect(vm.isEditing).toBe(false)

    // verify that the People And Roles Editing flag works
    await vm.$store.commit('mutateEditingPeopleAndRoles', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingPeopleAndRoles', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Company Share Structure flag works
    await vm.$store.commit('mutateEditingShareStructure', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingShareStructure', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Incorporation Agreement Editing flag works
    await vm.$store.commit('mutateEditingIncorporationAgreement', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateEditingIncorporationAgreement', false)
    expect(vm.isEditing).toBe(false)
  })
})

describe('Alteration getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.correctedFiling = { registration: {} }

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  //
  // FUTURE: implement this
  //
  xit('returns correct values for "Has Alteration Changed" getter', async () => {
    // initially, this getter should be false
    expect(vm.hasAlterationDataChanged).toBe(false)

    // verify that business name changes are detected
    // verify that business type changes are detected
    // verify that name translation changes are detected
    // verify that share structure changes are detected
    // verify that provisions removed is detected
    // verify that new resolution dates are detected
  })
})

describe('BEN IA correction getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = null
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.correctedFiling = {
      business: {
        legalName: 'MyLegalName',
        legalType: 'BEN'
      },
      incorporationApplication: {
        incorporationAgreement: {
          agreementType: 'sample'
        },
        shareStructure: {
          shareClasses: []
        }
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
    expect(vm.hasNameTranslationChanged).toBe(true)
    store.state.stateModel.nameTranslations = []
    expect(vm.hasNameTranslationChanged).toBe(false)

    // verify that registered mailing address changes are detected
    store.state.stateModel.officeAddresses = { registeredOffice: { mailingAddress: { postalCode: 'V8V 8V8' } } }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that registered delivery address changes are detected
    store.state.stateModel.officeAddresses = { registeredOffice: { deliveryAddress: { postalCode: 'V8V 8V8' } } }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records mailing address changes are detected
    store.state.stateModel.officeAddresses = { recordsOffice: { mailingAddress: { postalCode: 'V8V 8V8' } } }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records delivery address changes are detected
    store.state.stateModel.officeAddresses = { recordsOffice: { deliveryAddress: { postalCode: 'V8V 8V8' } } }
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.state.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that people and roles changes are detected
    store.state.stateModel.peopleAndRoles.orgPeople = [{}]
    expect(vm.havePeopleAndRolesChanged).toBe(true)
    store.state.stateModel.peopleAndRoles.orgPeople = []
    expect(vm.havePeopleAndRolesChanged).toBe(false)

    // verify that share structure changes are detected
    store.state.stateModel.shareStructureStep.shareClasses = [{}]
    expect(vm.hasShareStructureChanged).toBe(true)
    store.state.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // verify that incorporation agreement changes are detected
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    expect(vm.hasIncorporationAgreementChanged).toBe(true)
    store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
    expect(vm.hasIncorporationAgreementChanged).toBe(false)

    // finally, this getter should be false
    expect(vm.hasCorrectionDataChanged).toBe(false)
  })
})

describe('SP/GP correction getters', () => {
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.correctedFiling = { registration: {} }

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(Actions, { store, vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  //
  // FUTURE: implement this
  //
  it('returns correct values for "Has Correction Changed" getter', async () => {
    expect(vm.hasCorrectionDataChanged).toBe(true)
  })
})
