
<template>
  <div id="special-resolution-signing-party">
    <div v-if="isSpecialResolutionFiling && isEditing">
      <!-- Resolution Signature -->
      <header id="resolution-signature-info-header">
        <h2>Resolution Signature</h2>
      </header>

      <p class="section-description mt-2">
        Enter the full name of the person who signed the special resolution and the date they signed it.
      </p>
    </div>
    <v-card
      id="resolution-signature-card"
      flat
      class="py-8"
    >
      <!-- Signing Party -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label
            :class="['resolution-signature-vcard-title', { 'invalid-label': !hasSigningData }]"
          >Signing Party</label>
        </v-col>
        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <div
            v-if="isEditing"
            class="form__row three-column"
          >
            <v-text-field
              id="person__first-name"
              v-model="signatory.givenName"
              filled
              class="item"
              label="First Name"
              :rules="firstNameRules"
            />
            <v-text-field
              id="person__middle-name"
              v-model="signatory.additionalName"
              filled
              class="item"
              label="Middle Name (Optional)"
              :rules="middleNameRules"
            />
            <v-text-field
              id="person__last-name"
              v-model="signatory.familyName"
              filled
              class="item"
              label="Last Name"
              :rules="lastNameRules"
            />
          </div>
          <span
            v-else
            class="info-text"
          >
            {{ signatory.givenName }} {{ signatory.additionalName }} {{ signatory.familyName }}
          </span>
        </v-col>
      </v-row>
      <!-- Date Signed -->
      <v-row
        no-gutters
        class="mt-8"
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label
            :class="['resolution-signature-vcard-title', { 'invalid-label': !isSignatureDateValid }]"
          >Date Signed</label>
        </v-col>
        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <DatePickerShared
            v-show="isEditing"
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
          <span
            v-show="!isEditing"
            class="info-text"
          >
            {{ signingDateLongPacificFormat }}
          </span>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF, PersonIF } from '@bcrs-shared-components/interfaces/'
import { VuetifyRuleFunction } from '@/types'
import { Component, Prop, Watch } from 'vue-property-decorator'
import DateUtilities from '@/services/date-utilities'

@Component({
  components: {
    DatePickerShared
  }
})
export default class SigningParty extends Vue {
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) isSpecialResolutionFiling: boolean

  @Action(useStore) setSpecialResolution!: (x: SpecialResolutionIF) => void
  @Action(useStore) setSpecialResolutionSignatureValid!: (x: boolean) => void

  @Prop({ default: false }) readonly isEditing!: boolean
  @Prop({ default: '' }) readonly changedResolutionDate!: string

  $refs!: {
    signatureDatePickerRef: DatePickerShared,
  }

  signingDate = ''
  signatory: PersonIF = {
    givenName: '',
    familyName: '',
    additionalName: ''
  }
  signingDateOriginal = '' // Used for undo for corrections.
  signatoryOriginal: PersonIF = null// Used for undo for corrections.
  hasSigningData = true
  isSignatureDateValid = true

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
  isValidDateRange (minDateStr: string, maxDateStr: string, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    const minDate = DateUtilities.yyyyMmDdToDate(minDateStr)
    const maxDate = DateUtilities.yyyyMmDdToDate(maxDateStr)
    // Input is in the format of MM dd, yyyy - only compare year/month/day (ignore time)
    const utcDateStr = new Date(dateStrToValidate + ' 00:00 UTC').toISOString().split('T')[0]
    const pstDate = DateUtilities.yyyyMmDdToDate(utcDateStr)
    return (pstDate >= minDate && pstDate <= maxDate)
  }

  /** The minimum signature date that can be entered (resolution date). */
  get signatureDateMin (): string {
    const dateToUse = (this.changedResolutionDate && this.changedResolutionDate.trim() !== '')
      ? this.changedResolutionDate
      : (this.getSpecialResolution.resolutionDate || this.getCurrentDate)

    return DateUtilities.dateToYyyyMmDd(DateUtilities.yyyyMmDdToDate(dateToUse))
  }

  /** The maximum signature date that can be entered (today). */
  get signatureDateMax (): string {
    return this.getCurrentDate
  }

  get signingDateLongPacificFormat (): string {
    return DateUtilities.yyyyMmDdToPacificDate(this.signingDate, true, false)
  }

  /** Validation rule for name. */
  signatureNameRules (label, isRequired = true): Array<VuetifyRuleFunction> {
    return [
      v => isRequired ? (!!v?.trim() || `${label} is required`) : true,
      v => v ? (v?.length <= 30) || 'Cannot exceed 30 characters' : true // maximum character count
    ]
  }

  /** called to add new signature date  */
  async onSigningDate (val: string): Promise<void> {
    this.signingDate = val
    if (this.getComponentValidate) {
      await this.onValidate()
    }
  }

  /** called to store signing party. */
  @Watch('signatory', { deep: true })
  async onSignatoryChanged (): Promise<void> {
    if (this.getComponentValidate) {
      await this.onValidate()
    }
  }

  /* Save event called from parent via ref. */
  async saveToStore (): Promise<void> {
    await this.setSpecialResolution({
      ...this.getSpecialResolution,
      signatory: this.signatory,
      signingDate: this.signingDate
    })
  }

  /* Undo event called from parent via ref. */
  async undoToStore (): Promise<void> {
    this.signatory = { ...this.signatoryOriginal }
    this.signingDate = this.signingDateOriginal
    await this.setSpecialResolution({
      ...this.getSpecialResolution,
      signatory: this.signatory,
      signingDate: this.signingDate
    })
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
    this.signatoryOriginal = { ...this.signatory }
    this.signingDate = this.getSpecialResolution.signingDate || ''
    this.signingDateOriginal = this.signingDate
  }

  /**
  * Sets the undo states when editing is enabled.
  */
  @Watch('isEditing')
  onIsEditingChange (val: boolean): void {
    if (!val) return
    this.signatoryOriginal = { ...this.signatory }
    this.signingDateOriginal = this.signingDate
  }

  /** Used to trigger validate from outside of component. */
  @Watch('getComponentValidate')
  async onValidate (includeIsEditing = true): Promise<void> {
    this.hasSigningData = !!this.signingDate && !!this.signatory.givenName && !!this.signatory.familyName
    this.$refs.signatureDatePickerRef.validateForm()
    this.isSignatureDateValid = this.$refs.signatureDatePickerRef.isDateValid()
    const isValid = this.hasSigningData && this.isSignatureDateValid && (!includeIsEditing || !this.isEditing)
    await this.setSpecialResolutionSignatureValid(isValid)
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
.invalid-label{
  color: $BCgovInputError !important;
}
</style>
