import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { Actions } from '@/components/common'

Vue.use(Vuetify)
const vuetify = new Vuetify({})
const store = getVuexStore()

describe('State Getters', () => {
  let vm: any

  beforeAll(async () => {
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

  it('returns correct values for "Is Filing Changed" getter', async () => {
    // initially, this getter should be false
    expect(vm.isFilingChanged).toBe(false)

    // verify that the People and Roles Changed flag works
    await vm.$store.commit('mutatePeopleAndRolesChanged', true)
    expect(vm.isFilingChanged).toBe(true)
    await vm.$store.commit('mutatePeopleAndRolesChanged', false)
    expect(vm.isFilingChanged).toBe(false)

    // verify that the Define Company Changed flag works
    await vm.$store.commit('mutateDefineCompanyStepChanged', true)
    expect(vm.isFilingChanged).toBe(true)
    await vm.$store.commit('mutateDefineCompanyStepChanged', false)
    expect(vm.isFilingChanged).toBe(false)

    // verify that the Share Structure Changed flag works
    await vm.$store.commit('mutateShareStructureChanged', true)
    expect(vm.isFilingChanged).toBe(true)
    await vm.$store.commit('mutateShareStructureChanged', false)
    expect(vm.isFilingChanged).toBe(false)

    // verify that the Incorporation Agreement Changed flag works
    await vm.$store.commit('mutateIncorporationAgreementChanged', true)
    expect(vm.isFilingChanged).toBe(true)
    await vm.$store.commit('mutateIncorporationAgreementChanged', false)
    expect(vm.isFilingChanged).toBe(false)
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
    await vm.$store.commit('mutateCertifyStateValidity', true)
    await vm.$store.commit('mutateStaffPaymentValidity', true)
    expect(vm.isFilingValid).toBe(true)
    await vm.$store.commit('mutatePeopleAndRolesValidity', false)
    await vm.$store.commit('mutateDetailValidity', false)
    await vm.$store.commit('mutateCertifyStateValidity', false)
    await vm.$store.commit('mutateStaffPaymentValidity', false)
    expect(vm.isFilingValid).toBe(false)
  })

  it('returns correct values for "Is Editing" getter', async () => {
    // initially, this getter should be false
    expect(vm.isEditing).toBe(false)

    // verify that the Company Name Editing flag works
    await vm.$store.commit('mutateCompanyNameEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateCompanyNameEditing', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Name Translations Editing flag works
    await vm.$store.commit('mutateNameTranslationsEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateNameTranslationsEditing', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Office Addresses Editing flag works
    await vm.$store.commit('mutateOfficeAddressesEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateOfficeAddressesEditing', false)
    expect(vm.isEditing).toBe(false)

    // verify that the People And Roles Editing flag works
    await vm.$store.commit('mutatePeopleAndRolesEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutatePeopleAndRolesEditing', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Company Share Structure flag works
    await vm.$store.commit('mutateShareStructureEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateShareStructureEditing', false)
    expect(vm.isEditing).toBe(false)

    // verify that the Incorporation Agreement Editing flag works
    await vm.$store.commit('mutateIncorporationAgreementEditing', true)
    expect(vm.isEditing).toBe(true)
    await vm.$store.commit('mutateIncorporationAgreementEditing', false)
    expect(vm.isEditing).toBe(false)
  })
})
