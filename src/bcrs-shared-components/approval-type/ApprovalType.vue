<template>
  <div id="approval-type">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label :class="{ 'error-text': invalidSection }">Approval Type</label>
      </v-col>
      <v-col
        cols="12"
        sm="9"
        class="mt-n4"
      >
        <v-radio-group
          v-model="approvalTypeSelected"
          class="payment-group pt-0"
          @update:model-value="radioButtonChanged"
        >
          <!-- COURT ORDER section -->
          <template v-if="!isCourtOrderRadio">
            <span class="v-label ml-2">{{ getRadioText(ApprovalTypes.VIA_COURT_ORDER) }}</span>
          </template>
          <template v-else>
            <v-radio
              id="court-order-radio"
              class="mb-0"
              :label="getRadioText(ApprovalTypes.VIA_COURT_ORDER)"
              :value="ApprovalTypes.VIA_COURT_ORDER"
            />
          </template>
          <v-form
            id="court-num-form"
            ref="courtNumRef"
            v-model="valid"
            class="mt-8 ml-2"
          >
            <v-expand-transition class="pb-0 mb-0">
              <v-text-field
                v-if="approvalTypeSelected === ApprovalTypes.VIA_COURT_ORDER"
                id="court-order-number-input"
                v-model="courtOrderNumberText"
                label="Court Order Number"
                :rules="courtOrderNumRules"
                hide-details="auto"
                variant="filled"
                @update:model-value="courtOrderNumberChanged"
                @update:error="emitValidationError($event)"
              />
            </v-expand-transition>
          </v-form>
          <!-- REGISTRAR section -->
          <v-radio
            v-if="!isCourtOrderOnly"
            id="registrar-radio"
            class="mb-n5 pt-2"
            :label="getRadioText(ApprovalTypes.VIA_REGISTRAR)"
            :value="ApprovalTypes.VIA_REGISTRAR"
          />
          <v-expand-transition>
            <div
              v-if="approvalTypeSelected === ApprovalTypes.VIA_REGISTRAR"
              flat
            >
              <div class="ml-8 mt-3">
                <span class="v-label">Enter the date the Notice of the Application for Restoration was published in
                  the BC Gazette:
                </span>
                <DatePicker
                  id="date-picker-notice"
                  ref="noticeDateRef"
                  class="mt-2"
                  title="Select Date"
                  :nudgeRight="150"
                  :initialValue="noticeDate"
                  :inputRules="datePickerRules"
                  @emitDateSync="noticeDateChanged($event)"
                />
              </div>
              <div class="ml-8">
                <span class="v-label">Enter the date the Application for Restoration was mailed to the company:</span>
                <DatePicker
                  id="date-picker-application"
                  ref="applicationDateRef"
                  class="mt-2"
                  title="Select Date"
                  :nudgeRight="150"
                  :initialValue="applicationDate"
                  :inputRules="datePickerRules"
                  @emitDateSync="applicationDateChanged($event)"
                />
              </div>
            </div>
          </v-expand-transition>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { ApprovalTypes } from '@/bcrs-shared-components/enums'
import { FormIF } from '@/bcrs-shared-components/interfaces'
import { DatePicker } from '@/bcrs-shared-components/date-picker'

@Component({
  components: {
    DatePicker
  }
})
export default class ApprovalType extends Vue {
  // Refs
  declare $refs: Vue['$refs'] & {
    courtNumRef: FormIF
  }

  /** Draft court order number. */
  @Prop({ default: '' }) readonly courtOrderNumber!: string

  /** Whether approved by the registrar. */
  @Prop({ default: false }) readonly approvedByRegistrar!: boolean

  /** filing name used in radio options. */
  @Prop({ default: 'restoration' }) readonly filingType!: string

  /** Show only the court order option; remove via registrar option. */
  @Prop({ default: false }) readonly isCourtOrderOnly!: boolean

  /** Draft notice date. */
  @Prop({ default: '' }) readonly noticeDate!: string

  /** Draft application date. */
  @Prop({ default: '' }) readonly applicationDate!: string

  /** Whether this section is invalid. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  /** Whether the display of court order section is a radio button. */
  @Prop({ default: true }) readonly isCourtOrderRadio!: boolean

  // Local properties
  private courtOrderNumberText = ''
  private valid = false
  private approvalTypeSelected = ''
  private noticeDateText = ''
  private applicationDateText = ''

