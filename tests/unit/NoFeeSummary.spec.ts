// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { NoFeeSummary } from '@/components/Summary'

Vue.use(Vuetify)
const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('NoFeeSummary', () => {
  let wrapper: any
  let store: any = getVuexStore()

  beforeEach(() => {
    store.state.stateModel.summaryMode = true

    wrapper = mount(NoFeeSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the NoFeeSummary Component', async () => {
    expect(wrapper.find(NoFeeSummary).exists()).toBe(true)
  })

  it('hides the NoFeeSummary Component when NOT in summaryMode', async () => {
    store.state.stateModel.summaryMode = false
    await Vue.nextTick()

    expect(wrapper.find('#no-fee-summary').exists()).toBe(false)
  })

  // Future tests to included verifying changes made to NO FEE related alterations.
  // Currently just displays placeholder data.
})
