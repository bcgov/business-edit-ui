<template>
  <div id="share-structures">
    <ResolutionDateDialog
      attach="#share-structures"
      :dialog="showResolutionDateDialog"
      @emitClose="showResolutionDateDialog = false"
    />

    <div
      v-if="isEditMode && hasOtherCurrency"
      id="other-currency-notice"
      class="d-flex align-start px-5 pt-5 pb-3"
    >
      <v-icon class="mr-2">
        mdi-information-outline
      </v-icon>
      <p class="ma-0">
        <strong>Important:</strong> Existing share classes may continue to use &ldquo;Other&rdquo;
        but this option is not supported for new share classes.
      </p>
    </div>

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
import ShareStructureShared from './ShareStructure.vue'
import { ResolutionDateDialog } from '@/dialogs/'
import { CommonMixin } from '@/mixins/'
import { ActionKvIF, EntitySnapshotIF, ShareClassIF, ShareStructureIF, FlagsCompanyInfoIF }
  from '@/interfaces/'
import { useStore } from '@/store/store'
import { OTHER_CURRENCY } from '@/constants'
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
   * True if any share class or nested series in the current structure carries the
   * legacy "OTHER" currency (migrated from COLIN). Used to surface a section-level
   * notice that OTHER is grandfathered but not supported for new share classes.
   */
  get hasOtherCurrency (): boolean {
    return (this.getShareClasses || []).some(c =>
      c.currency === OTHER_CURRENCY ||
      (c.series || []).some(s => s.currency === OTHER_CURRENCY)
    )
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
// fix styling inside component
:deep() {
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
