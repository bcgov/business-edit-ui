<template>
  <div id="share-structures">

    <resolution-date-dialog
      attach="#share-structures"
      :dialog="toggleResolutionDateDialog"
      @emitClose="toggleResolutionDateDialog = false"
    />

    <share-structure
      :is-edit-mode="isEditMode"
      :isCorrection="isCorrectionView()"
      :incorporation-application="getOriginalIA"
      :share-classes="getShareClasses"
      :business-snapshot="getOriginalSnapshot"
      :resolution-required="resolutionsRequired"
      :edit-label="editLabel"
      :edited-label="editedLabel"
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
  ShareClassIF
} from '@/interfaces'

@Component({
  components: {
    ShareStructure,
    ResolutionDateDialog
  }
})
export default class ShareStructures extends Mixins(CommonMixin) {
  /** Edit Mode */
  @Prop({ default: true })
  readonly isEditMode!: string

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

  /** Is true if changes to share structure rights will require a resolution date. */
  get resolutionsRequired (): boolean {
    return this.getNewResolutionDates.length === 0 && this.isAlterationView()
  }
}
</script>
