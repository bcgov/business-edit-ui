<template>
  <div class="help-section-toggle">
    <div
      class="info-text help-toggle pt-2"
      @click="isHelpVisible = !isHelpVisible"
    >
      <v-icon
        class="pr-2 mt-n2"
        color="primary"
      >
        mdi-help-circle-outline
      </v-icon>
      <span v-if="!isHelpVisible">Learn More</span>
      <span v-else>Hide Learn More</span>
    </div>

    <slot
      v-if="isHelpVisible"
      name="content"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({})
export default class HelpSectionToggle extends Vue {
    isHelpVisible = false
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.help-toggle {
  color: $app-blue;

  :hover {
    cursor: pointer;
  }
}
</style>
