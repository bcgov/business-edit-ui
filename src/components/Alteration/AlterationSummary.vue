<template>
  <v-card
    id="alteration-summary"
    flat
  >
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <img
            class="my-n1 header-icon"
            src="@/assets/images/currency-usd-circle.svg"
          >
          <label class="summary-title">Alteration Notice Changes {{ alterationFees }}</label>
        </v-col>

        <!-- Actions -->
        <v-col
          cols="3"
          class="mt-n2"
        >
          <div class="actions mr-4">
            <v-btn
              id="btn-delete-alteration"
              variant="text"
              color="primary"
              :disabled="isBusySaving"
              @click="onDeleteClicked()"
            >
              <v-icon size="small">
                mdi-delete
              </v-icon>
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

          <v-col
            cols="8"
            class="mt-n1"
          >
            <div class="company-name font-weight-bold text-uppercase">
              {{ companyName }}
            </div>
            <div class="company-name mt-2">
              {{ getNameRequest.nrNumber }}
            </div>
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
            <span class="info-text">Changing from a {{ GetCorpFullDescription(originalLegalType) }}</span>
            &nbsp;
            <span class="info-text">to a {{ GetCorpFullDescription(getEntityType) }}</span>

            <p class="subtitle mt-2 pt-2">
              Benefit Company Articles
            </p>
            <div class="confirmed-msg">
              <v-icon
                color="success"
                class="confirmed-icon"
              >
                mdi-check
              </v-icon>
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
    <template v-if="haveNameTranslationsChanged">
      <v-divider class="mx-4" />
      <div class="name-translation-summary">
        <NameTranslation :isSummaryMode="true" />
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
        <ShareStructures
          class="mt-6"
          :is-edit-mode="false"
        />
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
              The company has resolved that the Pre-existing Company Provisions no longer apply to this company.
            </span>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Resolution or Court Order Dates -->
    <template v-if="haveNewResolutionDates">
      <v-divider class="mx-4" />
      <div class="section-container new-resolution-dates-summary">
        <ResolutionDates
          :added-dates="getNewResolutionDates"
          :previous-dates="getOriginalResolutions"
          :isEditMode="false"
        />
      </div>
    </template>

    <!-- Alteration Date and Time -->
    <div class="ma-6 pb-6">
      <v-container
        id="effective-date-time"
        class="alteration-date-time"
        :class="{ 'invalid': alterationDateTimeInvalid }"
      >
        <v-row no-gutters>
          <v-col
            cols="3"
            class="inner-col-1"
          >
            <label><strong>Alteration Date<br>and Time</strong></label>
          </v-col>

          <v-col
            cols="9"
            class="inner-col-2"
          >
            <p
              id="effective-date-time-instructions"
              class="info-text"
            >
              Select the date and time of alteration of your business. You may select a date and time up to 10 days in
              the future (note: there is an <strong>additional fee {{ futureEffectiveFeePrice }}</strong> to
              enter an alteration date and time in the future). Unless a business has special requirements, most
              businesses select an immediate Alteration Date and Time.
            </p>

            <EffectiveDateTime
              @dateTimeString="setEffectiveDateTimeString($event)"
              @isFutureEffective="setIsFutureEffective($event); emitHaveChanges()"
              @valid="setEffectiveDateValid($event)"
            />

            <v-card
              v-if="isFutureEffective && isEffectiveDateTimeValid"
              id="effective-date-text"
              flat
              class="px-16 pb-8 mt-n12"
            >
              The alteration for this business will be effective as of:<br>
              <strong>{{ effectiveDateTimeString }}</strong>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { ActionBindingIF, EffectiveDateTimeIF, FeesIF, FlagsReviewCertifyIF, ResolutionsIF }
  from '@/interfaces/'
import { DateMixin, FilingTemplateMixin, FeeMixin } from '@/mixins/'
import { EffectiveDateTime, NameTranslation, ShareStructures } from '@/components/common/'
import { ResolutionDates } from '@/components/Alteration/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { useStore } from '@/store/store'

@Component({
  components: {
    EffectiveDateTime,
    NameTranslation,
    ResolutionDates,
    ShareStructures
  },
  mixins: [DateMixin, FeeMixin, FilingTemplateMixin]
})
export default class AlterationSummary extends Vue {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  // Global getters
  @Getter(useStore) areProvisionsRemoved!: boolean
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getCurrentFees!: FeesIF[]
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getOriginalResolutions!: ResolutionsIF[]
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) haveNameTranslationsChanged!: boolean
  @Getter(useStore) haveNewResolutionDates!: boolean
  @Getter(useStore) isBusySaving!: boolean

  // Global actions
  @Action(useStore) setEffectiveDateValid!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop() readonly validate!: boolean

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
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  get originalLegalType (): string {
    return this.getEntitySnapshot?.businessInfo?.legalType
  }

  /** True if invalid class should be set for Alteration Date-Time container. */
  get alterationDateTimeInvalid (): boolean {
    return (this.validate && !this.getFlagsReviewCertify.isValidEffectiveDate)
  }

  /** Calculates the sum of alteration fees. */
  get alterationFees (): string {
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

  get futureEffectiveFeePrice (): string {
    const validFees = this.getFeePrices.filter(f => f.futureEffectiveFees !== null)
    if (validFees.length === 0) {
      return ''
    }
    /** Calculates the sum of future effective fees. */
    const futureEffectiveFeesSum = validFees.map(f => f.futureEffectiveFees).reduce((a, b) => a + b, 0)
    return `of $${futureEffectiveFeesSum.toFixed(2)}`
  }

  protected onDeleteClicked (): void {
    this.$root.$emit('delete-all')
  }

  @Emit('haveChanges')
  protected emitHaveChanges (): void {}
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
