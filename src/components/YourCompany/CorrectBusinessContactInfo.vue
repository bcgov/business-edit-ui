<template>
<!--  <business-contact-info-->
<!--    :businessContact="getBusinessContact"-->
<!--    :originalBusinessContact="getOriginalIA.incorporationApplication.contactPoint"-->
<!--    @contactInfoChange="updateContactInfo($event)"-->
<!--    @haveChanges="emitHaveChanges($event)"-->
<!--  />-->
  <business-contact-info-shared
    :businessContact="getBusinessContact"
    :originalBusinessContact="originalContact"
    @contactInfoChange="updateContactInfo($event)"
    @haveChanges="emitHaveChanges($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, BusinessContactIF, BusinessSnapshotIF, IncorporationFilingIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'

// Components
import { BusinessContactInfo, BusinessContactInfoShared } from '@/components/YourCompany'

@Component({
  components: {
    BusinessContactInfo,
    BusinessContactInfoShared
  }
})
export default class CorrectBusinessContactInfo extends Mixins(CommonMixin) {
  @Action setBusinessContact!: ActionBindingIF

  @Getter getBusinessContact!: BusinessContactIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getOriginalSnapshot!: BusinessSnapshotIF

  private get originalContact (): any {
    return this.isCorrectionView()
      ? this.getOriginalIA.incorporationApplication.contactPoint
      : this.getOriginalSnapshot[5]
  }

  private updateContactInfo (contactInfo: BusinessContactIF): void {
    this.setBusinessContact(contactInfo)
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
</style>
