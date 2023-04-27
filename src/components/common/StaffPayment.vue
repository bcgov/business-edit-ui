<template>
  <section
    id="staff-payment"
    class="pb-6"
  >
    <header>
      <h2>{{ sectionNumber }} Staff Payment</h2>
    </header>

    <div
      :class="{'invalid-section': invalidStaffPayment}"
      class="mt-4"
    >
      <v-card
        flat
        class="section-container py-6"
      >
        <StaffPaymentShared
          :staffPaymentData="getStaffPayment"
          :validate="getAppValidate"
          :invalidSection="invalidStaffPayment"
          @update:staffPaymentData="onStaffPaymentDataUpdate($event)"
          @valid="setStaffPaymentValidity($event)"
        />
      </v-card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'

// Components
import { StaffPayment as StaffPaymentShared } from '@/bcrs-shared-components/staff-payment/'

// Interfaces and Enums
import { ActionBindingIF, FlagsReviewCertifyIF } from '@/interfaces/'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { StaffPaymentOptions } from '@/bcrs-shared-components/enums/'

import { useStore } from '@/store/store'

@Component({
  components: {
    StaffPaymentShared
  }
})
export default class StaffPayment extends Vue {
  // Global getters
  @Getter(useStore) getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getStaffPayment!: StaffPaymentIF

  // Global actions
  @Action(useStore) setStaffPayment!: ActionBindingIF
  @Action(useStore) setStaffPaymentValidity!: ActionBindingIF

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  /** True if this component is invalid. */
  get invalidStaffPayment (): boolean {
    return (this.getAppValidate && !this.getFlagsReviewCertify.isValidStaffPayment)
  }

  /** Called by sub-component to update the staff payment data in the store. */
  protected onStaffPaymentDataUpdate (event: StaffPaymentIF) {
    let staffPaymentData: StaffPaymentIF = { ...this.getStaffPayment, ...event }

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

    this.setStaffPayment(staffPaymentData)
    this.emitHaveChanges()
  }

  @Emit('haveChanges')
  private emitHaveChanges (): void {}
}
</script>
