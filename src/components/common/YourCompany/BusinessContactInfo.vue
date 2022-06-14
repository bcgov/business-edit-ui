<template>
  <ContactInfoShared
    :contactLabel="getResource.contactLabel"
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :editLabel="editLabel"
    :editedLabel="editSavedLabel"
    :disableActions="isCorrectionFiling"
    :disableActionTooltip="isChangeRegFiling || isConversionFiling"
    :invalidSection="invalidSection"
    :optionalPhone="isAlterationFiling || isChangeRegFiling || isConversionFiling"
    @isEditingContact="isEditingContact = $event"
    @contactInfoChange="onContactInfoChange($event)"
  />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ContactInfo as ContactInfoShared } from '@bcrs-shared-components/contact-info/'
import { AuthServices } from '@/services/'
import { CommonMixin } from '@/mixins/'
import { ActionBindingIF, ChgRegistrationIF, IncorporationApplicationIF, RegistrationIF,
  ResourceIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'

@Component({
  components: {
    ContactInfoShared
  }
})
export default class BusinessContactInfo extends Mixins(CommonMixin) {
  // Global getters
  @Getter getBusinessContact!: ContactPointIF
  @Getter getOriginalIA!: IncorporationApplicationIF
  @Getter getOriginalChgRegistration!: ChgRegistrationIF
  @Getter getOriginalRegistration!: RegistrationIF
  @Getter getSnapshotBusinessContact!: ContactPointIF
  @Getter getResource!: ResourceIF
  @Getter getBusinessId!: string
  @Getter isEntityTypeFirm!: boolean
  @Getter isFirmCorrectionFiling!: boolean

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection: boolean

  private isEditingContact = null as boolean

  /** Get the original Contact info dependant on filing type. */
  get originalContact (): ContactPointIF {
    if (this.getOriginalIA) {
      return this.getOriginalIA.contactPoint
    } else if (this.getOriginalChgRegistration) {
      return this.getOriginalChgRegistration.contactPoint
    } else if (this.getOriginalRegistration) {
      return this.getOriginalRegistration.contactPoint
    } else {
      return this.getSnapshotBusinessContact
    }
  }

  /** Check for changes between current contact and original contact. */
  get hasBusinessContactInfoChange (): boolean {
    return this.getBusinessContact?.email !== this.originalContact?.email ||
      this.getBusinessContact?.phone !== this.originalContact?.phone ||
      this.getBusinessContact?.extension !== this.originalContact?.extension
  }

  /** Update Contact info. */
  private async onContactInfoChange (contactInfo: ContactPointIF): Promise<void> {
    // do nothing if contact info was not changed
    if (isEqual(contactInfo, this.getBusinessContact)) return

    try {
      if (this.isAlterationFiling || this.isChangeRegFiling || this.isConversionFiling) {
        await AuthServices.updateContactInfo(contactInfo, this.getBusinessId)
      }
      this.setBusinessContact(contactInfo)
    } catch (error) {
      console.log('Update contact info error =', error) // eslint-disable-line no-console
      this.$root.$emit('update-error-event', 'Failed to update Contact Info')
      // reset business contact to previous value
      const prev = this.getBusinessContact
      // toggle for reactivity
      this.setBusinessContact({})
      this.$nextTick(() => this.setBusinessContact(prev))
    }
  }

  /**
   * Keep the store in sync with this component's state of validity.
   * Use "immediate" to pick up all validity conditions
   */
  @Watch('isEditingContact', { immediate: true })
  @Watch('getBusinessContact.email', { immediate: true })
  private syncValidity (): void {
    const isValid = (
      !this.isEditingContact &&
      !!this.getBusinessContact?.email
    )
    this.setValidComponent({ key: 'isValidContactInfo', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  #contact-info-edit-btn {
    margin-right: -14px;
  }
}
</style>
