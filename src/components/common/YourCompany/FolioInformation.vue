<template>
  <div
    v-if="isPremiumAccount"
    id="folio-information"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <FolioNumberShared
      :initialValue="getFolioNumber"
      :originalValue="originalFolioNumber"
      :editLabel="getEditLabel"
      :editedLabel="editedLabelExtended"
      :hideActions="hideActions"
      :invalidSection="invalidSection"
      @newFolioNumber="onNewFolioNumber($event)"
      @isEditing="isEditingFolioNumber = $event"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF, EntitySnapshotIF, FlagsCompanyInfoIF } from '@/interfaces/'
import { AuthServices } from '@/services/'
import { CommonMixin } from '@/mixins/'
import { FolioNumber as FolioNumberShared } from '@bcrs-shared-components/folio-number/'

import { useStore } from '@/store/store'

@Component({
  components: {
    FolioNumberShared
  }
})
export default class FolioInformation extends Mixins(CommonMixin) {
  // Global getters
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSpecialResolutionFiling!: boolean

  // Global setters
  @Action(useStore) setFolioNumber!: ActionBindingIF
  @Action(useStore) setTransactionalFolioNumber!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  // local properties
  protected isEditingFolioNumber = false

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidFolioInfo)
  }

  /** The original Folio Number. */
  get originalFolioNumber (): string {
    return this.getEntitySnapshot?.authInfo?.folioNumber
  }

  /** Whether to hide the component's actions. */
  get hideActions (): boolean {
    // hide actions in a correction filing
    // hide actions from staff users
    return (this.isCorrectionFiling || this.isRoleStaff)
  }

  /** Helps builds edit label and determine if folio number update should be instant. */
  get isInstantUpdate (): boolean {
    return this.isAlterationFiling || this.isSpecialResolutionFiling
  }

  /** Modifies label for instant update of folio number. */
  get editedLabelExtended (): string {
    return this.isInstantUpdate ? 'Changes Saved' : this.getEditedLabel
  }

  /** On New Folio Number event, updates auth db and store. */
  protected async onNewFolioNumber (folioNumber: string): Promise<void> {
    // do nothing if folio number was not changed
    if (folioNumber === this.getFolioNumber) return

    try {
      if (this.isInstantUpdate) {
        await AuthServices.updateFolioNumber(folioNumber, this.getBusinessId)
      }
      this.setFolioNumber(folioNumber)
      this.setTransactionalFolioNumber(folioNumber)
    } catch (error) {
      console.log('Update folio number error =', error) // eslint-disable-line no-console
      this.$root.$emit('update-error-event', 'Failed to update Folio Number')
      // reset folio number to previous value
      const prev = this.getFolioNumber
      // toggle for reactivity
      this.setFolioNumber(undefined)
      this.$nextTick(() => this.setFolioNumber(prev))
    }
  }

  /** Sets validity in store initially and when validity conditions have changed. */
  @Watch('isEditingFolioNumber')
  protected updateValidity (): void {
    const isValid = !this.isEditingFolioNumber
    this.setValidComponent({ key: 'isValidFolioInfo', value: isValid })
  }
}
</script>
