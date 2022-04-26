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
      :incorporationApplication="getOriginalIA"
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
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ShareStructureShared } from '@/components/shared'
import { ResolutionDateDialog } from '@/dialogs/'
import { CommonMixin } from '@/mixins/'
import { ActionBindingIF, EntitySnapshotIF, IncorporationFilingIF, ShareClassIF, ShareStructureIF,
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
  @Getter getOriginalIA!: IncorporationFilingIF
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
