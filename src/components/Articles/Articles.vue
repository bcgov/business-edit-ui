<template>
  <v-card flat id="articles">
    <div class="define-article-header">
      <v-icon color="app-dk-blue">mdi-handshake</v-icon>
      <label class="define-article-title">Articles</label>
    </div>

    <div
      class="section-container"
      v-if="getBusinessInformation.hasRestrictions"
      >
      <company-provisions
        class="sub-section"
        :provisionsRemoved="getProvisionsRemoved"
        @companyProvisionsChanged="setProvisionsRemoved($event)"
        @haveChanges="emitHaveChanges($event)"/>
    </div>

    <div class="section-container">
      <resolution-dates
        :added-dates="getNewResolutionDates"
        :previous-dates="getPreviousResolutionDates"
        @addRemoveDate="setResolutionDates($event)"/>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
// Components
import CompanyProvisions from './CompanyProvisions.vue'
import ResolutionDates from './ResolutionDates.vue'
// Mixins
import { CommonMixin } from '@/mixins'
// Interfaces
import { ActionBindingIF, BusinessInformationIF } from '@/interfaces'

@Component({
  components: {
    CompanyProvisions,
    ResolutionDates
  }
})
export default class Articles extends Mixins(CommonMixin) {
  // whether components have changes
  private companyProvisionsChanges: boolean

  // Global Getters
  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getNewResolutionDates!: string []
  @Getter getProvisionsRemoved!: boolean
  @Getter getPreviousResolutionDates!: string[]

  // Global Actions
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.25rem 1rem;

  .sub-section {
    margin-top: 1.5rem;
  }
}

.define-article-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-article-title {
  padding-left: 0.5rem;
}
</style>
