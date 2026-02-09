<template>
  <div id="share-structures">
    <ResolutionDateDialog
      attach="#share-structures"
      :dialog="showResolutionDateDialog"
      @emitClose="showResolutionDateDialog = false"
    />

    <ShareStructureShared
      :isEditMode="isEditMode"
      :shareClasses="getShareClasses"
      :originalShareStructure="originalShareStructure"
      :resolutionRequired="resolutionsRequired"
      :editLabel="getEditLabel"
      :editedLabel="getEditedLabel"
      :hasRightsOrRestrictions="getHasRightsOrRestrictions"
      :invalidSection="invalidShareSection"
      :invalidMinimumShareClass="!hasMinimumShareClass"
      :disabled="disabled"
      @emitShareClasses="setShareClasses($event)"
      @emitShareStructureChanged="setShareStructureChanged($event)"
      @emitEditingShareStructure="isEditing = $event"
      @emitResolutionPrompt="showResolutionDateDialog = $event"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ShareStructure as ShareStructureShared } from '@bcrs-shared-components/share-structure/'
import { ResolutionDateDialog } from '@/dialogs/'
import { CommonMixin } from '@/mixins/'
import { ActionKvIF, EntitySnapshotIF, ShareClassIF, ShareStructureIF, FlagsCompanyInfoIF }
  from '@/interfaces/'
import { useStore } from '@/store/store'
import { Components } from '@/enums/'

@Component({
  components: {
    ShareStructureShared,
    ResolutionDateDialog
  }
})
export default class ShareStructures extends Mixins(CommonMixin) {
  /** Whether this component should be in edit mode or review mode. */
  @Prop({ default: true }) readonly isEditMode!: boolean

  // Store getters
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getDisabledComponents!: Components[]
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) getNewResolutionDates!: string[]
  @Getter(useStore) getHasRightsOrRestrictions!: boolean
  @Getter(useStore) getShareClasses!: ShareClassIF[]
  @Getter(useStore) hasMinimumShareClass!: boolean
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isCorpCorrectionFiling!: boolean

  // Store actions
  @Action(useStore) setCreateShareStructureStepValidity!: (x: boolean) => void
  @Action(useStore) setEditingShareStructure!: (x: boolean) => void
  @Action(useStore) setShareClasses!: (x: ShareClassIF[]) => void
  @Action(useStore) setShareStructureChanged!: (x: boolean) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  // Local propertiues
  isEditing = false
  showResolutionDateDialog = false

  /** Whether share section is invalid, only when prompted by app. */
  get invalidShareSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidShareStructure)
  }

  get originalShareStructure (): ShareStructureIF {
    return this.getEntitySnapshot?.shareStructure
  }

  /** True if changes to share structure rights will require a resolution date. */
  get resolutionsRequired (): boolean {
    return (this.getNewResolutionDates.length === 0) && (this.isAlterationFiling || this.isCorpCorrectionFiling)
  }

  /** Whether this component should be disabled. */
  get disabled (): boolean {
    return (this.getDisabledComponents.includes(Components.SHARE_STRUCTURES))
  }

  /**
   * Keep the store in sync with components state of validity.
   * Run this "immediately" to set initial state.
   */
  @Watch('isEditing', { immediate: true })
  @Watch('hasMinimumShareClass')
  private setShareStructureValidity (): void {
    // Check valid conditions
    const isValid = !this.isEditing && this.hasMinimumShareClass

    this.setEditingShareStructure(this.isEditing)
    this.setValidComponent({ key: 'isValidShareStructure', value: isValid })
    this.setCreateShareStructureStepValidity(isValid)
  }
}
</script>

<style lang="scss" scoped>
// fix hard-coded whitespace inside shared component
// we want the same padding as "section-container py-6"
:deep() {
  .share-info-container,
  .btn-container,
  .share-structure-table {
    padding-left: 1.875rem !important;
    padding-right: 1.875rem !important;
  }

  .v-card.add-share-structure-container {
    padding-left: 0.625rem !important;
    padding-right: 0.625rem !important;
  }

  .form__btns {
    display: flex;

    .v-btn {
      margin: 0;

      + .v-btn {
        margin-left: 0.5rem;
      }

      &.form-primary-btn {
        margin-left: auto;
      }
    }
  }
}
</style>
