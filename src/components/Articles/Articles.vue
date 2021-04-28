<template>
  <v-card flat id="articles">
    <div class="define-article-header">
      <v-icon color="app-dk-blue">mdi-handshake</v-icon>
      <label class="define-article-title">Articles</label>
    </div>

    <div
      class="section-container"
      v-if="getBusinessInformation.hasRestrictions"
      :class="{'invalid-section': invalidCompanyProvisions}">
      <company-provisions
        class="sub-section"
        :provisionsRemoved="getProvisionsRemoved"
        @companyProvisionsChanged="setProvisionsRemoved($event)"
        @haveChanges="emitHaveChanges($event)"
        @onEditingCompanyProvisions="setEditingCompanyProvisions($event)"
      />
    </div>

    <div
      class="section-container"
      :class="{'invalid-section': invalidResolutionDates}">
      <resolution-dates
        :addedDates="getNewResolutionDates"
        :previousDates="getPreviousResolutionDates"
        :isEditMode="true"
        :hasRightsOrRestrictions="getHasRightsOrRestrictions"
        @addRemoveDate="setResolutionDates($event)"
        @onAddingResolutionDate="setIsAddingResolutionDate($event)"
      />
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
  // Whether components have changes
  private companyProvisionsChanges: boolean

  private isEditingCompanyProvisions = false
  private isAddingResolutionDate = false

  // Global getters
  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getNewResolutionDates!: string []
  @Getter getProvisionsRemoved!: boolean
  @Getter getPreviousResolutionDates!: string[]
  @Getter getHasRightsOrRestrictions!: boolean
  @Getter getIsResolutionDatesValid!: boolean
  @Getter getIsCompanyProvisionsValid!: boolean
  @Getter getComponentValidate!: boolean
  @Getter getValidComponentFlags!: boolean

  // Global actions
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  emitHaveChanges (haveChanges: boolean): void {}

  setEditingCompanyProvisions (editing: boolean) {
    this.isEditingCompanyProvisions = editing
    this.setValidComponent({ key: 'isValidCompanyProvisions', value: !editing })
  }

  setIsAddingResolutionDate (addingResolutionDate: boolean) {
    this.isAddingResolutionDate = addingResolutionDate
  }

  private get invalidCompanyProvisions (): boolean {
    return this.getComponentValidate && this.isEditingCompanyProvisions
  }

  private get invalidResolutionDates (): boolean {
    return this.getComponentValidate && (this.isAddingResolutionDate || !this.getIsResolutionDatesValid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.define-article-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-article-title {
  padding-left: 0.5rem;
}
</style>
