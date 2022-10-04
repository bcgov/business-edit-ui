<template>
  <v-card flat id="special-resolution-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <v-icon class="header-icon ml-n1">mdi-file-document-edit-outline</v-icon>
          <label class="summary-title">Summary of Changes to File</label>
        </v-col>
      </v-row>
    </div>

    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <v-divider class="mx-4" />
      <div class="section-container business-name-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Company Name</strong></label>
          </v-col>

          <v-col cols="8" class="mt-n1">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>
            <div class="company-name mt-2">{{ getNameRequest.nrNumber }}</div>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Association Type -->
    <template v-if="hasAssociationTypeChanged">
      <v-divider class="mx-4" />
      <div class="section-container association-type-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Cooperative Association Type</strong></label>
          </v-col>

          <v-col cols="8">
            <span class="info-text">{{ associationDescription }}</span>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Rules and Memorandum file name add here-->

    <!-- Resolution summary section -->
    <CreateSpecialResolutionSummary />
  </v-card>
</template>

<script lang="ts">
// this is a placceholder copied from AlterationSummary, Will add component when working on this page
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, FeesIF } from '@/interfaces/'
import { DateMixin, SharedMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import CreateSpecialResolutionSummary from '@/components/SpecialResolution/CreateSpecialResolutionSummary.vue'
import { AssociationTypeToDescription } from '@/utils'

@Component({
  components: {
    CreateSpecialResolutionSummary

  }
})
export default class SpecialResolutionSummary extends Mixins(
  DateMixin,
  SharedMixin,
  FeeMixin,
  FilingTemplateMixin
) {
  // Global getters
  @Getter getBusinessNumber!: string
  @Getter getCurrentFees!: FeesIF[]
  @Getter isBusySaving!: boolean
  @Getter getCurrentJsDate!: Date

  // Global actions
  @Action setSummaryMode!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop() readonly validate!: boolean

  get associationDescription (): string {
    return AssociationTypeToDescription(this.getAssociationType)
  }

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** The legal type before changes. */
  get originalLegalType (): string {
    return this.getEntitySnapshot?.businessInfo?.legalType
  }

  /** The association type before changes. */
  get originalAssociationType (): string {
    return this.getEntitySnapshot?.businessInfo?.associationType
  }

  /** Calculates the sum of special resolution fees. */
  get specialResolutionFees (): string {
    const validFees = this.getCurrentFees.filter(f => f.filingFees !== null && f.futureEffectiveFees !== null)
    if (validFees.length === 0) {
      return ''
    }
    /** Calculates the sum of filing fees. */
    const filingFeesSum = validFees.map(f => f.filingFees).reduce((a, b) => a + b, 0)
    /** Calculates the sum of future effective fees. */
    const futureEffectiveFeesSum = validFees.map(f => f.futureEffectiveFees).reduce((a, b) => a + b, 0)
    return `($${(filingFeesSum + futureEffectiveFeesSum).toFixed(2)} Fee)`
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

.confirmed-msg {
  display: flex;
  .confirmed-icon, .confirmed-note {
    display: block;
  }
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

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.alteration-date-time {
  padding: 2rem;
  background-color: $gray1;

  &.invalid {
    border-left: 4px solid $BCgovInputError;
    padding-left: calc(2rem - 4px);

    label {
      color: $BCgovInputError;
    }
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
