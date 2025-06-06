import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import Actions from '@/components/common/Actions.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { ActionTypes, CorrectionErrorTypes, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import * as utils from '@/utils'

// Vuetify is needed for Actions component
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('State Getters', () => {
  let wrapper: any
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.CLIENT

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    wrapper = shallowMount(Actions)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns correct values for "Is Busy Saving" et al getters', async () => {
    // initially, these getters should be false
    expect(vm.isSaving).toBe(false)
    expect(vm.isSavingResuming).toBe(false)
    expect(vm.isFilingPaying).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Saving flag works
    store.setIsSaving(true)
    expect(vm.isSaving).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    store.setIsSaving(false)
    expect(vm.isCorrectionEditing).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Saving Resuming flag works
    store.setIsSavingResuming(true)
    expect(vm.isSavingResuming).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    store.setIsSavingResuming(false)
    expect(vm.isSavingResuming).toBe(false)
    expect(vm.isBusySaving).toBe(false)

    // verify that the Is Filing Saving flag works
    store.setIsFilingPaying(true)
    expect(vm.isFilingPaying).toBe(true)
    expect(vm.isBusySaving).toBe(true)
    store.setIsFilingPaying(false)
    expect(vm.isFilingPaying).toBe(false)
    expect(vm.isBusySaving).toBe(false)
  })

  // FUTURE: fix this to work for non-correction filing
  it.skip('returns correct values for "Is Filing Valid" getter', async () => {
    // initially, this getter should be false
    expect(vm.isCorrectionValid).toBe(false)

    // verify that the People And Roles Valid flag alone does nothing
    store.setPeopleAndRolesValidity(true)
    expect(vm.isCorrectionValid).toBe(false)
    store.setPeopleAndRolesValidity(false)

    // verify that the Detail Valid flag alone does nothing
    store.setDetailValidity(true)
    expect(vm.isCorrectionValid).toBe(false)
    store.setDetailValidity(false)

    // verify that the Certify State Valid flag alone does nothing
    store.setCertifyStateValidity(true)
    expect(vm.isCorrectionValid).toBe(false)
    store.setCertifyStateValidity(false)

    // verify that the Staff Payment Valid flag alone does nothing
    store.setStaffPaymentValidity(true)
    expect(vm.isCorrectionValid).toBe(false)
    store.setStaffPaymentValidity(false)

    // verify that all flags works
    store.setPeopleAndRolesValidity(true)
    store.setCreateShareStructureStepValidity(true)
    store.setDetailValidity(true)
    store.setCertifyState({
      valid: true,
      certifiedBy: 'user'
    })
    store.setCertifyStateValidity(true)
    store.setStaffPaymentValidity(true)
    expect(vm.isCorrectionValid).toBe(true)
    store.setPeopleAndRolesValidity(false)
    store.setDetailValidity(false)
    store.setCertifyState({
      valid: false,
      certifiedBy: ''
    })
    store.setCertifyStateValidity(false)
    store.setStaffPaymentValidity(false)
    expect(vm.isCorrectionValid).toBe(false)
  })

  it('returns correct values for "Is Correction  Valid" getter', async () => {
    // initially, this getter should be false
    // (because certify state is initially invalid)
    expect(vm.isCorrectionValid).toBe(false)

    // set all flags to valid
    store.setValidComponent({ key: 'isValidCompanyName', value: true })
    store.setValidComponent({ key: 'isValidNameTranslation', value: true })
    store.setValidComponent({ key: 'isValidAddress', value: true })
    store.setValidComponent({ key: 'isValidOrgPersons', value: true })
    store.setValidComponent({ key: 'isValidShareStructure', value: true })
    store.setValidComponent({ key: 'isValidResolutionDate', value: true })
    store.setDetailValidity(true)
    store.setCertifyStateValidity(true)
    store.setStaffPaymentValidity(true)

    // now, this getter should be true
    expect(vm.isCorrectionValid).toBe(true)

    // verify that the Valid Company Name flag alone affects validity
    store.setValidComponent({ key: 'isValidCompanyName', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidCompanyName', value: true })

    // verify that the Valid Name Translation flag alone affects validity
    store.setValidComponent({ key: 'isValidNameTranslation', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidNameTranslation', value: true })

    // verify that the Valid Address flag alone affects validity
    store.setValidComponent({ key: 'isValidAddress', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidAddress', value: true })

    // verify that the Valid Org Persons flag alone affects validity
    store.setValidComponent({ key: 'isValidOrgPersons', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidOrgPersons', value: true })

    // verify that the Valid Share Structure flag alone affects validity
    store.setValidComponent({ key: 'isValidShareStructure', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidShareStructure', value: true })

    // verify that the Valid Detail Comment flag alone affects validity
    store.setDetailValidity(false)
    expect(vm.isCorrectionValid).toBe(false)
    store.setDetailValidity(true)

    // verify that the Valid Certify flag alone affects validity
    store.setCertifyStateValidity(false)
    expect(vm.isCorrectionValid).toBe(false)
    store.setCertifyStateValidity(true)

    // verify that the Valid Staff Payment flag alone affects validity
    store.setStaffPaymentValidity(false)
    expect(vm.isCorrectionValid).toBe(false)
    store.setStaffPaymentValidity(true)

    // check for resolution date flag alone affects validity
    store.setValidComponent({ key: 'isValidResolutionDate', value: false })
    expect(vm.isCorrectionValid).toBe(false)
    store.setValidComponent({ key: 'isValidResolutionDate', value: true })

    // this getter should be true again
    expect(vm.isCorrectionValid).toBe(true)
  })

  it('returns correct values for "Is Editing" getter', async () => {
    // initially, this getter should be false
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Company Name flag works
    store.setEditingCompanyName(true)
    expect(vm.isCorrectionEditing).toBe(true)
    store.setEditingCompanyName(false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Name Translations flag works
    store.setEditingNameTranslations(true)
    expect(vm.isCorrectionEditing).toBe(true)
    store.setEditingNameTranslations(false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Office Addresses flag works
    store.setEditingOfficeAddresses(true)
    expect(vm.isCorrectionEditing).toBe(true)
    store.setEditingOfficeAddresses(false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing People And Roles flag works
    store.setEditingPeopleAndRoles(true)
    expect(vm.isCorrectionEditing).toBe(true)
    store.setEditingPeopleAndRoles(false)
    expect(vm.isCorrectionEditing).toBe(false)

    // verify that the Editing Share Structure flag works
    store.setEditingShareStructure(true)
    expect(vm.isCorrectionEditing).toBe(true)
    store.setEditingShareStructure(false)
    expect(vm.isCorrectionEditing).toBe(false)
  })
})

describe('Alteration getters', () => {
  let wrapper: any
  let vm: any

  beforeAll(async () => {
    // initialize store
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.newAlteration.provisionsRemoved = false
    store.stateModel.shareStructureStep = {
      resolutionDates: [],
      shareClasses: []
    }
    store.stateModel.nameRequestLegalName = 'MyLegalName'
    store.stateModel.entitySnapshot = {
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
    } as any

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    wrapper = shallowMount(Actions)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns correct values for "Has Alteration Changed" getter', async () => {
    // initially, this getter should be false
    expect(vm.hasAlterationDataChanged).toBe(false)

    // verify that business name changes are detected
    store.stateModel.nameRequestLegalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.stateModel.nameRequestLegalName = 'MyLegalName'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that name translation changes are detected
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED }] as any
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that share structure changes are detected
    store.stateModel.shareStructureStep.shareClasses = [{}] as any
    expect(vm.hasShareStructureChanged).toBe(true)
    store.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // verify that provisions removed is detected
    store.stateModel.newAlteration.provisionsRemoved = true
    expect(vm.areProvisionsRemoved).toBe(true)
    store.stateModel.newAlteration.provisionsRemoved = false
    expect(vm.areProvisionsRemoved).toBe(false)

    // verify that new resolution dates are detected
    // store.stateModel.shareStructureStep.resolutionDates = ['s']
    // expect(vm.haveNewResolutionDates).toBe(true)
    // store.stateModel.shareStructureStep.resolutionDates = []
    // expect(vm.haveNewResolutionDates).toBe(false)

    // finally, this getter should be false
    expect(vm.hasAlterationDataChanged).toBe(false)
  })
})

describe('BEN correction getters', () => {
  let wrapper: any
  let vm: any

  const newAddress = {
    deliveryAddress: { postalCode: 'V8V 8V8' },
    mailingAddress: { postalCode: 'V8V 8V8' }
  }

  beforeAll(async () => {
    // initialize store
    store.stateModel.tombstone.entityType = null
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.entitySnapshot = {
      businessInfo: {
        legalName: 'MyLegalName',
        legalType: CorpTypeCd.BENEFIT_COMPANY
      },
      shareStructure: {
        shareClasses: []
      }
    } as any

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    wrapper = shallowMount(Actions)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns correct values for "Has Correction Changed" getter', async () => {
    // initially, this getter should be false (default value)
    expect(vm.hasCorrectionDataChanged).toBe(false)
    // verify that business name changes are detected
    store.stateModel.nameRequestLegalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.stateModel.nameRequestLegalName = 'MyLegalName'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.stateModel.tombstone.entityType = CorpTypeCd.UNLIMITED_LIABILITY_COMPANY
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that name translation changes are detected
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED }] as any
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that registered mailing address changes are detected
    store.stateModel.officeAddresses = { registeredOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that registered delivery address changes are detected
    store.stateModel.officeAddresses = { registeredOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records mailing address changes are detected
    store.stateModel.officeAddresses = { recordsOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records delivery address changes are detected
    store.stateModel.officeAddresses = { recordsOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that people and roles changes are detected
    store.stateModel.peopleAndRoles.orgPeople = [
      {
        deliveryAddress: {},
        mailingAddress: {},
        officer: {},
        roles: []
      }
    ] as any
    expect(vm.havePeopleAndRolesChanged).toBe(true)
    store.stateModel.peopleAndRoles.orgPeople = []
    expect(vm.havePeopleAndRolesChanged).toBe(false)

    // verify that share structure changes are detected
    store.stateModel.shareStructureStep.shareClasses = [{}] as any
    expect(vm.hasShareStructureChanged).toBe(true)
    store.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)
    // finally, this getter should be false
    expect(vm.hasCorrectionDataChanged).toBe(false)
  })
})

describe('SP/GP correction getters - with easy legal name fix', () => {
  let wrapper: any
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
    vi.spyOn(utils, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return true
      return null
    })
    // initialize store
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.tombstone.businessId = 'FM1234567'
    store.stateModel.nameRequestLegalName = 'My Alternate Name'
    store.stateModel.entitySnapshot = {
      businessInfo: {
        identifier: 'FM1234567',
        legalName: 'MyLegalName',
        legalType: CorpTypeCd.SOLE_PROP,
        naicsCode: '100000',
        naicsDescription: 'NAICS description',
        alternateNames: [
          {
            identifier: 'FM1234567',
            name: 'My Alternate Name'
          }
        ]
      },
      shareStructure: {
        shareClasses: []
      }
    } as any
    store.stateModel.correctionInformation = {
      startDate: ''
    } as any
    store.stateModel.officeAddresses = null
    store.stateModel.businessInformation = naics as any

    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    wrapper = shallowMount(Actions, { vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns correct values for "Has Correction Changed" getter', async () => {
    // initially, this getter should be false (default value)
    expect(vm.hasCorrectionDataChanged).toBe(false)
    // verify that business name changes are detected
    store.stateModel.nameRequestLegalName = 'MyLegalName2'
    expect(vm.hasBusinessNameChanged).toBe(true)
    store.stateModel.nameRequestLegalName = 'My Alternate Name'
    expect(vm.hasBusinessNameChanged).toBe(false)

    // verify that business type changes are detected
    store.stateModel.tombstone.entityType = 'SP2' as CorpTypeCd
    expect(vm.hasBusinessTypeChanged).toBe(true)
    store.stateModel.tombstone.entityType = 'SP' as CorpTypeCd
    expect(vm.hasBusinessTypeChanged).toBe(false)

    // verify that business start date changes are detected
    store.stateModel.correctionInformation.startDate = '2022-08-03'
    expect(vm.hasBusinessStartDateChanged).toBe(true)
    store.stateModel.correctionInformation.startDate = ''
    expect(vm.hasBusinessStartDateChanged).toBe(false)

    // verify that name translation changes are detected
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED }] as any
    expect(vm.haveNameTranslationsChanged).toBe(true)
    store.stateModel.nameTranslations = []
    expect(vm.haveNameTranslationsChanged).toBe(false)

    // verify that registered mailing address changes are detected
    store.stateModel.officeAddresses = { businessOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that registered delivery address changes are detected
    store.stateModel.officeAddresses = { businessOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records mailing address changes are detected
    store.stateModel.officeAddresses = { businessOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that records delivery address changes are detected
    store.stateModel.officeAddresses = { businessOffice: newAddress } as any
    expect(vm.haveOfficeAddressesChanged).toBe(true)
    store.stateModel.officeAddresses = null
    expect(vm.haveOfficeAddressesChanged).toBe(false)

    // verify that people and roles changes are detected
    store.stateModel.peopleAndRoles.orgPeople = [
      {
        deliveryAddress: {},
        mailingAddress: {},
        officer: {},
        roles: []
      }
    ] as any
    expect(vm.havePeopleAndRolesChanged).toBe(true)
    store.stateModel.peopleAndRoles.orgPeople = []
    expect(vm.havePeopleAndRolesChanged).toBe(false)

    // verify that share structure changes are detected
    store.stateModel.shareStructureStep.shareClasses = [{}] as any
    expect(vm.hasShareStructureChanged).toBe(true)
    store.stateModel.shareStructureStep.shareClasses = []
    expect(vm.hasShareStructureChanged).toBe(false)

    // verify that the nature of business changes are detected
    store.stateModel.businessInformation = {
      naicsCode: '',
      naicsDescription: 'NAICS description 2'
    } as any
    expect(vm.hasNaicsChanged).toBe(true)
    store.stateModel.businessInformation = naics as any
    expect(vm.hasNaicsChanged).toBe(false)
    // finally, this getter should be false
    expect(vm.hasCorrectionDataChanged).toBe(false)
  })
})

describe('test restoration expiry date', () => {
  it('returns fallback string when no restoration expiry date exists', () => {
    store.setRestorationExpiryDate(null)
    expect(store.getRestorationExpiryText).toEqual('[no expiry date]')
  })

  it('returns correct string when restoration expiry date exists', () => {
    store.setRestorationExpiryDate('2023-12-31')
    expect(store.getRestorationExpiryText).toContain('expires on Dec 31, 2023')
  })

  it('getRestorationExpiryDate() works correctly', () => {
    store.setRestorationExpiryDate('2023-12-31')
    expect(store.getRestorationExpiryDate).toEqual('2023-12-31')
  })
})
