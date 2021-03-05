import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { ErrorContact } from '@/components/common'
import { DateMixin } from '@/mixins'

Vue.use(Vuetify)
const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Date Mixin', () => {
  let vm: any

  beforeAll(async () => {
    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(ErrorContact, { store, vuetify, mixins: [DateMixin] })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  // TODO: BROKEN (only in GitHub Actions though!?!?)
  xit('returns correct values for createUtcDate()', () => {
    // init store
    store.state.stateModel.currentJsDate = new Date()

    expect(vm.createUtcDate(2021, 0, 1, 0, 0).toISOString()).toBe('2021-01-01T08:00:00.000Z')
    expect(vm.createUtcDate(2021, 6, 1, 0, 0).toISOString()).toBe('2021-07-01T07:00:00.000Z')
  })

  it('returns correct values for dateToDateString()', () => {
    expect(vm.dateToDateString(null)).toBeNull()
    expect(vm.dateToDateString(new Date('not a date'))).toBeNull()
    // verify that GMT/UTC is correctly converted to Pacific
    expect(vm.dateToDateString(new Date('2021-01-01 07:00:00 GMT'))).toBe('2020-12-31') // Standard Time
    expect(vm.dateToDateString(new Date('2021-01-01 08:00:00 GMT'))).toBe('2021-01-01') // Standard Time
    expect(vm.dateToDateString(new Date('2021-07-01 06:00:00 GMT'))).toBe('2021-06-30') // Daylight Time
    expect(vm.dateToDateString(new Date('2021-07-01 07:00:00 GMT'))).toBe('2021-07-01') // Daylight Time
    // verify that Pacific is correctly converted to Pacific
    expect(vm.dateToDateString(new Date('2021-01-01 00:00:00 PST'))).toBe('2021-01-01')
    expect(vm.dateToDateString(new Date('2021-01-01 23:59:59 PST'))).toBe('2021-01-01')
    expect(vm.dateToDateString(new Date('2021-07-01 00:00:00 PDT'))).toBe('2021-07-01')
    expect(vm.dateToDateString(new Date('2021-07-01 23:59:59 PDT'))).toBe('2021-07-01')
    // verify that Eastern is correctly converted to Pacific
    expect(vm.dateToDateString(new Date('2021-01-01 02:00:00 EST'))).toBe('2020-12-31')
    expect(vm.dateToDateString(new Date('2021-01-01 03:00:00 EST'))).toBe('2021-01-01')
    expect(vm.dateToDateString(new Date('2021-07-01 02:00:00 EDT'))).toBe('2021-06-30')
    expect(vm.dateToDateString(new Date('2021-07-01 03:00:00 EDT'))).toBe('2021-07-01')
  })

  it('returns correct values for dateToTimeString()', () => {
    expect(vm.dateToTimeString(null)).toBeNull()
    expect(vm.dateToTimeString(new Date('not a date'))).toBeNull()
    // verify that GMT/UTC is correctly converted to Pacific
    expect(vm.dateToTimeString(new Date('2021-01-01 07:00:00 GMT'))).toBe('11:00 pm') // Standard Time
    expect(vm.dateToTimeString(new Date('2021-01-01 08:00:00 GMT'))).toBe('12:00 am') // Standard Time
    expect(vm.dateToTimeString(new Date('2021-07-01 06:00:00 GMT'))).toBe('11:00 pm') // Daylight Time
    expect(vm.dateToTimeString(new Date('2021-07-01 07:00:00 GMT'))).toBe('12:00 am') // Daylight Time
    // verify that Pacific is correctly converted to Pacific
    expect(vm.dateToTimeString(new Date('2021-01-01 00:00:00 PST'))).toBe('12:00 am')
    expect(vm.dateToTimeString(new Date('2021-01-01 23:59:59 PST'))).toBe('11:59 pm')
    expect(vm.dateToTimeString(new Date('2021-07-01 00:00:00 PDT'))).toBe('12:00 am')
    expect(vm.dateToTimeString(new Date('2021-07-01 23:59:59 PDT'))).toBe('11:59 pm')
    // verify that Eastern is correctly converted to Pacific
    expect(vm.dateToTimeString(new Date('2021-01-01 02:00:00 EST'))).toBe('11:00 pm')
    expect(vm.dateToTimeString(new Date('2021-01-01 03:00:00 EST'))).toBe('12:00 am')
    expect(vm.dateToTimeString(new Date('2021-07-01 02:00:00 EDT'))).toBe('11:00 pm')
    expect(vm.dateToTimeString(new Date('2021-07-01 03:00:00 EDT'))).toBe('12:00 am')
  })

  it('returns correct values for formatDateString()', () => {
    expect(vm.formatDateString(null)).toBeNull()
    expect(vm.formatDateString('2020-12-31')).toBe('Dec 31, 2020')
    expect(vm.formatDateString('2021-01-01')).toBe('Jan 1, 2021')
    expect(vm.formatDateString('2021-06-30')).toBe('Jun 30, 2021')
    expect(vm.formatDateString('2021-07-01')).toBe('Jul 1, 2021')
  })

  it('returns correct values for fullFormatDate()', () => {
    expect(vm.fullFormatDate(null)).toBeNull()
    expect(vm.fullFormatDate(new Date('not a date'))).toBeNull()
    // verify some Standard times
    expect(vm.fullFormatDate(new Date('2021-01-01 07:00:00 GMT')))
      .toBe('Thursday, December 31, 2020 at 11:00 pm Pacific time')
    expect(vm.fullFormatDate(new Date('2021-01-01 08:00:00 GMT')))
      .toBe('Friday, January 1, 2021 at 12:00 am Pacific time')
      // verify some Daylight times
    expect(vm.fullFormatDate(new Date('2021-07-01 06:00:00 GMT')))
      .toBe('Wednesday, June 30, 2021 at 11:00 pm Pacific time')
    expect(vm.fullFormatDate(new Date('2021-07-01 07:00:00 GMT')))
      .toBe('Thursday, July 1, 2021 at 12:00 am Pacific time')
  })

  it('returns correct values for apiToDateAndTimeString()', () => {
    expect(vm.apiToDateAndTimeString('2021-01-01T00:00:00+00:00')).toBe('2020-12-31 at 4:00 pm') // PST
    expect(vm.apiToDateAndTimeString('2021-07-01T00:00:00+00:00')).toBe('2021-06-30 at 5:00 pm') // PDT
  })

  it('returns correct values for daysFromToday()', () => {
    // init store
    store.state.stateModel.tombstone.currentDate = '2021-01-20'

    expect(vm.daysFromToday(null)).toBeNaN()
    expect(vm.daysFromToday('2021-01-19')).toBe(-1) // yesterday
    expect(vm.daysFromToday('2021-01-20')).toBe(0) // today
    expect(vm.daysFromToday('2021-01-21')).toBe(1) // tomorrow
  })
})
