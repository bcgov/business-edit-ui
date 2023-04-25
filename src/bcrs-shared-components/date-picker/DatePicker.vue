<template>
  <v-form :attach="attach" ref="form" class="date-picker-form">
    <v-menu v-model="displayPicker"
            :close-on-click="false"
            :close-on-content-click="false"
            :nudge-top="nudgeTop"
            :nudge-bottom="nudgeBottom"
            :nudge-left="nudgeLeft"
            :nudge-right="nudgeRight"
            transition="scale-transition"
            offset-y
            bottom
            min-width="290"
    >
      <template v-slot:activator="{ on }">
        <span :class="{'date-text-field-pointer': enableSelector}" v-on="enableSelector && on">
          <v-text-field id="date-text-field"
                        ref="dateTextField"
                        append-icon="mdi-calendar"
                        autocomplete="chrome-off"
                        :clearable="clearable"
                        :error-messages="errorMsg"
                        :error="!!errorMsg"
                        :value="displayDate"
                        :label="title"
                        :name="Math.random().toString()"
                        :rules="inputRules"
                        :disabled="disablePicker"
                        :hint="hint"
                        :persistent-hint="persistentHint"
                        @click:clear="emitClear()"
                        @keydown="$event.preventDefault()"
                        @keyup.enter="emitDate(dateText)"
                        readonly
                        filled
          />
        </span>
      </template>
      <v-date-picker id="date-picker-calendar" width="490" v-model="dateText" :min="minDate" :max="maxDate">
        <template v-slot:default>
          <div>
            <v-btn id="btn-done" text color="primary" @click="emitDate(dateText)"><strong>OK</strong></v-btn>
            <v-btn id="btn-cancel" text color="primary" @click="emitCancel()">Cancel</v-btn>
          </div>
        </template>
      </v-date-picker>
    </v-menu>
  </v-form>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { FormIF } from '@/bcrs-shared-components/interfaces'
import { DateMixin } from '@/mixins' // NB: local mixin (StoryBook can't find it otherwise)

@Component({
  mixins: [DateMixin]
})
export default class DatePicker extends Vue {
  // Add element types to refs
  declare $refs: Vue['$refs'] & {
    form: FormIF,
    dateTextField: FormIF
  }

  @Prop({ default: null }) readonly attach!: string
  @Prop({ default: '' }) readonly title!: string
  @Prop({ default: null }) readonly errorMsg!: string
  @Prop({ default: () => [] }) readonly inputRules!: Array<(v) => boolean | string>
  @Prop({ default: false }) readonly disablePicker!: boolean
  @Prop({ default: '' }) readonly initialValue!: string
  @Prop({ default: '' }) readonly minDate!: string
  @Prop({ default: '' }) readonly maxDate!: string
  @Prop({ default: null }) readonly nudgeTop!: number
  @Prop({ default: null }) readonly nudgeBottom!: number
  @Prop({ default: null }) readonly nudgeRight!: number
  @Prop({ default: null }) readonly nudgeLeft!: number
  @Prop({ default: '' }) readonly hint!: string
  @Prop({ default: false }) readonly persistentHint!: boolean
  @Prop({ default: false }) readonly clearable!: boolean

  private dateText = null
  private displayPicker = false

  /** Clear local model after each action. */
  public clearDate (): void {
    this.dateText = ''
    this.displayPicker = false
  }

  /** Triggers the form validation. */
  public validateForm (): boolean {
    return this.$refs.form.validate()
  }

  /** Returns whether date validation passes. */
  public isDateValid (): boolean {
    return this.$refs?.dateTextField?.valid
  }

  /** Called when component is created. */
  created (): void {
    this.dateText = this.initialValue
  }

  /** The display Date. */
  get displayDate (): string {
    return this.yyyyMmDdToPacificDate(this.dateText, true)
  }

  /** True when the picker is not displayed or disabled. */
  get enableSelector (): boolean {
    return !this.displayPicker && !this.disablePicker
  }

  /** Emit date to add or remove. */
  @Emit('emitDate')
  protected emitDate (date: string): void { this.displayPicker = false }

  /** Emit cancel event and clear the date. */
  @Emit('emitCancel')
  protected emitCancel (): void { this.clearDate() }

  /** Emit clear event and clear the date. */
  @Emit('emitClear')
  protected emitClear (): void { this.clearDate() }

  @Watch('dateText')
  @Emit('emitDateSync')
  private emitDateSync (date: string): string { return this.dateText }

  @Watch('$route')
  private hidePicker (): void {
    this.displayPicker = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.date-text-field-pointer {
  cursor: pointer;

  // disable pointer events when disabled
  .v-text-field.v-input--is-disabled {
    pointer-events: none;
  }

  // enable pointer events when enabled
  .v-text-field:not(.v-input--is-disabled) {
    pointer-events: auto;
  }
}

:deep() {
  .v-card__actions {
    justify-content: flex-end;
  }

  .v-input .v-label {
    font-weight: normal;
    color: $gray7;
  }

  // hide disabled prev/next month arrow
  .v-date-picker-header .v-btn--disabled {
    display: none;
  }

  .v-picker__title__btn:not(.v-picker__title__btn--active) {
    opacity: 1;
  }

  .v-date-picker-table__current {
    border-color: $app-blue !important;
  }

  .v-date-picker-table__current .v-btn__content{
    color: $app-blue !important;
  }

  .theme--light.v-date-picker-table th {
    color: $gray9;
  }

  .v-date-picker-table .v-btn {
    color: $gray7;
  }

  .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: $app-blue !important;
    border-color: $app-blue !important;
    color: white !important;
  }

  .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
    opacity: 0;
  }

  .v-icon.v-icon.v-icon--link {
    cursor: text;
  }

  .v-icon.v-icon.v-icon--link.mdi-close {
    cursor: pointer;
  }

  .theme--light.v-icon.v-icon.v-icon--disabled {
    color: $app-blue !important;
  }

  .v-input--is-disabled {
    opacity: 0.4;
  }

  .theme--light.v-text-field.v-input--is-disabled .v-input__slot:before {
    border-image: none;
  }

  .v-text-field.v-input--is-readonly .v-input__slot:before {
    border-style: solid !important;
  }
}
</style>
