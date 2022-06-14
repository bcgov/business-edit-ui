<template>
  <div id="share-structures">
    <ResolutionDateDialog
      attach="#share-structures"
      :dialog="toggleResolutionDateDialog"
      @emitClose="toggleResolutionDateDialog = false"
    />

    <ShareStructureShared
      :isEditMode="isEditMode"
      :isCorrection="isCorrectionFiling"
      :incorporationApplication="getCorrectedFiling"
      :shareClasses="getShareClasses"
      :originalShareStructure="originalShareStructure"
      :resolutionRequired="resolutionsRequired"
      :editLabel="editLabel"
      :editedLabel="editedLabel"
      :hasRightsOrRestrictions="getHasRightsOrRestrictions"
      :invalidSection="invalidShareSection"
      :invalidMinimumShareClass="invalidMinimumShareClass"
      @emitShareClasses="setShareClasses($event)"
      @emitShareStructureChanged="setShareStructureChanged($event)"
      @emitEditingShareStructure="setShareStructureValidity($event)"
      @emitResolutionPrompt="toggleResolutionDateDialog = $event"
    />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { ShareStructure as ShareStructureShared } from '@bcrs-shared-components/share-structure/'
import { ResolutionDateDialog } from '@/dialogs/'
import { CommonMixin } from '@/mixins/'

import { ActionBindingIF, EntitySnapshotIF, CorrectedFilingIF, ShareClassIF, ShareStructureIF,
  FlagsCompanyInfoIF } from '@/interfaces/'

@Component({
  components: {
    ShareStructureShared,
    ResolutionDateDialog
  }
})
export default class ShareStructures extends Mixins(CommonMixin) {
  /** Whether this component should be in edit mode or review mode. */
  @Prop({ default: true })
  readonly isEditMode: boolean

  // Global getters
  @Getter getComponentValidate!: boolean
  @Getter getNewResolutionDates!: string []
  @Getter getCorrectedFiling!: CorrectedFilingIF
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getHasRightsOrRestrictions!: boolean
  @Getter getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter invalidMinimumShareClass!: boolean

  // Global actions
  @Action setShareClasses!: ActionBindingIF
  @Action setShareStructureChanged!: ActionBindingIF
  @Action setEditingShareStructure!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // Local property
  toggleResolutionDateDialog = false

  /** Check validity state, only when prompted by app. */
  get invalidShareSection (): boolean {
    return this.getComponentValidate && !this.getFlagsCompanyInfo.isValidShareStructure
  }

  get originalShareStructure (): ShareStructureIF {
    return this.getEntitySnapshot?.shareStructure
  }

  /** Is true if changes to share structure rights will require a resolution date. */
  get resolutionsRequired (): boolean {
    return (this.getNewResolutionDates.length === 0) && this.isAlterationFiling
  }

  /** Keep the store in sync with components state of validity. */
  @Watch('invalidMinimumShareClass')
  private setShareStructureValidity (isEditing: boolean): void {
    // Check valid conditions
    const isValid = !isEditing && !this.invalidMinimumShareClass

    this.setEditingShareStructure(isEditing)
    this.setValidComponent({ key: 'isValidShareStructure', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
// fix hard-coded whitespace inside shared component
// we want the same padding as "section-container py-6"
::v-deep {
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
}
</style>
