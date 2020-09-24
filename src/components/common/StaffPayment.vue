<template>
  <section>
    <header>
      <h2>3. Staff Payment</h2>
    </header>

    <staff-payment-component
      :staffPaymentData="getStaffPayment"
      @update:staffPaymentData="onStaffPaymentData"
      @valid="staffPaymentFormValid = $event"/>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { StaffPayment as StaffPaymentComponent } from '@bcrs-shared-components/staff-payment'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF } from '@/interfaces'

import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

@Component({
  components: {
    StaffPaymentComponent
  }
})
export default class StaffPayment extends Vue {
  // Global getters
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getFilingData!: FilingDataIF

  // Global setters
  @Action setStaffPayment!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setStaffPaymentValidity!: ActionBindingIF

  private staffPaymentFormValid: boolean = false

  private onStaffPaymentData (event) {
    let staffPaymentData: StaffPaymentIF = { ...this.getStaffPayment, ...event }
    if (!this.staffPaymentFormValid) {
      return
    }
    switch (staffPaymentData.option) {
      case StaffPaymentOptions.FAS:
        staffPaymentData = {
          option: StaffPaymentOptions.FAS,
          routingSlipNumber: staffPaymentData.routingSlipNumber,
          isPriority: staffPaymentData.isPriority,
          bcolAccountNumber: '',
          datNumber: '',
          folioNumber: ''
        }
        break

      case StaffPaymentOptions.BCOL:
        staffPaymentData = {
          option: StaffPaymentOptions.BCOL,
          bcolAccountNumber: staffPaymentData.bcolAccountNumber,
          datNumber: staffPaymentData.datNumber,
          folioNumber: staffPaymentData.folioNumber,
          isPriority: staffPaymentData.isPriority,
          routingSlipNumber: ''
        }
        break

      case StaffPaymentOptions.NO_FEE:
        staffPaymentData = {
          option: StaffPaymentOptions.NO_FEE,
          routingSlipNumber: '',
          isPriority: false,
          bcolAccountNumber: '',
          datNumber: '',
          folioNumber: ''
        }
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    // Set Fee Summary data
    this.setFilingData({
      filingTypeCode: this.getFilingData.filingTypeCode,
      entityType: this.getFilingData.entityType,
      priority: staffPaymentData.isPriority,
      waiveFees: staffPaymentData.option === StaffPaymentOptions.NO_FEE
    } as FilingDataIF)

    this.setStaffPayment(staffPaymentData)
    this.emitHaveChanges()
  }

  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return true
  }

  @Watch('staffPaymentFormValid')
  private onFormValidityChange (): void{
    this.setStaffPaymentValidity(this.staffPaymentFormValid)
  }
}
</script>

<style lang="scss" scoped>
#staff-payment-container {
  width: 100%;
  height: 4rem;
  padding: 1rem;
  background-color: white;
}
</style>
