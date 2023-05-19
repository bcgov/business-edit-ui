<template id="limited-restoration-panel">
  <v-radio-group
    v-model="radioValue"
    class="mt-0 pt-0 ml-8"
    mandatory
  >
    <v-radio
      id="radio-24"
      class="radio-button pt-2"
      name="radioValue"
      label="2 years"
      value="24"
    />
    <v-radio
      id="radio-18"
      class="radio-button pt-2"
      name="radioValue"
      label="18 months"
      value="18"
    />
    <v-radio
      id="radio-12"
      class="radio-button pt-2"
      name="radioValue"
      label="12 months"
      value="12"
    />
    <v-radio
      id="radio-6"
      class="radio-button pt-2"
      name="radioValue"
      label="6 months"
      value="6"
    />
    <v-row class="ml-0 mt-0 radio-button pt-2">
      <v-radio
        id="radio-custom"
        class="mt-n4"
        name="radioValue"
        value="customMonths"
      />
      <v-form ref="monthsRef">
        <v-text-field
          id="text-field-months"
          v-model="inputValue"
          class="text-field-months"
          type="number"
          dense
          filled
          hide-spin-buttons
          :rules="monthsRules"
          :disabled="(radioValue !== 'customMonths')"
          @input="onMonthsInput($event)"
        />
      </v-form>
      <span class="ml-2 mt-2 month-text">month(s)</span>
    </v-row>
  </v-radio-group>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { FormIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class LimitedRestorationPanel extends Vue {
  // Refs
  $refs!: Vue['$refs'] & {
    monthsRef: FormIF
  }

  @Prop({ required: true }) readonly months!: number
  @Prop({ default: 24 }) readonly maxNumberOfMonths!: number

  // Local properties
  radioValue = '' // v-model for radio buttons
  inputValue = '' // v-model for months text field

  /**
   * The validation rules for months input.
   */
  get monthsRules (): Array<(v: string) => boolean | string> {
    return [
      (v) => (+v > 0 && +v <= this.maxNumberOfMonths) || 'Must be between 1 and ' + this.maxNumberOfMonths,
      (v) => (+v % 1 === 0) || 'Must be a whole number'
    ]
  }

  /**
   * Called when the component is mounted.
   * Sets the initial radio button and months input (if applicable).
   */
  mounted (): void {
    if ([24, 18, 12, 6].includes(this.months)) {
      this.radioValue = this.months.toString()
    } else {
      this.radioValue = 'customMonths'
      this.inputValue = this.months.toString()
    }
  }

  /**
   * Emits the numbed of months selected.
   */
  @Emit('months')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitMonths (months: number): void {}

  /**
   * Emits whether the number of months selected is valid.
   */
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitValid (valid: boolean): void {}

  /**
   * Called when months input has changed.
   */
  onMonthsInput (input: string): void {
    // ignore non-inputs
    if (input !== null) {
      // validate the input
      const valid = this.$refs.monthsRef.validate()
      // emit validity
      this.emitValid(valid)
      // if valid, emit new value
      if (valid) this.emitMonths(Number(this.inputValue))
    }
  }

  /**
   * Called when radio button has changed.
   */
  @Watch('radioValue')
  private onSelectMonthsChanged () {
    if (this.radioValue !== 'customMonths') {
      // reset months text field when another radio button is selected
      this.$refs.monthsRef.reset()
      // emit months and validity
      this.emitMonths(Number(this.radioValue))
      this.emitValid(true)
    } else {
      // leave blank and set invalid initially
      this.emitValid(false)
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
  // change border style to solid before the selection of the radio button
  .theme--light.v-text-field.v-input--is-disabled .v-input__slot:before {
    border-image: none;
  }

  // decrease the month text field's width
  .text-field-months {
    width: 3.5rem;
    .error--text {
      margin-left: -0.5rem;
      position: absolute;
      width: 10rem;
    }
  }
}
</style>
