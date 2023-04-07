<template>
  <FolioNumberShared
    :initialValue="getFolioNumber"
    :originalValue="originalFolioNumber"
    :editLabel="editLabel"
    :editedLabel="editedLabelExtended"
    :hideActions="hideActions"
    :invalidSection="invalidSection"
    @newFolioNumber="onNewFolioNumber($event)"
    @haveChanges="onHaveChanges($event)"
    @isEditing="onIsEditing($event)"
  />
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF, EntitySnapshotIF } from '@/interfaces/'
import { AuthServices } from '@/services/'
import { CommonMixin } from '@/mixins/'
import { FolioNumber as FolioNumberShared } from '@bcrs-shared-components/folio-number/'

import { useStore } from '@/store/store'

@Component({
  components: { FolioNumberShared }
})
export default class FolioInformation extends Mixins(CommonMixin) {
  // Global getters
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) getBusinessId!: string

  // Global setters
  @Action(useStore) setFolioNumber!: ActionBindingIF
  @Action(useStore) setEditingFolioNumber!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF
  @Action(useStore) setTransactionalFolioNumber!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false }) readonly invalidSection!: boolean

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
    return this.isInstantUpdate ? 'Changes Saved' : this.editedLabel
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

  /** On Have Changes event, emits event. */
  @Emit('haveChanges')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onHaveChanges (val: boolean): void {}

  /** On Is Editing event, updates store and emits event. */
  @Emit('isEditing')
  protected onIsEditing (val: boolean): void {
    this.setEditingFolioNumber(val)
    this.setValidComponent({ key: 'isValidFolioInfo', value: !val })
  }
}
</script>
