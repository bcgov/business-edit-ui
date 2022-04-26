<template>
  <ContactInfoShared
    :contactLabel="getResource.contactLabel"
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :editLabel="editLabel"
    :editedLabel="editSavedLabel"
    :disableActions="isCorrectionFiling"
    :disableActionTooltip="isChangeFiling"
    :invalidSection="invalidSection"
    :optionalPhone="isChangeFiling || isAlterationFiling"
    @isEditingContact="onIsEditingContact($event)"
    @contactInfoChange="onContactInfoChange($event)"
  />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ContactInfoShared } from '@/components/shared'
import { AuthApiMixin, CommonMixin } from '@/mixins/'
import { ActionBindingIF, ContactPointIF, IncorporationFilingIF, ResourceIF } from '@/interfaces/'

@Component({
  components: {
    ContactInfoShared
  }
})
export default class BusinessContactInfo extends Mixins(AuthApiMixin, CommonMixin) {
  // Global getters
  @Getter getBusinessContact!: ContactPointIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getSnapshotBusinessContact!: ContactPointIF
  @Getter getResource!: ResourceIF

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection!: boolean

  /** Get the original Contact info dependant on filing type. */
  private get originalContact (): ContactPointIF {
    if (this.isCorrectionFiling) return this.getOriginalIA.incorporationApplication.contactPoint
    if (this.isAlterationFiling || this.isChangeFiling) return this.getSnapshotBusinessContact
    return null
  }

  /** Check for changes between current contact and original contact. */
  private get hasBusinessContactInfoChange (): boolean {
    return this.getBusinessContact?.email !== this.originalContact?.email ||
      this.getBusinessContact?.phone !== this.originalContact?.phone ||
      this.getBusinessContact?.extension !== this.originalContact?.extension
  }

  /** Update Contact info. */
  private async onContactInfoChange (contactInfo: ContactPointIF): Promise<void> {
    try {
      if (this.isAlterationFiling || this.isChangeFiling) await this.updateContactInfo(contactInfo)
      this.setBusinessContact(contactInfo)
    } catch (error) {
      console.log('Update contact info error =', error) // eslint-disable-line no-console
      this.$root.$emit('update-error-event', 'Failed to update Contact Info')
      // reset business contact to previous value
      const prev = this.getBusinessContact
      // toggle for reactivity
      this.setBusinessContact({})
      Vue.nextTick(() => this.setBusinessContact(prev))
    }
  }

  /** Keep the store in sync with components state of validity. */
  private onIsEditingContact (isEditing: boolean): void {
    this.setValidComponent({ key: 'isValidContactInfo', value: !isEditing })
  }
}
</script>
