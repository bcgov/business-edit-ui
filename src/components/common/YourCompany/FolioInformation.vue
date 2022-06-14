<template>
  <FolioNumberShared
    :initialValue="getFolioNumber"
    :originalValue="originalFolioNumber"
    :editLabel="editLabel"
    :editedLabel="editedLabel"
    :hideActions="hideActions"
    :invalidSection="invalidSection"
    @newFolioNumber="onNewFolioNumber($event)"
    @haveChanges="onHaveChanges($event)"
    @isEditing="onIsEditing($event)"
  />
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CorrectedFilingIF, EntitySnapshotIF } from '@/interfaces/'
import { AuthServices } from '@/services/'
import { CommonMixin } from '@/mixins/'
import { FolioNumber as FolioNumberShared } from '@bcrs-shared-components/folio-number/'

@Component({
  components: { FolioNumberShared }
})
export default class FolioInformation extends Mixins(CommonMixin) {
  // Global getters
  @Getter getFolioNumber!: string
  @Getter getCorrectedFiling!: CorrectedFilingIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter isRoleStaff!: boolean
  @Getter getBusinessId!: string

  // Global setters
  @Action setFolioNumber!: ActionBindingIF
  @Action setEditingFolioNumber!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection: boolean

  /** The original folio number dependant on filing type. */
  get originalFolioNumber (): string {
    if (this.isCorrectionFiling && this.getCorrectedFiling?.header) {
      return this.getCorrectedFiling.header.folioNumber
    } else if (this.isAlterationFiling) {
      return this.getEntitySnapshot?.authInfo?.folioNumber
    } else {
      return null
    }
  }

  /** Whether to hide the component's actions. */
  get hideActions (): boolean {
    // hide actions in a correction filing
    // hide actions from staff users
    return (this.isCorrectionFiling || this.isRoleStaff)
  }

  /** On new folio number, updates auth db and store. */
  async onNewFolioNumber (val: string): Promise<void> {
    try {
      if (this.isAlterationFiling) {
        await AuthServices.updateFolioNumber(val, this.getBusinessId)
      }
      this.setFolioNumber(val)
      this.setTransactionalFolioNumber(val)
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
  onHaveChanges (val: boolean): void {}

  /** On Is Editing event, updates store and emits event. */
  @Emit('isEditing')
  onIsEditing (val: boolean): void {
    this.setEditingFolioNumber(val)
    this.setValidComponent({ key: 'isValidFolioInfo', value: !val })
  }
}
</script>
