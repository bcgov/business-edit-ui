<template id="limited-restoration-panel">
  <v-radio-group class="mt-0 pt-0 ml-8" v-model="selectMonths" mandatory>
    <v-radio class="radio-button pt-2" id="twentyFour-radio" name="selectMonths" label="2 years" :value=24 />
    <v-radio class="radio-button pt-2" id="eighteen-radio" name="selectMonths" label="18 months" :value=18 />
    <v-radio class="radio-button pt-2" id="twelve-radio" name="selectMonths" label="12 months" :value=12 />
    <v-radio class="radio-button pt-2" id="six-radio" name="selectMonths" label="6 months" :value=6 />
    <v-row class="ml-0 mt-0 radio-button pt-2">
      <v-radio class="mt-n4" id="custom-months" name="selectMonths" value="customMonths" />
      <v-form ref="monthsRef">
        <v-text-field
          id="months-text-field"
          class="number-months-field"
          type="number"
          dense
          hide-spin-buttons
          :rules="monthRules"
          v-model="numberOfMonths"
          :disabled="!customMonths"
          @change="onMonthsChanged"
          filled />
      </v-form>
      <div class="ml-2 mt-2 month-text">month(s)</div>
    </v-row>
  </v-radio-group>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { DateMixin } from '@/mixins' // NB: local mixin (StoryBook can't find it otherwise)
import { FormIF } from '@/bcrs-shared-components/interfaces'

@Component({
  mixins: [DateMixin]
})
export default class LimitedRestorationPanel extends Vue {
  // Refs
  declare $refs: Vue['$refs'] & {
    monthsRef: FormIF
  }

  @Prop({ default: '' }) readonly currentDate!: string

  @Prop({ default: '' }) readonly expiryDate!: string

  @Prop({ default: 24 }) readonly maxNumberOfMonths!: number

  // Local properties
  private customMonths = ''
  private selectMonths = ''
  private numberOfMonths: number = null
  private monthRules: ((data: string) => void)[] = []

  /**
   * Called when the component is mounted.
   * Auto select the previous months input of user (if any).
   * If there is no previous input, auto select 24 months.
   */
  mounted (): void {
    this.setMonthRules()
    const draftMonths = this.subtractDates(this.currentDate, this.expiryDate)
    if (draftMonths !== 24 && draftMonths !== 18 && draftMonths !== 12 && draftMonths !== 6) {
      this.selectMonths = 'customMonths'
      this.numberOfMonths = draftMonths
      this.setCustomMonths(this.numberOfMonths)
      // Emit validation on load
      if (this.numberOfMonths > this.maxNumberOfMonths || this.numberOfMonths < 1) {
        this.monthsValid(false)
      }
    } else {
      this.selectMonths = draftMonths
    }
  }

  /** The validation rules for the Month. */
  private setMonthRules (): void {
    this.monthRules = [
      (v:string) => !!v || 'Must be between 1 to ' + this.maxNumberOfMonths,
      (v:string) => (v > 0 && v <= this.maxNumberOfMonths) || 'Must be between 1 to ' + this.maxNumberOfMonths,
      (v:string) => (v % 1 === 0) || 'Must be between 1 to ' + this.maxNumberOfMonths // Check if month is an integer
    ]
  }

  // Emit the expiry date.
  @Emit('expiry')
  private expiryChanged (event: string): string {
    return event
  }

  // Emit a boolean whether the number of months selected is valid.
  @Emit('valid')
  private monthsValid (event: boolean): boolean {
    return event
  }

  /**
   * Set restoration expiry date by adding the custom number of months (1-24) input by user to current date.
   * Prevent the user from selecting values above 24, lower than 1, and decimals.
   */
  onMonthsChanged (): void {
    // Trigger form validation.
    let status = this.$refs.monthsRef.validate()
    this.monthsValid(status)
    this.expiryChanged(this.addMonthsToDate(Number(this.numberOfMonths), this.currentDate))
  }

  /**
   * Set if custom number of months is selected.
   * Set expiry date by adding the value of the selected radio buttons to current date.
   * @param val The value of the selected radio button
   */
   @Watch('selectMonths')
  private setCustomMonths (val) {
    this.customMonths = val === 'customMonths'
    if (val !== 'customMonths') {
      // Clear text field when another radio button is selected
      if (this.selectMonths !== 'customMonths') {
        this.numberOfMonths = null
        this.$refs.monthsRef.reset()
      }
      this.monthsValid(true)
      this.expiryChanged(this.addMonthsToDate(val, this.currentDate))
    } else {
      if (!this.numberOfMonths) {
        this.numberOfMonths = ''
      }
      this.expiryChanged(this.addMonthsToDate(this.numberOfMonths, this.currentDate))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.month-text {
  color: $gray7;
}

:deep() {
  /** Change border style to solid before the selection of the radio button. */
  .theme--light.v-text-field.v-input--is-disabled .v-input__slot:before {
    border-image: none;
  }

  /**
  * Decreasing the month(s) text field's width.
  * Disabling the reactivity of the month(s) text field width with the error text.
  */
  .number-months-field {
    width: 3.5rem;
    .error--text {
      margin-left: -0.5rem;
      position: absolute;
      width: 10rem;
    }
  }
}
</style>
