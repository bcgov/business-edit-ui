import { getVuexStore } from '@/store'
const store = getVuexStore()

xdescribe('Get and set store transactions', () => {
  it('get nested store attribute by path and id', () => {
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState', id: 'valid' }))
      .toBe(true)
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState', id: 'certifiedBy' }))
      .toEqual('Some certifier')
  })

  it('get nested store attribute by path only', () => {
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState.valid' }))
      .toBe(true)
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState.certifiedBy' }))
      .toEqual('Some certifier')
  })

  it('get nested store attribute array', () => {
    store.state.stateModel.certifyState = ['some value']
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState' }))
      .toEqual(['some value'])
  })

  it('update nested store attribute by path, id and value', () => {
    store.state.stateModel.certifyState.valid = false
    store.commit('setNestedAttribute', { path: 'stateModel.certifyState', id: 'valid', value: true })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState.valid' }))
      .toBe(true)
  })

  it('update nested store attribute by path and value only -- no id', () => {
    store.state.stateModel.certifyState.valid = false
    store.commit('setNestedAttribute', { path: 'stateModel.certifyState.valid', value: true })
    expect(store.getters.getNestedAttribute({ path: 'stateModel.certifyState.valid' }))
      .toBe(true)
  })
})
