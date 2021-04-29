<template>
  <ContactInfo
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :editLabel="editLabel"
    :editedLabel="editedLabel"
    :disableActions="isCorrectionFiling"
    :invalidSection="invalidSection"
    @isEditingContact="onIsEditingContact($event)"
    @contactInfoChange="onContactInfoChange($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, IncorporationFilingIF } from '@/interfaces'

// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

// Mixins
import { AuthApiMixin, CommonMixin } from '@/mixins'

// Components
import { ContactInfo } from '@bcrs-shared-components/contact-info'

@Component({
  components: {
    ContactInfo
  }
})
export default class BusinessContactInfo extends Mixins(AuthApiMixin, CommonMixin) {
  // Global getters
  @Getter getBusinessContact!: ContactPointIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getSnapshotBusinessContact!: ContactPointIF
  @Getter isCorrectionFiling!: boolean
  @Getter isAlterationFiling!: boolean

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection!: boolean

  /** Get the original Contact info dependant on filing type. */
  private get originalContact (): ContactPointIF {
    if (this.isCorrectionFiling) return this.getOriginalIA.incorporationApplication.contactPoint
    if (this.isAlterationFiling) return this.getSnapshotBusinessContact
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
      if (this.isAlterationFiling) await this.updateContactInfo(contactInfo)
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
