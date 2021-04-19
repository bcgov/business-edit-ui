<template>
  <contact-info
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :edit-label="editLabel"
    :edited-label="editedLabel"
    :disable-actions="isCorrectionFiling"
    :invalidSection="invalidContactSection"
    @isEditingContact="setContactInfoValidity($event)"
    @contactInfoChange="setContact($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  IncorporationFilingIF,
  ValidComponentsIF
} from '@/interfaces'

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
  @Getter getComponentValidate!: boolean
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getSnapshotContact!: ContactPointIF
  @Getter isCorrectionFiling!: boolean
  @Getter getValidComponentFlags!: ValidComponentsIF

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Get the original Contact info dependant on filing type. */
  private get originalContact (): ContactPointIF {
    return this.isCorrectionFiling
      ? this.getOriginalIA.incorporationApplication.contactPoint
      : this.getSnapshotContact
  }

  /** Check for changes between current contact and original contact. */
  private get hasBusinessContactInfoChange (): boolean {
    return this.getBusinessContact?.email !== this.originalContact?.email ||
      this.getBusinessContact?.phone !== this.originalContact?.phone ||
      this.getBusinessContact?.extension !== this.originalContact?.extension
  }

  /** Check validity state, only when prompted by app. */
  private get invalidContactSection (): boolean {
    return this.getComponentValidate && !this.getValidComponentFlags.isValidContactInfo
  }

  /** Update Contact info. */
  private async setContact (contactInfo: ContactPointIF): Promise<void> {
    this.isCorrectionFiling
      ? this.setBusinessContact(contactInfo)
      : await this.updateContactRequest(contactInfo)
  }

  /** Request to update contact info in Auth and Store. */
  private async updateContactRequest (contactInfo: ContactPointIF): Promise<void> {
    await this.updateContactInfo(contactInfo)
    this.setBusinessContact(contactInfo)
  }

  /** Keep the store in sync with components state of validity. */
  private setContactInfoValidity (isEditing: boolean): void {
    this.setValidComponent({ key: 'isValidContactInfo', value: !isEditing })
  }
}
</script>

<style lang="scss" scoped>
</style>
