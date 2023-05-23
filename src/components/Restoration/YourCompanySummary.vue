<template>
  <v-card
    id="restoration-summary"
    flat
  >
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <v-icon class="header-icon">
            mdi-domain
          </v-icon>
          <label class="summary-title pl-2">Your Company</label>
        </v-col>
      </v-row>
    </div>

    <div>
      <v-divider class="mx-4" />

      <!-- Business Name -->
      <template v-if="hasBusinessNameChanged">
        <div class="section-container business-name-summary">
          <v-row no-gutters>
            <v-col cols="3">
              <label><strong>Company Name</strong></label>
            </v-col>

            <v-col
              cols="8"
              class="mt-n1"
            >
              <div class="company-name font-weight-bold text-uppercase">
                {{ companyName }}
              </div>
              <div class="company-name mt-2">
                {{ getNameRequest.nrNum }}
              </div>
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
          <v-col
            v-if="isLimitedRestorationExtension"
            cols="8"
          >
            <div class="font-weight-bold">
              Limited Restoration Extension
            </div>
            <div>Extension Time: {{ getRestorationExpiryText }}</div>
          </v-col>
          <v-col
            v-if="isLimitedRestorationToFull"
            cols="8"
          >
            <div class="font-weight-bold">
              Conversion to Full Restoration
            </div>
            <div>Applicant's relationship: {{ relationshipString }}</div>
          </v-col>
        </v-row>
        <v-row
          v-if="getIsRestorationTypeCourtOrder"
          no-gutters
          class="mt-3"
        >
          <v-col cols="3">
            <label><strong>Approval Type</strong></label>
          </v-col>
          <v-col cols="8">
            <div class="font-weight-bold">
              Approved by Court Order
            </div>
            <div v-if="courtOrder">
              Court Order Number: {{ getCourtOrderNumberText }}
            </div>
          </v-col>
        </v-row>
      </div>
      <v-divider class="mx-4 my-1" />

      <!-- Office Addresses -->
      <OfficeAddresses :isSummaryView="true" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ApprovalTypes, RelationshipTypes } from '@bcrs-shared-components/enums'
import { OfficeAddresses, NameTranslation } from '@/components/common/'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'
import { CourtOrderIF } from '@/interfaces/alteration-interfaces'
import { RestorationStateIF } from '@/interfaces'

@Component({
  components: {
    OfficeAddresses,
    NameTranslation
  }
})
export default class YourCompanySummary extends Vue {
  // for template
  readonly ApprovalTypes = ApprovalTypes

  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getCourtOrderNumberText!: string
  @Getter(useStore) getIsRestorationTypeCourtOrder!: boolean
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getRelationships!: RelationshipTypes[]
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getRestorationExpiryText!: string
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) haveNameTranslationsChanged!: boolean
  @Getter(useStore) isLimitedRestorationExtension!: boolean
  @Getter(useStore) isLimitedRestorationToFull!: boolean

  get courtOrder (): CourtOrderIF {
    return this.getRestoration.courtOrder
  }

  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName
    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  get relationshipString (): string {
    return this.getRelationships.join(', ') || '[Unknown]'
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
