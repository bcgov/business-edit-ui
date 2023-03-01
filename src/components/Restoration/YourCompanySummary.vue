<template>
  <v-card flat id="restoration-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <img class="header-icon" src="@/assets/images/currency-usd-circle.svg">
          <label class="summary-title">Your Company</label>
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
            <div>Extension Time: {{ getFormattedExpiryText }}</div>
          </v-col>
          <v-col cols="8" class="mt-n1" v-if="isLimitedConversionRestorationFiling">
            <div class="font-weight-bold">Conversion to Full Restoration</div>
            <div>[TODO - Applicant's relationship: Director, Shareholder]</div>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-3" v-if="hasFileNumber">
          <v-col cols="3">
            <label><strong>Approval Type</strong></label>
          </v-col>
          <v-col cols="8" class="mt-n1">
            <div class="font-weight-bold">Approved by Court Order</div>
            <div>Court Order Number: {{ getFileNumber }}</div>
          </v-col>
        </v-row>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isLimitedConversionRestorationFiling', 'isLimitedExtendRestorationFiling',
      'hasFileNumber', 'getFileNumber', 'getFormattedExpiryText'])
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

.summary-title {
  padding-left: 0.5rem;
}

.company-name {
  font-size: 1.5rem;
}

.actions {
  position: absolute;
  right: 0;

  #btn-delete-restoration {
    margin-top: -6px;
  }
}

.inner-col-1 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, decrease width by 1/2 container margin + padding
  flex: 0 0 calc(25% - 1.5rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1.5rem);
  max-width: calc(75% + 1.5rem);
}

#effective-date-text {
  color: $gray7;
}

// hide first v-divider
.v-divider:first-of-type {
  display: none;
}
</style>