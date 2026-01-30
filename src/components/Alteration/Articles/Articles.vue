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
        :disabled="disabled"
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
        :originalResolutions="getOriginalResolutions"
        :isEditMode="true"
        :disabled="disabled"
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
import { Components } from '@/enums/'

@Component({
  components: {
    CompanyProvisions,
    ResolutionDates
  }
})
export default class Articles extends Mixins(CommonMixin) {
  private isEditingCompanyProvisions = false
  private isAddingResolutionDate = false

  // Store getters
  @Getter(useStore) areProvisionsRemoved!: boolean
  @Getter(useStore) getBusinessInformation!: BusinessInformationIF
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getDisabledComponents!: Components[]
  @Getter(useStore) getHasRightsOrRestrictions!: boolean
  @Getter(useStore) getIsResolutionDatesValid!: boolean
  @Getter(useStore) getNewResolutionDates!: string[]
  @Getter(useStore) getOriginalResolutions!: ResolutionsIF[]
  @Getter(useStore) isAlterationFiling!: boolean

  // Store actions
  @Action(useStore) setProvisionsRemoved!: (x: boolean) => void
  @Action(useStore) setNewResolutionDates!: (x: string[]) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  /** Whether this component should be disabled. */
  get disabled (): boolean {
    return this.getDisabledComponents.includes(Components.ARTICLES)
  }

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
