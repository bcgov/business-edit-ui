<template>
  <v-card flat id="alteration-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <img  class="my-n1 header-icon" src="@/assets/images/currency-usd-circle.svg">
          <label class="summary-title">Alteration Notice Changes {{alterationFees}}</label>
        </v-col>

        <!-- Actions -->
        <v-col cols="3" class="mt-n2">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-delete-alteration"
              :disabled="isBusySaving"
              @click="onDeleteClicked()"
            >
              <v-icon small>mdi-delete</v-icon>
              <span>Delete</span>
            </v-btn>
          </div>
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

    <!-- Business Type -->
    <template v-if="hasBusinessTypeChanged">
      <v-divider class="mx-4" />
      <div class="section-container business-type-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Business Type</strong></label>
          </v-col>

          <v-col cols="8">
            <span class="info-text">Changing from a {{ getCorpTypeDescription(originalLegalType) }}</span>
            &nbsp;
            <span class="info-text">to a {{getCorpTypeDescription(getEntityType)}}</span>

            <p class="subtitle mt-2 pt-2">Benefit Company Articles</p>
            <div class="confirmed-msg">
              <v-icon color="success" class="confirmed-icon">mdi-check</v-icon>
              <span class="info-text text-body-3 confirmed-icon ml-2">
                The company has completed a set Benefit Company Articles containing a benefit provision, and a copy
                of these articles has been added to the company's record book.
              </span>
            </div>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name Translation -->
    <template v-if="hasNameTranslationChanged">
      <v-divider class="mx-4" />
      <div class="section-container name-translation-summary">
        <NameTranslation
          :nameTranslations="getNameTranslations"
          :isSummaryMode="true"
        />
      </div>
    </template>

    <!-- Share Structure -->
    <template v-if="hasShareStructureChanged">
      <v-divider class="mx-4" />
      <div class="section-container share-structure-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Share Structure</strong></label>
          </v-col>
        </v-row>
        <share-structures class="mt-6" :is-edit-mode="false" />
      </div>
    </template>

    <!-- Pre-existing Company Provisions -->
    <template v-if="areProvisionsRemoved">
      <v-divider class="mx-4" />
      <div class="section-container provisions-removed-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Pre-existing<br>Company Provisions</strong></label>
          </v-col>

          <v-col cols="8">
            <span class="info-text">
              The company has resolved that none of the Pre-existing Company Provisions are to apply to this company.
            </span>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Resolution or Court Order Dates -->
    <template v-if="haveNewResolutionDates">
      <v-divider class="mx-4" />
      <div class="section-container new-resolution-dates-summary">
        <resolution-dates
          :added-dates="getNewResolutionDates"
          :previous-dates="getPreviousResolutionDates"
          :isEditMode="false"
        />
      </div>
    </template>

    <!-- Alteration Date and Time -->
    <div class="ma-6 pb-6">
      <v-container
        id="effective-date-time"
        class="alteration-date-time"
        :class="{ 'invalid': alterationDateTimeInvalid }">
        <v-row no-gutters>
          <v-col cols="3" class="inner-col-1">
            <label><strong>Alteration Date<br>and Time</strong></label>
          </v-col>

          <v-col cols="9" class="inner-col-2">
            <p id="effective-date-time-instructions" class="info-text">
              Select the date and time of alteration of your business. You may select a date and time up to 10 days in
              the future (note: there is an <strong>additional fee {{futureEffectiveFeePrice}}</strong> to
              enter an alteration date and time in the future). Unless a business has special requirements, most
              businesses select an immediate Alteration Date and Time.
            </p>

            <effective-date-time
              :currentJsDate="getCurrentJsDate"
              :effectiveDateTime="getEffectiveDateTime"
              @dateTimeString="setEffectiveDateTimeString($event)"
              @isFutureEffective="setIsFutureEffective($event); emitHaveChanges()"
              @valid="setEffectiveDateValid($event)"
            />

            <v-card
              flat
              class="px-16 pb-8 mt-n12"
              id="effective-date-text"
              v-if="isFutureEffective && isEffectiveDateTimeValid">
              The alteration for this business will be effective as of:<br>
              <strong>{{effectiveDateTimeString}}</strong>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, FlagsReviewCertifyIF, FeesIF } from '@/interfaces/'
import { DateMixin, SharedMixin, FilingTemplateMixin, PayApiMixin } from '@/mixins/'
import { EffectiveDateTime, NameTranslation, ShareStructures } from '@/components/common/'
import { ResolutionDates } from '@/components/Alteration/'

@Component({
  components: {
    EffectiveDateTime,
    NameTranslation,
    ResolutionDates,
    ShareStructures
  }
})
export default class AlterationSummary extends Mixins(
  DateMixin,
  SharedMixin,
  FilingTemplateMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getBusinessNumber!: string
  @Getter getPreviousResolutionDates!: string[]
  @Getter getCurrentFees!: FeesIF
  @Getter isBusySaving!: boolean
  @Getter getFeePrices!: FeesIF
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter haveNewResolutionDates!: boolean
  @Getter getCurrentJsDate!: Date

  // Global actions
  @Action setSummaryMode!: ActionBindingIF
  @Action setEffectiveDateValid!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop() readonly validate: boolean

  get isFutureEffective (): boolean {
    return this.getEffectiveDateTime.isFutureEffective
  }

  get isEffectiveDateTimeValid (): boolean {
    return this.getFlagsReviewCertify.isValidEffectiveDate
  }

  get effectiveDateTimeString (): string {
    const date = new Date(this.getEffectiveDateTime.dateTimeString)
    return this.dateToPacificDateTime(date)
  }

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestApprovedName) return this.getNameRequestApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  get originalLegalType (): string {
    return this.getEntitySnapshot?.businessInfo?.legalType
  }

  /** True if invalid class should be set for Alteration Date-Time container. */
  get alterationDateTimeInvalid (): boolean {
    return (this.validate && !this.getFlagsReviewCertify.isValidEffectiveDate)
  }

  // sum of alteration fees
  get alterationFees (): string {
    if (this.getCurrentFees.filingFees !== null && this.getCurrentFees.futureEffectiveFees !== null) {
      return `($${(this.getCurrentFees.filingFees + this.getCurrentFees.futureEffectiveFees).toFixed(2)} Fee)`
    }
    return ''
  }

  get futureEffectiveFeePrice (): string {
    if (this.getFeePrices.futureEffectiveFees !== null) {
      return `of $${this.getFeePrices.futureEffectiveFees.toFixed(2)}`
    }
    return ''
  }

  onDeleteClicked (): void {
    this.$root.$emit('delete-all')
  }

  @Emit('haveChanges')
  emitHaveChanges (): void {}
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
