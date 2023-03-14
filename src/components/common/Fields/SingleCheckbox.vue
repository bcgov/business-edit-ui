<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SingleCheckbox',
  props: {
    path: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    item: {
      value: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      }
    }
  },
  computed: {
    ...mapGetters(['getNestedAttribute']),
    attribute: {
      get () {
        return this.getNestedAttribute({ path: this.path, id: this.id })
      },
      set (value) {
        // value is true when the checkbox is selected; false when un-selected
        if (value) {
          return this.addItemToCheckBoxList(this.path, this.id)
        } else {
          return this.deleteItemFromCheckBoxList(this.path, this.id)
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setNestedAttribute']),

    /** Adds item to a list of items if it doesn't already exist.
     * Like: addItemToCheckBoxList({"id": "value_to_add", "path": "location.in.the.store", "value": "<ignored>"})
     * */
    addItemToCheckBoxList (path, id) {
      let newPayload = {
        id: null,
        path: path,
        value: [id]
      }
      let currentItems = this.getNestedAttribute({ path: path })
      if (currentItems && !(id in currentItems)) {
        currentItems.push(id)
        newPayload = {
          id: null,
          path: path,
          value: currentItems
        }
      }
      this.setNestedAttribute(newPayload)
    },

    /** Removes item from a list of items if it exists
     * Like: deleteItemFromCheckBoxList({"id": "value_to_add", "path": "location.in.the.store", "value": "<ignored>"})
     * */
    deleteItemFromCheckBoxList (path, id) {
      let currentItems = this.getNestedAttribute({ path: path })
      if (currentItems && currentItems.includes(id)) {
        const indexOfItem = currentItems.indexOf(id)
        currentItems.splice(indexOfItem, 1)
        const newPayload = {
          id: null,
          path: path,
          value: currentItems
        }
        this.setNestedAttribute(newPayload)
      }
    }
  }
}
</script>

<template>
  <v-checkbox v-model="attribute"
              :id="id"
              :value="item.value"
              :label="item.label" />
</template>
