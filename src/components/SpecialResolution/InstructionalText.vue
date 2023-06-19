<template>
  <article
    v-if="!isCoopCorrectionFiling"
    class="instructional-text section-container"
  >
    You have made changes that require a
    <v-tooltip
      top
      content-class="top-tooltip"
      transition="fade-transition"
      nudge-right="3"
    >
      <template #activator="{ on, attrs }">
        <span
          v-bind="attrs"
          class="tool-tip-text"
          v-on="on"
        >special resolution</span>
      </template>
      <span class="tool-tip-content">
        Special Resolution -  A decision voted on by the voting members of a Cooperative Association.
      </span>
    </v-tooltip>
    to be submitted. The full text of the special resolution must be entered.
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import { Getter } from 'pinia-class'
import { Component } from 'vue-property-decorator'
import { useStore } from '@/store/store'

@Component({})
export default class InstructionalText extends Vue {
  @Getter(useStore) isCoopCorrectionFiling: boolean
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.tool-tip-text {
   border-bottom: 1px dashed $gray6;
}
</style>
