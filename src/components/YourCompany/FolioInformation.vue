<template>
  <FolioNumber
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
import { Component, Emit, Mixins, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, IncorporationFilingIF } from '@/interfaces'
import { AuthApiMixin, CommonMixin } from '@/mixins'
// TODO: move FolioNumber to bcrs-shared-components (#5024 part 2)
import FolioNumber from './FolioNumber.vue'

@Component({
  components: { FolioNumber }
})
export default class FolioInformation extends Mixins(AuthApiMixin, CommonMixin) {
  // Global getters
  @Getter getFolioNumber!: string
  @Getter isCorrectionFiling!: boolean
  @Getter isAlterationFiling!: boolean
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getSnapshotFolioNumber!: string
  @Getter isRoleStaff!: boolean

  // Global setters
  @Action setFolioNumber!: ActionBindingIF
  @Action setEditingFolioNumber!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection!: boolean

  /** The original folio number dependant on filing type. */
  private get originalFolioNumber (): string {
    if (this.isCorrectionFiling) return this.getOriginalIA.header.folioNumber
    if (this.isAlterationFiling) return this.getSnapshotFolioNumber
    return null
  }

  /** Whether to hide the component's actions. */
  private get hideActions (): boolean {
    // hide actions in a correction filing
    // hide actions from staff users
    return (this.isCorrectionFiling || this.isRoleStaff)
  }

  /** On new folio number, updates auth db and store. */
  async onNewFolioNumber (val: string): Promise<void> {
    try {
      if (this.isAlterationFiling) await this.updateFolioNumber(val)
      this.setFolioNumber(val)
    } catch (error) {
      console.log('Update folio number error =', error) // eslint-disable-line no-console
      this.$root.$emit('update-error-event', 'Failed to update Folio Number')
      // reset folio number to previous value
      const prev = this.getFolioNumber
      // toggle for reactivity
      this.setFolioNumber(undefined)
      Vue.nextTick(() => this.setFolioNumber(prev))
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
