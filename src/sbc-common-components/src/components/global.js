import Vue from 'vue'

// https://github.com/talk-to/vue-components
const vueComponents = require.context('.', false, /[\w-]+.vue$/)

vueComponents.keys().forEach((filename) => {
  // Get Component Config
  const componentConfig = vueComponents(filename)

  // Get PascalCase name of component
  const componentName = filename.replace(/^\.\//, '').replace(/\.\w+$/, '')

  Vue.component(componentName, componentConfig.default || componentConfig)
})
