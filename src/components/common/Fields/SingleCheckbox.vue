<template>
  <v-checkbox v-model="attribute"
              :id="id"
              :value="item.value"
              :label="item.label" />
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import FieldMixin from "@/mixins/field-mixin";

export default {
  name: 'SingleCheckbox',
  mixins: [FieldMixin],
  props: {
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
        return this.getNestedAttribute({path: this.storeLocation, id: this.id})
      },
      set (value) {
        const payload = {
          path: this.storeLocation,
          id: this.id,
          value: value
        }
        // value is true when the checkbox is selected
        if (value) {
          return this.addItemToCheckBoxList(payload)
        } else {
          return this.deleteItemFromCheckBoxList(payload)
        }
      }
    }
  },
  methods: {
    ...mapActions(['addItemToCheckBoxList', 'deleteItemFromCheckBoxList'])
  }
}
</script>
