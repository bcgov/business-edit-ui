<template>
  <ContactInfoShared
    :contactLabel="getResource.contactLabel"
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :editLabel="editLabel"
    :editedLabel="editSavedLabel"
    :disableActions="isCorrectionFiling"
    :disableActionTooltip="isFirmChangeFiling"
    :invalidSection="invalidSection"
    :optionalPhone="isAlterationFiling || isFirmChangeFiling"
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
import { ActionBindingIF, ResourceIF, EntitySnapshotIF } from '@/interfaces/'
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
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getResource!: ResourceIF
  @Getter getBusinessId!: string

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection: boolean

  protected isEditingContact = null as boolean

  /** The original Contact data. */
  get originalContact (): ContactPointIF {
    return this.getEntitySnapshot?.authInfo?.contact
  }

  /** True if there are changes between current Contact and original Contact Info. */
  get hasBusinessContactInfoChange (): boolean {
    return this.getBusinessContact?.email !== this.originalContact?.email ||
      this.getBusinessContact?.phone !== this.originalContact?.phone ||
      this.getBusinessContact?.extension !== this.originalContact?.extension
  }

  /** On Contact Info Change event, updates auth db and store. */
  protected async onContactInfoChange (contactInfo: ContactPointIF): Promise<void> {
    // do nothing if contact info was not changed
    if (isEqual(contactInfo, this.getBusinessContact)) return

    try {
      if (
        this.isAlterationFiling ||
        this.isFirmChangeFiling ||
        this.isSpecialResolutionFiling
      ) {
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
   * Use "immediate" to pick up all validity conditions.
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
  .align-end {
    position: absolute;
    right: 0;
    margin-right: 16px;
  }
}
</style>
