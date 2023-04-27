import Vue from 'vue'
import Vuetify, {
  VAlert,
  VContainer,
  VIcon,
  VBtn
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VAlert,
    VContainer,
    VIcon,
    VBtn
  }
})

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        grey: {
          base: '#adb5bd',
          lighten5: '#f8f9fa',
          lighten4: '#f1f3f5',
          lighten3: '#e9ecef',
          lighten2: '#dee2e6',
          lighten1: '#ced4da',
          darken1: '#868e96',
          darken2: '#495057',
          darken3: '#343a40',
          darken4: '#212529'
        },
        bcgovblue: {
          base: '#003366',
          lighten5: '#e0e7ed',
          lighten4: '#b3c2d1',
          lighten3: '#8099b3',
          lighten2: '#4d7094',
          lighten1: '#26527d',
          darken1: '#1e1e1f',
          darken2: '#002753',
          darken3: '#002049',
          darken4: '#001438'
        },
        bcgovblue2: {
          base: '#38598A'
        },
        bcgovblueLink: {
          base: '#1A5A96'
        },
        bcgovgold: {
          base: '#fcba19'
        }
      }

    }
  }
})
