<template>
  <v-card flat id="restoration-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <img class="header-icon" src="@/assets/images/currency-usd-circle.svg">
          <label class="summary-title pl-2">Your Company</label>
        </v-col>
      </v-row>
    </div>
    <!-- Business Name -->
    <template>
      <v-divider class="mx-4" />
      <div class="section-container business-name-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Restoration Type</strong></label>
          </v-col>
          <v-col cols="8" class="mt-n1" v-if="isLimitedExtendRestorationFiling">
            <div class="font-weight-bold">Limited Restoration Extension</div>
            <div>Extension Time: {{ getFormattedExpiryText() }}</div>
          </v-col>
          <v-col cols="8" class="mt-n1" v-if="isLimitedConversionRestorationFiling">
            <div class="font-weight-bold">Conversion to Full Restoration</div>
            <div>[TODO - Applicant's relationship: Director, Shareholder]</div>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-3" v-if="getStateFilingApprovalType === ApprovalTypes.VIA_COURT_ORDER">
          <v-col cols="3">
            <label><strong>Approval Type</strong></label>
          </v-col>
          <v-col cols="8" class="mt-n1">
            <div class="font-weight-bold">Approved by Court Order</div>
            <div v-if="getCourtOrder">Court Order Number: {{ getCourtOrderFileNumber }}</div>
          </v-col>
        </v-row>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { ApprovalTypes } from '@bcrs-shared-components/enums'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      ApprovalTypes
    }
  },
  computed: {
    ...mapGetters(['isLimitedConversionRestorationFiling', 'isLimitedExtendRestorationFiling',
      'getRestoration', 'getFormattedExpiryText', 'getStateFilingRestoration']),
    getStateFilingApprovalType () {
      return this.getStateFilingRestoration?.approvalType
    },
    getCourtOrder () {
      return this.getRestoration.courtOrder
    },
    getCourtOrderFileNumber () {
      return this.getRestoration.courtOrder.fileNumber
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

// hide first v-divider
.v-divider:first-of-type {
  display: none;
}
</style>
