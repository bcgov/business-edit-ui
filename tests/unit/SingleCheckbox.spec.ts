import { getVuexStore } from '@/store'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import SingleCheckbox from '@/components/common/Fields/SingleCheckbox.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})
const store = getVuexStore()

xdescribe('Test SingleCheckbox component', () => {
  store.state.stateModel.relationships = []
  const localVue = createLocalVue()
  function createComponent (): Wrapper<any> {
    return mount(SingleCheckbox, {
      localVue,
      store,
      vuetify,
      propsData: {
        id: 'some_attribute',
        path: 'stateModel.relationships',
        item: {
          label: 'test',
          value: 'test'
        }
      }
    })
  }
  const wrapper = createComponent()

  it('add checkbox item to list when list is empty', () => {
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual([])
    wrapper.find('#some_attribute').setChecked(true)
    Vue.nextTick(() => {
      expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
        .toEqual(['some_attribute'])
    })
  })

  it('add checkbox item to list is successful when list destination does not exist', () => {
    store.state.stateModel = null
    store.dispatch('addItemToCheckBoxList', { path: 'stateModel.relationships', id: 'legal_heir', value: true })
    // Note, new attribute is added
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual(['legal_heir'])
  })

  it('add checkbox item to list is successful when list already has an item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('addItemToCheckBoxList', { path: 'stateModel.relationships', id: 'legal_heir', value: true })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual(['existing item', 'legal_heir'])
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toHaveLength(2)
  })

  it('delete checkbox item is successful when list has one item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('deleteItemFromCheckBoxList', {
      path: 'stateModel.relationships',
      id: 'existing item',
      value: false
    })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual([])
  })

  it('delete checkbox item does nothing when list does not contain the item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('deleteItemFromCheckBoxList', { path: 'stateModel.relationships', id: 'other item', value: false })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual(['existing item'])
  })

  it('delete checkbox item makes no changes when list contains zero items', () => {
    store.state.stateModel.relationships = []
    store.dispatch('deleteItemFromCheckBoxList', { path: 'stateModel.relationships', id: 'other item', value: false })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual([])
  })

  it('delete checkbox item does nothing when destination is not a list', () => {
    store.state.stateModel.relationships = null
    store.dispatch('deleteItemFromCheckBoxList', { path: 'stateModel.relationships', id: 'other item', value: false })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.relationships' }))
      .toEqual(null)
  })

  it('calling delete checkbox item does nothing when destination does not exist', () => {
    store.state.stateModel = 'A'
    store.dispatch('deleteItemFromCheckBoxList', { path: 'stateModel.relationships', id: 'other item', value: false })
    expect(store.getters.getNestedAttribute({ path: 'stateModel' }))
      .toEqual('A')
  })
})
