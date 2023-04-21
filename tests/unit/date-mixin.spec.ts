/* eslint max-len: 0 */
import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore() // eslint-disable-line @typescript-eslint/no-unused-vars

describe('Date Mixin', () => {
  let vm: any

  beforeAll(async () => {
    // mount the component and wait for everything to stabilize
    const wrapper = shallowMount(MixinTester)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  // FUTURE: this works locally but not in GHA; fix later
  it('returns correct values for createUtcDate()', () => {
    expect(vm.createUtcDate(2021, 0, 1, 0, 0).toISOString()).toBe('2021-01-01T08:00:00.000Z') // PST
    expect(vm.createUtcDate(2021, 6, 1, 0, 0).toISOString()).toBe('2021-07-01T07:00:00.000Z') // PDT
  })

  it('returns correct values for yyyyMmDdToDate()', () => {
    expect(vm.yyyyMmDdToDate(null)).toBeNull()
    expect(vm.yyyyMmDdToDate('12345678901')).toBeNull()
    expect(vm.yyyyMmDdToDate('2021-01-01').toISOString()).toEqual('2021-01-01T08:00:00.000Z') // PST
    expect(vm.yyyyMmDdToDate('2021-07-01').toISOString()).toEqual('2021-07-01T07:00:00.000Z') // PDT
  })

  it('returns correct values for mmmDdYyyyToDate()', () => {
    expect(vm.mmmDdYyyyToDate(null)).toBeNull()
    expect(vm.mmmDdYyyyToDate('January 1, 2021').toISOString()).toEqual('2021-01-01T08:00:00.000Z') // PST
    expect(vm.mmmDdYyyyToDate('July 1, 2021').toISOString()).toEqual('2021-07-01T07:00:00.000Z') // PDT
  })

  // FUTURE: this works locally but not in GHA; fix later
  xit('returns correct values for dateToYyyyMmDd()', () => {
    expect(vm.dateToYyyyMmDd(null)).toBeNull()
    expect(vm.dateToYyyyMmDd(new Date('not a date'))).toBeNull()
    // verify that GMT/UTC is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 07:00:00 GMT'))).toBe('2020-12-31') // Standard Time
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 08:00:00 GMT'))).toBe('2021-01-01') // Standard Time
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 06:00:00 GMT'))).toBe('2021-06-30') // Daylight Time
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 07:00:00 GMT'))).toBe('2021-07-01') // Daylight Time
    // verify that Pacific is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 00:00:00 PST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 23:59:59 PST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 00:00:00 PDT'))).toBe('2021-07-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 23:59:59 PDT'))).toBe('2021-07-01')
    // verify that Eastern is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 02:00:00 EST'))).toBe('2020-12-31')
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 03:00:00 EST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 02:00:00 EDT'))).toBe('2021-06-30')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 03:00:00 EDT'))).toBe('2021-07-01')
  })

  xit('returns correct values for dateToPacificDate()', () => {
    // FUTURE
  })

  it('returns correct values for dateToPacificTime()', () => {
    expect(vm.dateToPacificTime(null)).toBeNull()
    expect(vm.dateToPacificTime(new Date('not a date'))).toBeNull()
    // verify that GMT/UTC is correctly converted to Pacific
    expect(vm.dateToPacificTime(new Date('2021-01-01 07:00:00 GMT'))).toBe('11:00 pm') // Standard Time
    expect(vm.dateToPacificTime(new Date('2021-01-01 08:00:00 GMT'))).toBe('12:00 am') // Standard Time
    expect(vm.dateToPacificTime(new Date('2021-07-01 06:00:00 GMT'))).toBe('11:00 pm') // Daylight Time
    expect(vm.dateToPacificTime(new Date('2021-07-01 07:00:00 GMT'))).toBe('12:00 am') // Daylight Time
    // verify that Pacific is correctly converted to Pacific
    expect(vm.dateToPacificTime(new Date('2021-01-01 00:00:00 PST'))).toBe('12:00 am')
    expect(vm.dateToPacificTime(new Date('2021-01-01 23:59:59 PST'))).toBe('11:59 pm')
    expect(vm.dateToPacificTime(new Date('2021-07-01 00:00:00 PDT'))).toBe('12:00 am')
    expect(vm.dateToPacificTime(new Date('2021-07-01 23:59:59 PDT'))).toBe('11:59 pm')
    // verify that Eastern is correctly converted to Pacific
    expect(vm.dateToPacificTime(new Date('2021-01-01 02:00:00 EST'))).toBe('11:00 pm')
    expect(vm.dateToPacificTime(new Date('2021-01-01 03:00:00 EST'))).toBe('12:00 am')
    expect(vm.dateToPacificTime(new Date('2021-07-01 02:00:00 EDT'))).toBe('11:00 pm')
    expect(vm.dateToPacificTime(new Date('2021-07-01 03:00:00 EDT'))).toBe('12:00 am')
  })

  it('returns correct values for dateToPacificDateTime()', () => {
    expect(vm.dateToPacificDateTime(null)).toBeNull()
    expect(vm.dateToPacificDateTime(new Date('not a date'))).toBeNull()
    // verify some Standard times
    expect(vm.dateToPacificDateTime(new Date('2021-01-01 07:00:00 GMT'))).toBe('December 31, 2020 at 11:00 pm Pacific time')
    expect(vm.dateToPacificDateTime(new Date('2021-01-01 08:00:00 GMT'))).toBe('January 1, 2021 at 12:00 am Pacific time')
    // verify some Daylight times
    expect(vm.dateToPacificDateTime(new Date('2021-07-01 06:00:00 GMT'))).toBe('June 30, 2021 at 11:00 pm Pacific time')
    expect(vm.dateToPacificDateTime(new Date('2021-07-01 07:00:00 GMT'))).toBe('July 1, 2021 at 12:00 am Pacific time')
  })

  xit('returns correct values for apiToDate()', () => {
    // FUTURE
  })

  it('returns correct values for apiToPacificDateTime()', () => {
    expect(vm.apiToPacificDateTime('2021-01-01T00:00:00+00:00')).toBe('December 31, 2020 at 4:00 pm Pacific time') // PST
    expect(vm.apiToPacificDateTime('2021-07-01T00:00:00+00:00')).toBe('June 30, 2021 at 5:00 pm Pacific time') // PDT
  })

  it('returns correct values for dateToApi()', () => {
    // verify that GMT/UTC is correctly converted to API UTC format
    expect(vm.dateToApi(new Date('2021-01-01 06:00:00 GMT'))).toBe('2021-01-01T06:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-01-01 08:00:00 GMT'))).toBe('2021-01-01T08:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 06:00:00 GMT'))).toBe('2021-07-01T06:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 07:00:00 GMT'))).toBe('2021-07-01T07:00:00.000+00:00')

    // verify that Pacific is correctly converted to API UTC format
    expect(vm.dateToApi(new Date('2021-01-01 00:00:00 PST'))).toBe('2021-01-01T08:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-01-01 23:59:59 PST'))).toBe('2021-01-02T07:59:59.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 00:00:00 PDT'))).toBe('2021-07-01T07:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 23:59:59 PDT'))).toBe('2021-07-02T06:59:59.000+00:00')

    // verify that Eastern is correctly converted to API UTC format
    expect(vm.dateToApi(new Date('2021-01-01 02:00:00 EST'))).toBe('2021-01-01T07:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-01-01 03:00:00 EST'))).toBe('2021-01-01T08:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 02:00:00 EDT'))).toBe('2021-07-01T06:00:00.000+00:00')
    expect(vm.dateToApi(new Date('2021-07-01 03:00:00 EDT'))).toBe('2021-07-01T07:00:00.000+00:00')
  })
})
