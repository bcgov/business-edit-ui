import { getVuexStore } from '@/store'
const store = getVuexStore()

describe('Get and set store transactions', () => {

  it('get nested store attribute by path and id', () => {
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState', id: 'valid'}))
      .toBe(true)
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState', id: 'certifiedBy'}))
      .toEqual('Some certifier')
  })

  it('get nested store attribute by path only', () => {
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState.valid'}))
      .toBe(true)
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState.certifiedBy'}))
      .toEqual('Some certifier')
  })

  it('get nested store attribute array', () => {
    store.state.stateModel.certifyState = ["some value"]
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState'}))
      .toEqual(["some value"])
  })

  it('update nested store attribute by path, id and value', () => {
    store.state.stateModel.certifyState.valid = false
    store.commit('setNestedAttribute', {path: 'stateModel.certifyState', id: 'valid', value: true})
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState.valid'}))
      .toBe(true)
  })

  it('update nested store attribute by path and value only -- no id', () => {
    store.state.stateModel.certifyState.valid = false
    store.commit('setNestedAttribute', {path: 'stateModel.certifyState.valid', value: true})
    expect(store.getters.getNestedAttribute({path: 'stateModel.certifyState.valid'}))
      .toBe(true)
  })

  it('add checkbox item to list when list is empty', () => {
    store.state.stateModel.relationships = []
    store.dispatch('addItemToCheckBoxList', {path: 'stateModel.relationships', id: 'legal_heir', value: true})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual(['legal_heir'])
  })

  it('add checkbox item to list when list destination does not exist', () => {
    store.state.stateModel = null
    store.dispatch('addItemToCheckBoxList', {path: 'stateModel.relationships', id: 'legal_heir', value: true})
    // Note, new attribute is added
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual(['legal_heir'])
  })

  it('add checkbox item to list when list already has an item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('addItemToCheckBoxList', {path: 'stateModel.relationships', id: 'legal_heir', value: true})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual(['existing item', 'legal_heir'])
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toHaveLength(2)
  })

  it('delete checkbox item when list has one item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('deleteItemFromCheckBoxList', {path: 'stateModel.relationships', id: 'existing item', value: false})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual([])
  })

  it('delete checkbox item does nothing when list does not contain the item', () => {
    store.state.stateModel.relationships = ['existing item']
    store.dispatch('deleteItemFromCheckBoxList', {path: 'stateModel.relationships', id: 'other item', value: false})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual(['existing item'])
  })

  it('delete checkbox item makes no changes when list contains zero items', () => {
    store.state.stateModel.relationships = []
    store.dispatch('deleteItemFromCheckBoxList', {path: 'stateModel.relationships', id: 'other item', value: false})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual([])
  })

  it('delete checkbox item does nothing when destination is not a list', () => {
    store.state.stateModel.relationships = null
    store.dispatch('deleteItemFromCheckBoxList', {path: 'stateModel.relationships', id: 'other item', value: false})
    expect(store.getters.getNestedAttribute({path: 'stateModel.relationships'}))
      .toEqual(null)
  })

  it('calling delete checkbox item does nothing when destination does not exist', () => {
    store.state.stateModel = 'A'
    store.dispatch('deleteItemFromCheckBoxList', {path: 'stateModel.relationships', id: 'other item', value: false})
    expect(store.getters.getNestedAttribute({path: 'stateModel'}))
      .toEqual('A')
  })
})

