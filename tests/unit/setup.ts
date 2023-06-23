/* This file is to provide the correct setup for the Vue instance.
 * It can save people time when writing tests, as they wont need to figure out
 * why some of the errors are showing up due to Vue not having the plugins it needs.
 * See src/main.ts.
 */
import VSanitize from 'v-sanitize'
import Vuelidate from 'vuelidate'
import Vue from 'vue'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import Vuetify from 'vuetify'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'

Vue.use(Vuetify)
Vue.use(Affix)
// needed for address component or Completing Party
Vue.use(Vuelidate)
Vue.use(Vue2Filters)
Vue.use(VSanitize)

const vuetify = new Vuetify({})

// Needed for special resolution editor
// For Vue 3: remove - consult assets team for a replacement.
Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi'
})
