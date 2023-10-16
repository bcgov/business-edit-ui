<template>
  <div
    id="business-contact-info"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <ContactInfoShared
      :contactLabel="getResource.contactLabel"
      :businessContact="getBusinessContact"
      :originalBusinessContact="originalContact"
      :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
      :editLabel="getEditLabel"
      :editedLabel="getEditSavedLabel"
      :disableActionTooltip="isFirmChangeFiling"
      :invalidSection="invalidSection"
      :optionalPhone="isAlterationFiling || isFirmChangeFiling"
      @isEditingContact="isEditingContact = $event"
      @contactInfoChange="onContactInfoChange($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ContactInfo as ContactInfoShared } from '@bcrs-shared-components/contact-info/'
import { AuthServices } from '@/services/'
import { CommonMixin } from '@/mixins/'
import { ActionKvIF, ResourceIF, EntitySnapshotIF, FlagsCompanyInfoIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'
import { useStore } from '@/store/store'

@Component({
  components: {
    ContactInfoShared
  }
})
export default class BusinessContactInfo extends Mixins(CommonMixin) {
  // Global getters
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditSavedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean

  // Global setters
  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  // Local variable
  isEditingContact = false

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (
      this.getComponentValidate &&
      !this.getFlagsCompanyInfo.isValidContactInfo
    )
  }

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
  async onContactInfoChange (contactInfo: ContactPointIF): Promise<void> {
    // do nothing if contact info was not changed
    if (isEqual(contactInfo, this.getBusinessContact)) return

    try {
      await AuthServices.updateContactInfo(contactInfo, this.getBusinessId)
      this.setBusinessContact(contactInfo)
    } catch (error) {
      console.log('Update contact info error =', error) // eslint-disable-line no-console
      this.$root.$emit('update-error-event', 'Failed to update Contact Info')
      // reset business contact to previous value
      const prev = this.getBusinessContact
      // toggle for reactivity
      this.setBusinessContact({} as ContactPointIF)
      this.$nextTick(() => this.setBusinessContact(prev))
    }
  }

  /** Sets validity in store initially and when validity conditions have changed. */
  @Watch('isEditingContact', { immediate: true })
  @Watch('getBusinessContact.email', { immediate: true })
  private updateValidity (): void {
    const isValid = (
      !this.isEditingContact &&
      !!this.getBusinessContact?.email
    )
    this.setValidComponent({ key: 'isValidContactInfo', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#business-contact-info {
  border-bottom-left-radius: 0 !important;
}

:deep(.align-end) {
  position: absolute;
  right: 0;
  margin-right: 16px;
}
</style>
