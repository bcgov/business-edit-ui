<template>
  <contact-info
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    :hasBusinessContactInfoChange="hasBusinessContactInfoChange"
    :edit-label="editLabel"
    :edited-label="editedLabel"
    :disable-actions="isCorrectionView()"
    @contactInfoChange="setContact($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  BusinessContactIF,
  BusinessSnapshotIF,
  IncorporationFilingIF
} from '@/interfaces'

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
  @Action setBusinessContact!: ActionBindingIF

  @Getter getBusinessContact!: BusinessContactIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getOriginalSnapshot!: BusinessSnapshotIF
  @Getter getSnapshotContact!: BusinessContactIF

  /** Get the original Contact info dependant on filing type. */
  private get originalContact (): BusinessContactIF {
    return this.isCorrectionView()
      ? this.getOriginalIA.incorporationApplication.contactPoint
      : this.getSnapshotContact
  }

  /** Check for changes between current contact and original contact. */
  private get hasBusinessContactInfoChange (): boolean {
    return this.getBusinessContact?.email !== this.originalContact?.email ||
      this.getBusinessContact?.phone !== this.originalContact?.phone ||
      this.getBusinessContact?.extension !== this.originalContact?.extension
  }

  /** Update Contact info. */
  private async setContact (contactInfo: BusinessContactIF): Promise<void> {
    this.isCorrectionView()
      ? this.setBusinessContact(contactInfo)
      : await this.updateContactRequest(contactInfo)
  }

  /** Request to update contact info in Auth and Store. */
  private async updateContactRequest (contactInfo: BusinessContactIF): Promise<void> {
    await this.updateContactInfo(contactInfo)
    this.setBusinessContact(contactInfo)
  }
}
</script>

<style lang="scss" scoped>
</style>
