<template>
  <v-card flat id="alteration-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <v-icon color="primary">mdi-file-document-edit-outline</v-icon>
          <label class="summary-title">Summary of Changes to File</label>
        </v-col>

        <!-- Actions -->
        <v-col cols="3" class="mt-n2">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-change-alteration"
              :disabled="isBusySaving"
              @click="onChangeClicked()"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
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
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import {
  ActionBindingIF,
  EffectiveDateTimeIF,
  EntitySnapshotIF,
  NameRequestIF,
  ShareClassIF,
  ShareStructureIF,
  FlagsReviewCertifyIF,
  NameTranslationIF,
  FeesIF
} from '@/interfaces'
import { DateMixin, EnumMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins'
import { CorpTypeCd } from '@/enums'
import { ResolutionDates } from '@/components/Edit'
import { EffectiveDateTime, NameTranslation, ShareStructures } from '@/components/common'

@Component({
  components: {
    EffectiveDateTime,
    ResolutionDates,
    ShareStructures,
    NameTranslation
  }
})
export default class ChangeSummary extends Mixins(
  DateMixin,
  EnumMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getCurrentJsDate!: Date
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequest!: NameRequestIF
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getSnapshotShareStructure!: ShareStructureIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getNewResolutionDates!: string[]
  @Getter getPreviousResolutionDates!: string[]
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getCurrentFees!: FeesIF
  @Getter getProvisionsRemoved!: boolean
  @Getter isBusySaving!: boolean
  @Getter getFeePrices!: FeesIF

  // Alteration flag getters
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter hasNameTranslationChanged!: boolean
  @Getter hasShareStructureChanged!: boolean
  @Getter hasNewResolutionDatesChanged!: boolean

  // Global actions
  @Action setSummaryMode!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setEffectiveDateValid!: ActionBindingIF

  /** Prop to perform validation. */
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
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  get originalEntityType (): string {
    return this.getEntitySnapshot?.businessInfo?.legalType
  }

  /** True if invalid class should be set for Alteration Date-Time container. */
  get alterationDateTimeInvalid (): boolean {
    return (this.validate && !this.getFlagsReviewCertify.isValidEffectiveDate)
  }

  async onChangeClicked (): Promise<void> {
    this.setSummaryMode(false)
    // We don't change views just interchange components, so scroll to top for better UX.
    await this.scrollToTop(document.getElementById('app'))
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
