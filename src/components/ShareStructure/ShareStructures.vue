<template>
  <div id="share-structures">

    <resolution-date-dialog
      attach="#share-structures"
      :dialog="toggleResolutionDateDialog"
      @emitClose="toggleResolutionDateDialog = false"
    />

    <share-structure
      :isEditMode="isEditMode"
      :isCorrection="isCorrectionView"
      :incorporationApplication="getOriginalIA"
      :shareClasses="getShareClasses"
      :originalShareStructure="originalShareStructure"
      :resolutionRequired="resolutionsRequired"
      :editLabel="editLabel"
      :editedLabel="editedLabel"
      @emitShareClasses="setShareClasses($event)"
      @emitShareStructureChanged="setShareStructureChanged($event)"
      @emitEditingShareStructure="setEditingShareStructure($event)"
      @emitResolutionPrompt="toggleResolutionDateDialog = $event"
    />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { ShareStructure } from '@bcrs-shared-components/share-structure'
import { ResolutionDateDialog } from '@/components/dialogs'
import { CommonMixin } from '@/mixins'

import {
  ActionBindingIF,
  BusinessSnapshotIF,
  IncorporationFilingIF,
  ShareClassIF,
  ShareStructureIF
} from '@/interfaces'

@Component({
  components: {
    ShareStructure,
    ResolutionDateDialog
  }
})
export default class ShareStructures extends Mixins(CommonMixin) {
  /** Whether this component should be in edit mode or review mode. */
  @Prop({ default: true })
  readonly isEditMode: boolean

  // Global getters
  @Getter getNewResolutionDates!: string []
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getOriginalSnapshot!: BusinessSnapshotIF

  // Global actions
  @Action setShareClasses!: ActionBindingIF
  @Action setShareStructureChanged!: ActionBindingIF
  @Action setEditingShareStructure!: ActionBindingIF

  // Local property
  toggleResolutionDateDialog = false

  get originalShareStructure (): ShareStructureIF {
    return this.getOriginalSnapshot?.shareStructure
  }

  /** Is true if changes to share structure rights will require a resolution date. */
  get resolutionsRequired (): boolean {
    return (this.getNewResolutionDates.length === 0) && this.isAlterationView
  }
}
</script>
