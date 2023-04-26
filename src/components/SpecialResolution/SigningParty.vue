
<template>
  <div id="special-resolution-signature">
    <!-- Resolution Signature, can make this more generic later. -->
    <header id="resolution-signature-info-header">
      <h2>Resolution Signature</h2>
    </header>

    <p class="section-description mt-2">
      Enter the full name of the person who signed the special resolution and the date they signed it.
    </p>
    <v-card flat id="resolution-signature-card" class="py-8">
      <!-- Signing Party -->
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="resolution-signature-vcard-title">Signing Party</label>
        </v-col>
        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          <div class="form__row three-column">
            <v-text-field
              filled
              class="item"
              label="First Name"
              id="person__first-name"
              v-model="signatory.givenName"
              :rules="firstNameRules"
            />
            <v-text-field
              filled
              class="item"
              label="Middle Name (Optional)"
              id="person__middle-name"
              v-model="signatory.additionalName"
              :rules="middleNameRules"
            />
            <v-text-field
              filled
              class="item"
              label="Last Name"
              id="person__last-name"
              v-model="signatory.familyName"
              :rules="lastNameRules"
            />
          </div>
        </v-col>
      </v-row>
      <!-- Date Signed -->
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="resolution-signature-vcard-title">Date Signed</label>
        </v-col>
        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          <DatePickerShared
            ref="signatureDatePickerRef"
            title="Date Signed"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="signingDate"
            :minDate="signatureDateMin"
            :maxDate="signatureDateMax"
            :inputRules="dateRules"
            @emitDate="onSigningDate($event)"
            @emitCancel="onSigningDate($event)"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF } from '@/interfaces/'
import { useStore } from '@/store/store'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF, PersonIF } from '@bcrs-shared-components/interfaces/'
import { VuetifyRuleFunction } from '@/types'
import { Component, Watch, Prop } from 'vue-property-decorator'
import DateUtilities from '@/services/date-utilities'

@Component({
  components: {
    DatePickerShared
  }
})
export default class SigningParty extends Vue {
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) getSpecialResolutionFormValid!: boolean
  @Getter(useStore) getSpecialResolutionSignatureValid!: boolean

  @Action(useStore) setSpecialResolution!: ActionBindingIF
  @Action(useStore) setResolutionSignatureValid!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  // Refs
  $refs!: {
    signatureDatePickerRef: DatePickerShared,
  }

  protected signingDate = ''
  protected signatory: PersonIF = {
    givenName: '',
    familyName: '',
    additionalName: ''
  }

  /** Validation rule for individual name fields */
  readonly firstNameRules = this.signatureNameRules('First Name')
  readonly middleNameRules = this.signatureNameRules('Middle Name', false)
  readonly lastNameRules = this.signatureNameRules('Last Name')

  /** Validations rules for signing date field. */
  get dateRules (): Array<VuetifyRuleFunction> {
    return [
      (v: string) => !!v || 'Signature date is required',
      (v: string) =>
        this.isValidDateRange(this.signatureDateMin,
          this.signatureDateMax,
          v) ||
        `Date should be between ${DateUtilities.yyyyMmDdToPacificDate(this.signatureDateMin, true)} and
         ${DateUtilities.yyyyMmDdToPacificDate(this.signatureDateMax, true)}`
    ]
  }

  /**
   * True if date is >= the minimum (ie, today) and <= the maximum (ie, the 10th day).
   * This is used for Vue form validation (in Date Rules above).
   */
  private isValidDateRange (minDateStr: string, maxDateStr: string, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    const minDate = DateUtilities.yyyyMmDdToDate(minDateStr)
    const maxDate = DateUtilities.yyyyMmDdToDate(maxDateStr)
    // Input is in the format of MM dd, yyyy - only compare year/month/day (ignore time)
    const utcDateStr = new Date(dateStrToValidate + ' 00:00 UTC').toISOString().split('T')[0]
    const pstDate = DateUtilities.yyyyMmDdToDate(utcDateStr)
    return (pstDate >= minDate && pstDate <= maxDate)
  }

  /** The minimum signature date that can be entered (resolution date or today). */
  get signatureDateMin (): string {
    if (this.getSpecialResolution.resolutionDate) {
      return DateUtilities.dateToYyyyMmDd(DateUtilities.apiToDate(this.getSpecialResolution.resolutionDate))
    } else {
      return this.getCurrentDate
    }
  }

  /** The maximum signature date that can be entered (today). */
  get signatureDateMax (): string {
    return this.getCurrentDate
  }

  /** Validation rule for name. */
  private signatureNameRules (label, isRequired = true): Array<VuetifyRuleFunction> {
    return [
      v => isRequired ? (!!v?.trim() || `${label} is required`) : true,
      v => v ? (v?.length <= 30) || 'Cannot exceed 30 characters' : true // maximum character count
    ]
  }

  /** called to add new signature date  */
  async onSigningDate (val: string): Promise<void> {
    this.signingDate = val
    this.setSpecialResolution({
      ...this.getSpecialResolution,
      signingDate: val
    })
    // wait for store update
    await this.$nextTick()
    if (this.validate) {
      await this.onValidate(true)
    }
  }

  /** called to store signing party. */
  @Watch('signatory', { deep: true })
  private async onSignatoryChanged (): Promise<void> {
    this.setSpecialResolution({
      ...this.getSpecialResolution,
      signatory: this.signatory
    })
    // wait for store update
    await this.$nextTick()
    if (this.validate) {
      await this.onValidate(true)
    }
  }

  /**
  * Called when component is created.
  * While coming back from summary page, this form need to show existing values.
  * Note: The data is loaded before the component is created.
  */
  created () {
    this.signatory = this.getSpecialResolution.signatory ||
      {
        givenName: '',
        familyName: '',
        additionalName: ''
      }
    this.signingDate = this.getSpecialResolution.signingDate || ''
  }

  /** Used to trigger validate from outside of component. */
  @Watch('validate')
  private async onValidate (val: boolean): Promise<void> {
    const hasSigningData = !!this.signingDate && !!this.signatory.givenName && !!this.signatory.familyName
    await this.$refs?.signatureDatePickerRef?.validateForm()
    const isSignatureDateValid = this.$refs?.signatureDatePickerRef?.isDateValid()
    this.setResolutionSignatureValid(hasSigningData && isSignatureDateValid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// Form Row Elements
.form__row.three-column {
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  margin-left: -0.5rem;
  margin-right: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
</style>