  // For template
  readonly ApprovalTypes = ApprovalTypes

  // Date Picker Rules
  protected readonly datePickerRules = [(v: string) => !!v || 'Date is required']

  // Text Field Rules
  protected readonly courtOrderNumRules = [
    (v: string) => (!v || !/^\s/g.test(v)) || 'Invalid spaces', // leading spaces
    (v: string) => (!v || !/\s$/g.test(v)) || 'Invalid spaces', // trailing spaces
    (v: string) => (!v || !(v.length < 5)) || 'Court order number is invalid',
    (v: string) => (!v || !(v.length > 20)) || 'Court order number is invalid',
    (v: string) => !!v || 'A Court Order number is required'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // Copy props to mutable properties
    if (this.approvedByRegistrar) {
      this.courtOrderNumberText = ''
      this.approvalTypeSelected = ApprovalTypes.VIA_REGISTRAR
    } else if (this.courtOrderNumber) {
      this.courtOrderNumberText = this.courtOrderNumber
      this.approvalTypeSelected = ApprovalTypes.VIA_COURT_ORDER
    } else {
      // Default state (no button selected)
      this.radioButtonChanged('')
    }
    if (!this.isCourtOrderRadio) {
      this.approvalTypeSelected = ApprovalTypes.VIA_COURT_ORDER
    }
  }

  /** Triggers the form validation. */
  public validate (): boolean {
    if (this.approvalTypeSelected === ApprovalTypes.VIA_COURT_ORDER) {
      const status = this.$refs.courtNumRef.validate()
      this.$emit('valid', status)
      return status
    } else if (this.approvalTypeSelected === ApprovalTypes.VIA_REGISTRAR) {
      // Emit true (valid) if both dates were selected. Emit false (invalid) if at least one was empty.
      const status = (!!this.noticeDateText && !!this.applicationDateText)
      this.$emit('valid', status)
      return status
    } else {
      // Default state. Emit false (invalid).
      return false
    }
  }

  private emitValidationError (event: boolean): void {
    this.$emit('valid', !event)
  }

  // Emit the approval type (radio button selected).
  @Emit('radioButtonChange')
  private radioButtonChanged (event: string): void {
    if (event === ApprovalTypes.VIA_REGISTRAR) {
      this.courtOrderNumberText = ''
      this.courtOrderNumberChanged('')
    } else if (event === ApprovalTypes.VIA_COURT_ORDER) {
      this.noticeDateChanged('')
      this.applicationDateChanged('')
      this.$emit('valid', false)
    } else {
      // Default State.
      this.$emit('valid', false)
    }
  }

  // Emit the court number.
  @Emit('courtNumberChange')
  private courtOrderNumberChanged (event): void {
    this.validate()
  }

  private getRadioText (option: string): string {
    if (option === ApprovalTypes.VIA_COURT_ORDER && this.isCourtOrderRadio) {
      return `This ${this.filingType} is approved by court order.`
    } else if (option === ApprovalTypes.VIA_COURT_ORDER && !this.isCourtOrderRadio) {
      return 'Enter a Court Order number, as the restoration of this company was ordered by the court:'
    }
    if (option === ApprovalTypes.VIA_REGISTRAR) {
      return `This ${this.filingType} is approved by registrar.`
    }
    return '[error]'
  }

  /**
   * Emit the date the notice of the application for restoration was published in the BC Gazette.
   * Validate that a date was successfully selected.
   * @param noticeDate is the date that was selected (if any)
   */
  @Emit('update:noticeDate')
  private noticeDateChanged (noticeDate: string): string {
    this.noticeDateText = noticeDate
    this.validate()
    return noticeDate
  }

  /**
   * Emit the date the application for restoration was mailed to the company.
   * Validate that a date was successfully selected.
   * @param applicationDate is the date that was selected (if any)
   */
  @Emit('update:applicationDate')
  private applicationDateChanged (applicationDate: string): string {
    this.applicationDateText = applicationDate
    this.validate()
    return applicationDate
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep() {
  .v-card__actions {
    justify-content: flex-end;
  }

  .v-input .v-label {
    font-weight: normal;
    color: $gray7;
  }

  .theme--light.v-input input {
    font-weight: normal;
    color: $gray7;
  }
}
</style>
