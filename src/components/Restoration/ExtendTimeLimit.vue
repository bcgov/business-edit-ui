<template>
  <v-card flat id="extend-time-limit" class="pt-2 mr-8">

    <!-- Extension Time Section -->
    <section
      id="extension-time-section"
      class="section-container"
      :class="{ 'invalid-section': !getExpiryValid }"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="3">
          <strong :class="{ 'error-text': !getExpiryValid }">Extension Time</strong>
        </v-col>
        <v-col cols="12" sm="9">
          <!-- Limited Restoration Radio Panel -->
          <LimitedRestorationPanel
            :currentDate="getCurrentDate"
            :expiryDate="expiry"
            :key="expiry"
            :maxNumberOfMonths=36
            @expiry="setRestorationExpiry(addMonthsToDate(previousNumberOfMonths, $event))"
            @valid="setExpiryValid($event)"
          />
        </v-col>
      </v-row>
    </section>

    <!-- Approval Type Section (if applicable) -->
    <section id="approval-type-section"
      class="section-container"
      :class="{ 'invalid-section': !getApprovalTypeValid }"
    >
      <template v-if="approvalType == ApprovalTypes.VIA_COURT_ORDER">
        <ApprovalType
          :courtOrderNumber="courtOrderNumberText"
          :isCourtOrderOnly="true"
          :isCourtOrderRadio="false"
          :invalidSection="!getApprovalTypeValid"
          @courtNumberChange="setRestorationCourtOrder({ fileNumber: $event })"
          @valid="setApprovalTypeValid($event)"
        />
      </template>
    </section>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action, Getter } from 'vuex-class'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import { ApprovalTypes, RestorationTypes } from '@/enums'
import Actions from '@/components/common/Actions.vue'
import { Component, Watch } from 'vue-property-decorator'
import { DateMixin, CommonMixin } from '@/mixins'
import DateUtilities from '@/services/date-utilities'
import { LegalServices } from '@/services/'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'
import { RestorationStateIF, StateFilingRestorationIF } from '@/interfaces'

@Component({
  mixins: [
    CommonMixin,
    DateMixin
  ],
  components: {
    Actions,
    ApprovalType,
    LimitedRestorationPanel
  }
})
export default class ExtendTimeLimit extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getCurrentDate!: string
  @Getter getExpiryValid!: boolean
  @Getter getRestoration!: RestorationStateIF
  @Getter getStateFilingRestoration!: StateFilingRestorationIF

  @Action setApprovalTypeValid!: ActionBindingIF
  @Action setExpiryValid!: ActionBindingIF
  @Action setRestorationCourtOrder!: ActionBindingIF
  @Action setRestorationExpiry!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // Enum for template
  readonly ApprovalTypes = ApprovalTypes
  readonly RestorationTypes = RestorationTypes

  /** The limited restoration state filing's approval type. */
  get approvalType (): ApprovalTypes {
    return this.getStateFilingRestoration?.approvalType
  }

  /** The court order draft file number. */
  get courtOrderNumberText (): string {
    return this.getRestoration.courtOrder?.fileNumber || ''
  }

  /** The expiry draft date for extension. */
  get expiry (): string {
    return DateUtilities.subtractMonthsToDate(this.previousNumberOfMonths, this.getRestoration.expiry)
  }

  /** The remaining number of months left for the previously filed limited restoration. */
  get previousNumberOfMonths (): string {
    return this.subtractDates(this.getCurrentDate, this.getStateFilingRestoration?.expiry)
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
