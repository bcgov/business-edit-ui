<template>
  <v-card flat id="your-company">
    <div class="your-company-header">
      <v-icon class="header-icon">mdi-domain</v-icon>
      <label class="your-company-title">Your {{ getResource.entityReference }}</label>
    </div>

    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { ResourceIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({})
export default class YourCompanyWrapper extends Vue {
  // store getters
  @Getter(useStore) getResource!: ResourceIF
}
</script>

<style lang="scss">
@import '@/assets/styles/theme.scss';

.your-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 1.25rem 1.875rem;
}

.your-company-title {
  padding-left: 0.5rem;
}

// add divider between sections
#your-company > div:not(:nth-of-type(2)):before {
  content: '-';
  color: transparent;
  display: block;
  border-top: 1px solid $gray3;
  margin-top: -1.25rem; // subtract top padding
}

// add extra whitespace to bottom section
#your-company > div:last-of-type {
  padding-bottom: 1.5rem;
}
</style>
