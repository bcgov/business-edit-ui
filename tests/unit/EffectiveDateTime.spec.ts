import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { EffectiveDateTime } from '@/components/common'

Vue.use(Vuetify)
Vue.use(Vuelidate)
const vuetify = new Vuetify({})

// Store
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<EffectiveDateTime>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

xdescribe('Effective Date Time component', () => {
  let wrapperFactory: any
  const today = new Date()

  const dateTimeDefault = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  }

  const dateTimeValid = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: new Date(today.setDate(today.getDate() + 5)) // *** TODO: this should be string not Date
  }

  const dateTimeInvalid = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: new Date(today.setDate(today.getDate() + 11)) // *** TODO: this should be string not Date
  }

  beforeEach(() => {
    const localVue = createLocalVue()

    wrapperFactory = (propsData) => {
      return mount(EffectiveDateTime, {
        propsData: {
          ...propsData
        },
        localVue,
        store,
        vuetify
      })
    }
  })

  afterEach(async () => {
  })

  it('confirms no default Date-Time Selection', () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    // Reference the Radios
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    // Verify radios are false
    expect(radioIsImmediate.attributes('aria-checked')).toBe('false')
    expect(radioIsFutureEffective.attributes('aria-checked')).toBe('false')
  })

  it('confirms the selector fields are disabled if future effective is NOT selected', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)

    await radioIsImmediate.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe('disabled')
  })

  it('confirms the selector fields are NOT disabled if future effective is selected', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')
    wrapper.vm.dateText = new Date().toISOString().split('T')[0]

    await Vue.nextTick()

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeUndefined() // *** BROKEN
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBeUndefined()
  })

  it('confirms the selector fields are toggled to disabled if Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')
    wrapper.vm.dateText = new Date().toISOString().split('T')[0]

    await Vue.nextTick()

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeUndefined() // *** BROKEN
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBeUndefined()

    await radioIsImmediate.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe('disabled')
  })

  it('emits a valid state when the Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    await radioIsImmediate.trigger('click')

    const validEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is true
    expect(validEvent).toEqual(true)
  })

  it('emits an invalid state when the Future Effective is selected and no date is selected', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // Verify the Valid emit event is true
    expect(wrapper.emitted().valid).toEqual([[false]]) // *** BROKEN
  })

  it('emits a valid state when the Future Effective is selected and DateTime is valid', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeValid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const validEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(validEvent).toEqual(true)
  })

  it('emits a invalid state when the Future Effective is selected and DateTime is invalid', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeInvalid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const invalidEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(invalidEvent).toEqual(false) // *** BROKEN
  })

  it('displays an invalid Date Alert when the Date is invalid', async () => {
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeInvalid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const minDate = wrapper.vm.formatDateString(wrapper.vm.minDate)
    const maxDate = wrapper.vm.formatDateString((wrapper.vm.maxDate))

    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
      .toContain(`Date must be between ${minDate} and ${maxDate}`) // *** BROKEN

    const invalidEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(invalidEvent).toEqual(false)
  })

  it('displays an invalid Time Alert when the time selected is not AT LEAST 2 minutes ahead', async () => {
    dateTimeDefault.effectiveDate = new Date() // *** TODO: this should be string not Date
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const minTime = wrapper.vm.minTime()

    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
      .toContain(`The time must be at least ${minTime} for the selected date`) // *** BROKEN

    const invalidEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(invalidEvent).toEqual(false)
  })

  it('displays an invalid Time Alert when time selected is past current time on the 10th day', async () => {
    // *** TODO: this should be string not Date:
    dateTimeDefault.effectiveDate = new Date(today.setDate(today.getDate() + 10))
    const wrapper = wrapperFactory({ EffectiveDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const maxTime = wrapper.vm.maxTime()

    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
      .toContain(`Time The time can't be greater than ${maxTime} for the selected date`) // *** BROKEN

    const invalidEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(invalidEvent).toEqual(false)
  })
})
