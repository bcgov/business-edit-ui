import Vue from 'vue'

export default {

  /** recursive function that gets a nested store attribute when
   * passed the location in the store represented as an array of
   * strings like this:
   * getProp(store, ["location", "in", "the", "store", "attribute"])
   * The requested attribute can be nested multiple levels deep.
   * */
  getProp (store, nestedProperty: Array<string>) {
    const prop = nestedProperty.shift()
    if (!store[prop] || !nestedProperty.length) {
      return store[prop]
    }
    return this.getProp(store[prop], nestedProperty)
  },

  /** recursive function that sets a nested store attribute when
   * passed the location in the store represented as an array of
   * plus the new value to be saved. Like this:
   * setProp(store, ["location", "in", "the", "store", "attribute"], new_value)
   * The requested attribute can be nested multiple levels deep.
   * */
  setProp (store, nestedProperty: Array<string>, value: any) {
    const prop = nestedProperty.shift()
    if (!store[prop]) {
      Vue.set(store, prop, {})
    }
    if (!nestedProperty.length) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        store[prop] = { ...store[prop], ...value }
      } else {
        store[prop] = value
      }
      return
    }
    this.setProp(store[prop], nestedProperty, value)
  },

  deleteProp (store: any, nestedProperty: Array<string>) {
    const prop = nestedProperty.shift()
    if (!store[prop]) {
      return
    }
    if (!nestedProperty.length) {
      Vue.delete(store, prop)
      return
    }
    this.deleteProp(store[prop], nestedProperty)
  }

}
