import {mapGetters, mapMutations} from 'vuex'

export default {
  props: {
    storeLocation: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['getNestedAttribute', 'isNestedAttributeExist'])
  },
  methods: {
    ...mapMutations(['setNestedAttribute'])
  }
}
