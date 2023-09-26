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
            @months="onMonthsChanged($event)"
            @valid="setExpiryValid($event)"
          />
        </v-col>
      </v-row>

      <!-- Vuetify Divider Line to separate approval type -->
      <v-divider></v-divider>
      
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
import { CourtOrderIF, StateFilingRestorationIF } from '@/interfaces'
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

  @Action(useStore) setApprovalTypeValid!: (x: boolean) => void
  @Action(useStore) setExpiryValid!: (x: boolean) => void
  @Action(useStore) setRestorationCourtOrder!: (x: CourtOrderIF) => void
  @Action(useStore) setRestorationExpiryDate!: (x: string) => void

  /** Whether to show the Approval Type component. */
  get showApprovalType (): boolean {
    // was previously filed limited restoration approved via court order?
    return (this.getStateFilingRestoration?.approvalType === ApprovalTypes.VIA_COURT_ORDER)
  }

  /** The state filing (previous limited restoration) expiry date. */
  get stateFilingExpiry (): string {
    // should always exist but fall back to today just in case
    return (this.getStateFilingRestoration?.expiry || this.getCurrentDate)
  }

  /** The number of months remaining from the state filing. */
  get monthsRemaining (): number {
    return DateUtilities.subtractDates(this.getCurrentDate, this.stateFilingExpiry)
  }

  /** The expiry months from the current limited restoration extension. */
  get expiryMonths (): number {
    if (this.getRestorationExpiryDate) {
      const totalMonths = DateUtilities.subtractDates(this.getCurrentDate, this.getRestorationExpiryDate)
      return (totalMonths - this.monthsRemaining)
    }
    return 24 // default if no expiry date was set
  }

  /**
   * When months has changed, sets the limited restoration extension expiry date
   * in the store.
   */
  onMonthsChanged (months: number): void {
    // add the new expiry months to the original expiry date
    this.setRestorationExpiryDate(DateUtilities.addMonthsToDate(months, this.stateFilingExpiry))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep() {
  // Fix font of radio buttons.
  .radio-button label {
    font-weight: normal;
    color: $gray7;
  }
}
</style>
