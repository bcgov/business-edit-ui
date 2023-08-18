<template>
  <v-card
    id="articles"
    flat
  >
    <div class="articles-header pa-5">
      <v-icon color="appDkBlue">
        mdi-handshake
      </v-icon>
      <label class="articles-title pl-2">Articles</label>
    </div>

    <div
      v-if="isAlterationFiling && getBusinessInformation.hasRestrictions"
      class="section-container"
      :class="{'invalid-section': invalidCompanyProvisions}"
    >
      <CompanyProvisions
        :provisionsRemoved="areProvisionsRemoved"
        @isChanged="setProvisionsRemoved($event)"
        @haveChanges="emitHaveChanges($event)"
        @isEditing="setEditingCompanyProvisions($event)"
      />
    </div>

    <div
      class="section-container"
      :class="{'invalid-section': invalidResolutionDates}"
    >
      <ResolutionDates
        :addedDates="getNewResolutionDates"
        :previousDates="getOriginalResolutions"
        :isEditMode="true"
        :hasRightsOrRestrictions="getHasRightsOrRestrictions"
        @addRemoveDate="setNewResolutionDates($event)"
        @isEditing="setIsAddingResolutionDate($event)"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import CompanyProvisions from './CompanyProvisions.vue'
import ResolutionDates from './ResolutionDates.vue'
import { CommonMixin } from '@/mixins/'
import { ActionKvIF, BusinessInformationIF, ResolutionsIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({
  components: {
    CompanyProvisions,
    ResolutionDates
  }
})
export default class Articles extends Mixins(CommonMixin) {
  private isEditingCompanyProvisions = false
  private isAddingResolutionDate = false

  // Global getters
  @Getter(useStore) getBusinessInformation!: BusinessInformationIF
  @Getter(useStore) getNewResolutionDates!: string[]
  @Getter(useStore) areProvisionsRemoved!: boolean
  @Getter(useStore) getOriginalResolutions!: ResolutionsIF[]
  @Getter(useStore) getHasRightsOrRestrictions!: boolean
  @Getter(useStore) getIsResolutionDatesValid!: boolean
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) isAlterationFiling!: boolean

  // Global actions
  @Action(useStore) setProvisionsRemoved!: (x: boolean) => void
  @Action(useStore) setNewResolutionDates!: (x: string[]) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitHaveChanges (haveChanges: boolean): void {}

  setEditingCompanyProvisions (editing: boolean) {
    this.isEditingCompanyProvisions = editing
    this.setValidComponent({ key: 'isValidCompanyProvisions', value: !editing })
  }

  setIsAddingResolutionDate (addingResolutionDate: boolean) {
    this.isAddingResolutionDate = addingResolutionDate
  }

  get invalidCompanyProvisions (): boolean {
    return this.getComponentValidate && this.isEditingCompanyProvisions
  }

  get invalidResolutionDates (): boolean {
    return this.getComponentValidate && (this.isAddingResolutionDate || !this.getIsResolutionDatesValid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.articles-header {
  display: flex;
  background-color: $BCgovBlue5O;
}
</style>
