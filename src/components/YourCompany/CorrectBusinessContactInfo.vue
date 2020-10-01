<template>
  <business-contact-info
    :businessContact="getBusinessContact"
    :originalBusinessContact="getOriginalIA.incorporationApplication.contactPoint"
    @contactInfoChange="updateContactInfo($event)"
    @haveChanges="emitHaveChanges($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Vue } from 'vue-property-decorator'

// Interfaces
import { ActionBindingIF, BusinessContactIF, IncorporationFilingIF } from '@/interfaces'

// Mixins
import { Action, Getter } from 'vuex-class'

// Components
import { BusinessContactInfo } from '@/components/YourCompany'

@Component({
  components: {
    BusinessContactInfo
  }
})
export default class CorrectBusinessContactInfo extends Vue {
  @Action setBusinessContact!: ActionBindingIF

  @Getter getBusinessContact!: BusinessContactIF
  @Getter getOriginalIA!: IncorporationFilingIF

  private updateContactInfo (contactInfo: BusinessContactIF): void {
    this.setBusinessContact(contactInfo)
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
</style>
