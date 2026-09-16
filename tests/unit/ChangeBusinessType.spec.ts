import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes, RoleTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { EntitySnapshotIF, OrgPersonIF } from '@/interfaces'
import { mockFeatureFlagsForAlterationChangeBusinessTypes } from './utils'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Change Business Type component', () => {
  it('renders itself', () => {
    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)

    wrapper.destroy()
  })

  it('defaults invalidSection prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: {}
    })
    const vm = wrapper.vm as any

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('accepts invalidSection prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: { invalidSection: true }
    })
    const vm = wrapper.vm as any

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for a Coop Special Resolution filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for a GP Change filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_NAME
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for a GP Conversion filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP
    store.stateModel.tombstone.filingType = FilingTypes.CONVERSION
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have correct button and no tooltip for a BC Alteration filing', async () => {
    mockFeatureFlagsForAlterationChangeBusinessTypes()
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { businessInfo: { legalType: 'BC' } } as any
    store.resourceModel.changeData = { typeChangeInfo: null } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    await Vue.nextTick()

    expect(wrapper.find('.v-tooltip').exists()).toBe(false)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(true)

    wrapper.destroy()
    vi.clearAllMocks()
  })

  it('should have correct button and no tooltip for a C Alteration filing', async () => {
    mockFeatureFlagsForAlterationChangeBusinessTypes()
    store.stateModel.tombstone.entityType = CorpTypeCd.CONTINUE_IN
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { businessInfo: { legalType: 'C' } } as any
    store.resourceModel.changeData = { typeChangeInfo: null } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    await Vue.nextTick()

    expect(wrapper.find('.v-tooltip').exists()).toBe(false)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(true)

    wrapper.destroy()
    vi.clearAllMocks()
  })

  it('should have actions hidden when entityTypeChangedByName is enabled', () => {
    store.stateModel.tombstone.entityTypeChangedByName = true
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.actions').exists()).toBe(false)
  })

  it('should update name if numbered and switching between certain types', async () => {
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalType: CorpTypeCd.BC_COMPANY,
        legalName: '1234567 LTD.'
      }
    } as EntitySnapshotIF
    store.stateModel.nameRequestLegalName = '1234567 LTD.'
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_ULC_COMPANY
    const wrapper: any = mount(ChangeBusinessType, { vuetify })
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_ULC_COMPANY
    wrapper.vm.submitTypeChange()

    expect(wrapper.vm.getNameRequestLegalName).toBe('1234567 UNLIMITED LIABILITY COMPANY')

    store.stateModel.entitySnapshot.businessInfo.legalType = CorpTypeCd.BC_COMPANY
    store.stateModel.entitySnapshot.businessInfo.legalName = '1234567 LTD.'
    store.stateModel.nameRequestLegalName = '1234567 LTD.'
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_CCC
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_CCC
    wrapper.vm.submitTypeChange()

    // Less than 3 directors, fail to change legal type
    expect(wrapper.vm.getNameRequestLegalName).toBe('1234567 LTD.')

    store.stateModel.entitySnapshot.businessInfo.legalType = CorpTypeCd.BC_ULC_COMPANY
    store.stateModel.entitySnapshot.businessInfo.legalName = '1234567 COMMUNITY CONTRIBUTION COMPANY'
    store.stateModel.nameRequestLegalName = '1234567 COMMUNITY CONTRIBUTION COMPANY'
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_COMPANY
    wrapper.vm.submitTypeChange()

    expect(wrapper.vm.getNameRequestLegalName).toBe('1234567 LTD.')

    store.stateModel.entitySnapshot.businessInfo.legalType = CorpTypeCd.BC_ULC_COMPANY
    store.stateModel.entitySnapshot.businessInfo.legalName = '1234567 UNLIMITED LIABILITY COMPANY'
    store.stateModel.nameRequestLegalName = '1234567 UNLIMITED LIABILITY COMPANY'
    wrapper.vm.selectedEntityType = CorpTypeCd.BENEFIT_COMPANY
    wrapper.vm.submitTypeChange()

    expect(wrapper.vm.getNameRequestLegalName).toBe('1234567 LTD.')
  })

  it('should regenerate numbered name suffix when a named company changed to numbered then changes type', () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.tombstone.businessId = 'BC0894642'
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalType: CorpTypeCd.BC_COMPANY,
        legalName: 'HELLO LTD.'
      }
    } as EntitySnapshotIF
    // name was already changed to numbered while the type was still BC
    store.stateModel.nameRequest = { legalType: CorpTypeCd.BC_COMPANY, nrNum: undefined } as any
    store.stateModel.nameRequestLegalName = '0894642 B.C. LTD.'
    store.stateModel.tombstone.nameChangedToNumber = true
    store.stateModel.tombstone.nameChangedByType = false
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY

    const wrapper: any = mount(ChangeBusinessType, { vuetify })

    wrapper.vm.selectedEntityType = CorpTypeCd.BC_ULC_COMPANY
    wrapper.vm.submitTypeChange()

    expect(wrapper.vm.getNameRequestLegalName).toBe('0894642 B.C. UNLIMITED LIABILITY COMPANY')
    expect(store.stateModel.nameRequest.legalType).toBe(CorpTypeCd.BC_ULC_COMPANY)
    expect(store.stateModel.nameRequest.nrNum).toBeUndefined()
    expect(store.stateModel.tombstone.nameChangedByType).toBe(false)

    // and back to a limited company
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_COMPANY
    wrapper.vm.submitTypeChange()

    expect(wrapper.vm.getNameRequestLegalName).toBe('0894642 B.C. LTD.')
    expect(store.stateModel.nameRequest.legalType).toBe(CorpTypeCd.BC_COMPANY)

    store.stateModel.tombstone.nameChangedToNumber = false
    wrapper.destroy()
  })

  it('should have name request required error for business type change', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalName: 'HELLO LTD.'
      }
    } as EntitySnapshotIF
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_CCC
    store.stateModel.tombstone.entityTypeChangedByName = false

    const wrapper: any = mount(ChangeBusinessType, { vuetify })
    wrapper.vm.isEditingType = true
    wrapper.vm.hasAttemptedSubmission = true
    await Vue.nextTick()

    expect(wrapper.find('#name-request-required-error').exists()).toBe(true)

    store.stateModel.tombstone.entityType = CorpTypeCd.BC_ULC_COMPANY
    await Vue.nextTick()

    expect(wrapper.find('#name-request-required-error').exists()).toBe(true)

    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalType: CorpTypeCd.BC_ULC_COMPANY
      }
    } as EntitySnapshotIF
    await Vue.nextTick()

    expect(wrapper.find('#name-request-required-error').exists()).toBe(true)
  })

  it('should show error for less than 2 directors for CCC test', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_CCC
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.peopleAndRoles.orgPeople = [
      {
        roles: [
          { roleType: RoleTypes.DIRECTOR }
        ]
      }
    ] as OrgPersonIF[]

    const wrapper = mount(ChangeBusinessType, { vuetify })
    wrapper.setData({ isEditingType: true })
    wrapper.setData({ hasAttemptedSubmission: true })

    await Vue.nextTick()

    expect(wrapper.find('#minimum-three-director-error').exists()).toBe(true)

    store.stateModel.peopleAndRoles.orgPeople = [
      {
        roles: [
          { roleType: RoleTypes.DIRECTOR }
        ]
      },
      {
        roles: [
          { roleType: RoleTypes.DIRECTOR }
        ]
      },
      {
        roles: [
          { roleType: RoleTypes.DIRECTOR }
        ]
      }
    ] as OrgPersonIF[]

    await Vue.nextTick()

    expect(wrapper.find('#minimum-three-director-error').exists()).toBe(false)
  })

  it('should NOT show conflict tooltip when name is changed to numbered during a type change', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalType: CorpTypeCd.BENEFIT_COMPANY,
        legalName: 'HELLO BENEFIT COMPANY LTD.'
      }
    } as EntitySnapshotIF

    // simulate: type changed to BC, name changed to numbered (no NR)
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.nameRequest = { legalType: CorpTypeCd.BENEFIT_COMPANY, nrNum: undefined } as any
    store.stateModel.nameRequestLegalName = '3000152 B.C. LTD.'

    const wrapper: any = mount(ChangeBusinessType, { vuetify })
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_COMPANY
    await Vue.nextTick()

    wrapper.vm.isEditingType = false
    await Vue.nextTick()

    expect(wrapper.vm.hasNewNr).toBe(false)
    expect(wrapper.find('.v-tooltip').exists()).toBe(false)

    wrapper.destroy()
  })

  it('should still show conflict tooltip for a real NR name/type mismatch', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalType: CorpTypeCd.BENEFIT_COMPANY,
        legalName: 'HELLO BENEFIT COMPANY LTD.'
      }
    } as EntitySnapshotIF

    // simulate: real NR entered with a legal type that conflicts with the selected type
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.nameRequest = { legalType: CorpTypeCd.BENEFIT_COMPANY, nrNum: 'NR 1234567' } as any
    store.stateModel.nameRequestLegalName = 'NEW NAME LTD.'

    const wrapper: any = mount(ChangeBusinessType, { vuetify })
    wrapper.vm.selectedEntityType = CorpTypeCd.BC_COMPANY
    await Vue.nextTick()

    wrapper.vm.isEditingType = false
    await Vue.nextTick()

    expect(wrapper.vm.isConflictingLegalType).toBe(true)
    expect(wrapper.vm.hasNewNr).toBe(true)
    expect(wrapper.find('.v-tooltip').exists()).toBe(true)

    wrapper.destroy()
  })
})
