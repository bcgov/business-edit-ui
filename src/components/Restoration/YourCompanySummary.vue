<template>
  <v-card flat id="restoration-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <v-icon class="header-icon">mdi-domain</v-icon>
          <label class="summary-title pl-2">Your Company</label>
        </v-col>
      </v-row>
    </div>

    <template>
      <v-divider class="mx-4" />

      <!-- Business Name -->
      <template v-if="hasBusinessNameChanged">
        <div class="section-container business-name-summary">
          <v-row no-gutters>
            <v-col cols="3">
              <label><strong>Company Name</strong></label>
            </v-col>

            <v-col cols="8" class="mt-n1">
              <div class="company-name font-weight-bold text-uppercase">{{ getCompanyName }}</div>
              <div class="company-name mt-2">{{ getNameRequest.nrNumber }}</div>
            </v-col>
          </v-row>
        </div>
      </template>

      <!-- Name Translation -->
      <template v-if="haveNameTranslationsChanged">
        <div class="name-translation-summary">
          <NameTranslation :isSummaryMode="true" />
        </div>
      </template>

      <!-- Restoration Type -->
      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Restoration Type</strong></label>
          </v-col>
          <v-col cols="8" v-if="isLimitedRestorationExtension">
            <div class="font-weight-bold">Limited Restoration Extension</div>
            <div>Extension Time: {{ getFormattedExpiryText() }}</div>
          </v-col>
          <v-col cols="8" v-if="isLimitedRestorationToFull">
            <div class="font-weight-bold">Conversion to Full Restoration</div>
            <div>Applicant's relationship: {{ getRelationshipString }}</div>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-3" v-if="getIsRestorationTypeCourtOrder">
          <v-col cols="3">
            <label><strong>Approval Type</strong></label>
          </v-col>
          <v-col cols="8">
            <div class="font-weight-bold">Approved by Court Order</div>
            <div v-if="getCourtOrder">Court Order Number: {{ getCourtOrderNumberText }}</div>
          </v-col>
        </v-row>
      </div>
      <v-divider class="mx-4 my-1" />

      <!-- Office Addresses -->
      <OfficeAddresses :isSummaryView="true" />
    </template>
  </v-card>
</template>

<script lang="ts">
import { ApprovalTypes } from '@bcrs-shared-components/enums'
import { mapState } from 'pinia'
import { OfficeAddresses, NameTranslation } from '@/components/common/'
import { useStore } from '@/store/store'

export default {
  data () {
    return {
      ApprovalTypes
    }
  },
  computed: {
    ...mapState(useStore, [
      'getCourtOrderNumberText',
      'getBusinessNumber',
      'getFormattedExpiryText',
      'getNameRequestLegalName',
      'getNameRequest',
      'getRelationships',
      'getRestoration',
      'getIsRestorationTypeCourtOrder',
      'getStateFilingRestoration',
      'hasBusinessNameChanged',
      'haveNameTranslationsChanged',
      'isLimitedRestorationExtension',
      'isLimitedRestorationToFull'
    ]),
    getStateFilingApprovalType () {
      return this.getStateFilingRestoration?.approvalType
    },
    getCourtOrder () {
      return this.getRestoration.courtOrder
    },
    getCompanyName (): string {
      if (this.getNameRequestLegalName) return this.getNameRequestLegalName
      return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
    },
    getRelationshipString () {
      return this.getRelationships.join(', ') || '[Unknown]'
    }
  },
  components: {
    OfficeAddresses,
    NameTranslation
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
