<template>
  <v-card flat id="alteration-summary" v-if="isSummaryMode">

    <confirm-dialog
      ref="confirm"
      attach="#app"
    />

    <!-- Section Header -->
    <div class="summary-header">
      <v-layout row class="mx-0">
        <v-flex xs9>
          <img  class="my-n1" src="@/assets/images/currency-usd-circle.svg">
          <label class="summary-title">Alteration Notice Changes ($100.00 Fee)</label>
        </v-flex>

        <!-- Actions -->
        <v-flex xs3 class="mt-n2">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-change-alteration"
              @click="setSummaryMode(false)"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
            <v-btn
              text color="primary"
              id="btn-delete-alteration"
              @click="restoreOriginalSnapshot()"
            >
              <v-icon small>mdi-delete</v-icon>
              <span>Remove</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </div>

    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <div class="section-container business-name-summary">
        <v-layout row class="mx-0 mt-4">
          <v-flex xs3>
            <v-layout column>
              <label><strong>Company Name</strong></label>
            </v-layout>
          </v-flex>

          <v-flex xs8 class="mt-n1">
            <div class="company-name font-weight-bold">{{ companyName }}</div>
            <div class="company-name">{{ getNameRequest.nrNumber }}</div>
          </v-flex>
        </v-layout>
      </div>
      <v-divider v-if="hasBusinessTypeChanged" class="mx-4" />
    </template>

    <!-- Business Type -->
    <template v-if="hasBusinessTypeChanged">
      <div class="section-container business-type-summary">
        <v-layout row class="mx-0 mt-4">
          <v-flex xs3>
            <label><strong>Business Type</strong></label>
          </v-flex>

          <v-flex xs8>
            <template>
              <span class="info-text">
                Changing from a {{ getEntityDesc(originalEntityType) }} to a {{getEntityDesc(getEntityType)}}
              </span>
              <template>
                <p class="subtitle mt-2 pt-2">Benefit Company Articles</p>
                <div class="confirmed-msg">
                  <v-icon color="success" class="confirmed-icon">mdi-check</v-icon>
                  <span class="info-text text-body-3 confirmed-icon ml-2">
                    The company has completed a set Benefit Company Articles containing a benefit provision, and a copy
                    of these articles has been added to the company's record book.
                  </span>
                </div>
              </template>
            </template>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <!-- TODO: Name Translation -->

    <!-- TODO: Pre-existing Company Provisions -->

    <!-- TODO: Share Structure -->

    <!-- Alteration Date and Time -->
    <div class="ma-6 pb-6">
      <v-container class="alteration-date-time" :class="{ 'invalid': alterationDateTimeInvalid }">
        <v-row no-gutters>
          <v-col cols="3" class="pr-4">
            <label><strong>Alteration Date and Time</strong></label>
          </v-col>

          <v-col cols="9" class="pl-4">
            <p class="info-text">Select the date and time of alteration of your business. You may select a date and
              time up to 10 days in the future (note: there is an <strong>additional fee of $100.00</strong> to enter
              an alteration date and time in the future). Unless a business has special requirements, most businesses
              select an immediate Alteration Date and Time.
            </p>

            <effective-date-time
              :currentJsDate="getCurrentJsDate"
              :effectiveDateTime="getEffectiveDateTime"
              @dateTimeString="setEffectiveDateTimeString($event)"
              @isFutureEffective="setIsFutureEffective($event)"
              @valid="setEffectiveDateValid($event)"
            />

            <v-card flat class="px-16 pb-8 mt-n12" v-if="isFutureEffective && isEffectiveDateTimeValid">
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
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ConfirmDialog } from '@/components/dialogs'
import { ActionBindingIF, ConfirmDialogType, EffectiveDateTimeIF, NameRequestIF } from '@/interfaces'
import { CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { EntityTypes } from '@/enums'
import { EffectiveDateTime } from '@/components/common'

@Component({
  components: {
    ConfirmDialog,
    EffectiveDateTime
  }
})
export default class AlterationSummary extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global Getters
  @Getter getCurrentJsDate!: Date
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: EntityTypes
  @Getter isSummaryMode!: boolean
  @Getter getNameRequest!: NameRequestIF
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  // Alteration Flag Getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean

  // Actions
  @Action setSummaryMode!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setEffectiveDateValid!: ActionBindingIF

  /** Prop to perform validation. */
  @Prop() readonly pleaseValidate: boolean

  private get isFutureEffective (): boolean {
    return this.getEffectiveDateTime.isFutureEffective
  }

  private get isEffectiveDateTimeValid (): boolean {
    return this.getEffectiveDateTime.valid
  }

  private get effectiveDateTimeString (): string {
    const date = new Date(this.getEffectiveDateTime.dateTimeString)
    return this.fullFormatDate(date)
  }

  /** The company name (from NR, or incorporation number). */
  private get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  private get originalEntityType (): string {
    return this.getOriginalSnapshot[0]?.business?.legalType
  }

  /** True if invalid class should be set for Alteration Date-Time container. */
  private get alterationDateTimeInvalid (): boolean {
    return (this.pleaseValidate && !this.getEffectiveDateTime.valid)
  }

  private restoreOriginalSnapshot (): void {
    // open confirmation dialog and wait for response
    this.$refs.confirm.open(
      'Remove Alteration',
      'All changes to your company information will be removed.',
      {
        width: '45rem',
        persistent: true,
        yes: 'Remove Alteration',
        no: null,
        cancel: 'Cancel'
      }
    ).then(() => {
      // Restore original data
      this.parseBusinessSnapshot()
      this.setSummaryMode(false)
    }).catch(async () => {
      // if we get here, no was clicked
      // nothing to do
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.25rem 1rem;

  .sub-section {
    margin-top: 1.5rem;
  }
}

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
</style>
