<template>
  <v-card
    id="extend-time-limit"
    flat
    class="mr-8"
  >
    <!-- Extension Time -->
    <section
      id="extension-time-section"
      class="section-container"
      :class="{ 'invalid-section': !getExpiryValid }"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="2"
          class="pt-2"
        >
          <span :class="{ 'error-text': !getExpiryValid }"><strong>Extension Time</strong></span>
        </v-col>
        <v-col
          cols="12"
          sm="9"
          class="pl-10"
        >
          <LimitedRestorationPanel
            :months="expiryMonths"
            @expiry="onExpiryChanged($event)"
            @valid="setExpiryValid($event)"
          />
        </v-col>
      </v-row>
    </section>

    <!-- Approval Type -->
    <section
      v-if="showApprovalType"
      id="approval-type-section"
      class="section-container"
      :class="{ 'invalid-section': !getApprovalTypeValid }"
    >
      <ApprovalType
        :courtOrderNumber="getCourtOrderNumberText"
        :isCourtOrderOnly="true"
        :isCourtOrderRadio="false"
        :invalidSection="!getApprovalTypeValid"
        @courtNumberChange="setRestorationCourtOrder({ fileNumber: $event })"
        @valid="setApprovalTypeValid($event)"
      />
    </section>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import { ApprovalTypes } from '@/enums'
import Actions from '@/components/common/Actions.vue'
import { DateMixin } from '@/mixins'
import DateUtilities from '@/services/date-utilities'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'
import { ActionBindingIF, StateFilingRestorationIF } from '@/interfaces'
import { useStore } from '@/store/store'

@Component({
  components: {
    Actions,
    ApprovalType,
    LimitedRestorationPanel
  }
})
export default class ExtendTimeLimit extends Mixins(DateMixin) {
  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getCourtOrderNumberText!: string
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExpiryValid!: boolean
  @Getter(useStore) getRestorationExpiryDate!: string
  @Getter(useStore) getStateFilingRestoration!: StateFilingRestorationIF

  @Action(useStore) setApprovalTypeValid!: ActionBindingIF
  @Action(useStore) setExpiryValid!: ActionBindingIF
  @Action(useStore) setRestorationCourtOrder!: ActionBindingIF
  @Action(useStore) setRestorationExpiry!: ActionBindingIF

  /** Whether to show the Approval Type component. */
  get showApprovalType (): boolean {
    // was previously filed limited restoration approved via court order?
    return (this.getStateFilingRestoration?.approvalType === ApprovalTypes.VIA_COURT_ORDER)
  }

  /** The remaining number of months left for the previously filed limited restoration. */
  get monthsRemaining (): number {
    const stateFilingExpiry = this.getStateFilingRestoration?.expiry
    if (stateFilingExpiry) return DateUtilities.subtractDates(this.getCurrentDate, stateFilingExpiry)
    return 0
  }

  /** The calculated expiry date offset. */
  get expiryDate (): string {
    return DateUtilities.subtractMonthsFromDate(this.monthsRemaining, this.getRestorationExpiryDate)
  }

  get expiryMonths (): number {
    return DateUtilities.subtractDates(this.getCurrentDate, this.getRestorationExpiryDate)
  }

  /** Sets the new expiry date in the store. */
  onExpiryChanged (expiry: string): void {
    // add the previous remaining months to the new expiry date
    this.setRestorationExpiry(DateUtilities.addMonthsToDate(this.monthsRemaining, expiry))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep() {
  // Fix font of radio buttons.
  .radio-button {
    label {
      font-weight: normal;
      color: $gray7;
    }
  }
}
</style>
