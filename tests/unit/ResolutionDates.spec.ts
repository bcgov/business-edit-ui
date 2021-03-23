import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { ResolutionDates } from '@/components/Articles'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

const arrayOfDates = [
  '2020-05-23',
  '2020-06-01'
]

describe('Resolution Dates component - edit mode', () => {
  let wrapperFactory: any

  beforeAll(() => {
    wrapperFactory = (propsData: any) => {
      return mount(ResolutionDates, { propsData: { ...propsData, isEditMode: true }, vuetify })
    }
  })

  it('displays correctly with no data', () => {
    const wrapper = wrapperFactory()

    // verify there is just 1 row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 3 columns
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(3)

    // verify column text
    expect(cols.at(0).text()).toContain('Resolution or')
    expect(cols.at(0).text()).toContain('Court Order Dates')
    expect(cols.at(1).text()).toContain('Dates of resolutions or court orders to alter the')

    // verify add button
    const button = cols.at(2).find('.add-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Add')

    wrapper.destroy()
  })

  it('displays previous dates', async () => {
    const wrapper = wrapperFactory({ previousDates: arrayOfDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify Show button
    const button = cols.at(1).find('.show-previous-dates-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    // click the button
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify Hide button
    expect(button.text()).toBe('Hide previous resolutions or court order dates')

    // verify previous dates
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('2020-05-23')
    expect(items.at(1).text()).toBe('2020-06-01')

    // click the button again
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify that it went back to the original text
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    wrapper.destroy()
  })

  it('displays added dates', () => {
    const wrapper = wrapperFactory({ addedDates: arrayOfDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify added dates and buttons
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toContain('2020-05-23')
    expect(items.at(1).text()).toContain('2020-06-01')

    // verify Remove buttons
    let button = items.at(0).find('.remove-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Remove')
    button = items.at(1).find('.remove-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Remove')

    wrapper.destroy()
  })

  it('can add a date', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm

    // verify there is just 1 row
    let rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // click the Add button
    await vm.$el.querySelector('.add-btn').click()

    // verify there are now 2 rows
    rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify blurb
    const cols = rows.at(0).findAll('.col')
    expect(cols.at(1).text()).toContain('Indicate the date of the resolution or court order')

    // verify date picker form
    expect(wrapper.find('.date-picker-form')).toBeDefined()

    // inject a date
    vm.onDateEmitted('2021-03-17')

    // verify new date is emitted
    expect(wrapper.emitted('addRemoveDate').pop()[0]).toEqual(['2021-03-17'])

    wrapper.destroy()
  })

  it('can delete a date', async () => {
    const wrapper = wrapperFactory({ addedDates: ['2021-03-17'] })
    const vm = wrapper.vm

    // verify there is a second row
    let rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // click the Remove button
    await vm.$el.querySelector('.remove-btn').click()

    // verify no date is emitted
    expect(wrapper.emitted('addRemoveDate').pop()[0]).toEqual([])

    wrapper.destroy()
  })
})

describe('Resolution Dates component - review mode', () => {
  let wrapperFactory: any

  beforeAll(() => {
    wrapperFactory = (propsData: any) => {
      return mount(ResolutionDates, { propsData: { ...propsData, isEditMode: false }, vuetify })
    }
  })

  it('displays correctly with no data', () => {
    const wrapper = wrapperFactory()

    // verify there is just 1 row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 2 columns (ie, no Add button column)
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(2)

    // verify column text
    expect(cols.at(0).text()).toContain('Resolution or')
    expect(cols.at(0).text()).toContain('Court Order Dates')
    expect(cols.at(1).text()).toContain('Dates of resolutions or court orders to alter the')

    wrapper.destroy()
  })

  it('displays previous dates', async () => {
    const wrapper = wrapperFactory({ previousDates: arrayOfDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify Show button
    const button = cols.at(1).find('.show-previous-dates-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    // click the button
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify Hide button
    expect(button.text()).toBe('Hide previous resolutions or court order dates')

    // verify previous dates
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('2020-05-23')
    expect(items.at(1).text()).toBe('2020-06-01')

    // click the button again
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify that it went back to the original text
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    wrapper.destroy()
  })

  it('displays added dates', () => {
    const wrapper = wrapperFactory({ addedDates: arrayOfDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify added dates and buttons
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toContain('2020-05-23')
    expect(items.at(1).text()).toContain('2020-06-01')

    // verify no Remove buttons
    expect(items.at(0).find('.remove-btn').exists()).toBe(false)
    expect(items.at(1).find('.remove-btn').exists()).toBe(false)

    wrapper.destroy()
  })
})
