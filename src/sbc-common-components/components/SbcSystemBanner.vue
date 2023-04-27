<template>
  <!-- NB: set icon="null" to prevent v-alert default icon + vue complains if set to "" -->
  <v-alert
    v-model="show"
    class="py-2"
    :type="type"
    icon="null"
    :closable="dismissible"
  >
    <div class="px-3">
      <v-icon
        v-if="icon !== ''"
        class="mr-2"
        size="34"
      >
        {{ icon }}
      </v-icon>
      <span v-html="message" />
    </div>
  </v-alert>
</template>

<script lang="ts">
// External
import { computed, defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'SbcSystemBanner',
  props: {
    setDismissible: { default: false },
    setIcon: { default: 'mdi-information' }, // See https://material.io/resources/icons/?style=baseline for accepted values
    setMessage: { default: '' },
    setShow: { default: false },
    setType: { default: 'warning' }
  },
  setup (props) {
    const state = reactive({
      dismissible: computed(() => { return props.setDismissible }),
      icon: computed(() => { return props.setIcon }),
      message: computed(() => { return props.setMessage }),
      show: computed(() => { return props.setShow }),
      type: computed(() => { return props.setType as 'info' | 'warning' | 'error' | 'success' })
    })
    return {
      ...state
    }
  }
})
</script>

<style lang="scss" scoped>
.v-alert {
  border-radius: 0;
  padding: 0;
  max-height: 48px;
}
:deep(.v-alert__prepend) {
  height: 0;
  width: 0;
  margin-inline-end: 0;
}

.v-alert :deep(.v-alert__wrapper) {
  margin: 0;
  overflow: hidden;
}

:deep(.v-alert__content) {
  max-width: 1360px;  // should match sbc header / breadcrumb max widths
  width: 100%;
}
</style>
