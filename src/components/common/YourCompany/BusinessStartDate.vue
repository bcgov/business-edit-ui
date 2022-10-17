<template>
  <section id="business-start-date">
    <v-row no-gutters>
      <v-col cols="3" class="pr-2">
        <label :class="{'error-text': invalidSection}">
          <strong>Business Start Date</strong>
        </label>
        <v-chip
          v-if="isCorrected"
          x-small label
          color="primary"
          text-color="white"
        >
          <span>{{ editedLabel }}</span>
        </v-chip>
      </v-col>

      <v-col cols="9">
        <!-- display mode -->
        <span v-if="!onEditMode" class="info-text mr-1">{{ businessStartDate }}</span>

        <!-- edit mode -->
        <template v-if="onEditMode">
          <div cols="12" sm="3" class="pr-4">
            <label class="start-date-title title-label">Start Date</label>
            <p class="mt-4">
              Enter the start date of the business. The start date can be
              <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="tool-tip dotted-underline">up to 2 years before the Registration Date</span>
                </template>
                <span>Choose the oldest date possible even if the actual start date is older than 2 years before
                  the Registration Date.</span>
              </v-tooltip>
              and up 90 days after the Registration Date. Make certain that this is the correct date as it cannot be
              easily corrected afterwards.
            </p>
            <DatePickerShared
              title="Start Date"
              nudge-right="80"
              nudge-top="15"
              :minDate="minDate"
              :maxDate="maxDate"
              :editLabel="editLabel"
              :editedLabel="editedLabel"
              @emitDate="onOkClicked($event)"
            />
          </div>

          <!-- inner buttons -->
          <div class="float-right mb-2">
            <v-btn large color="primary" id="start-done-btn" class="mr-2" @click="onDoneClicked()">
              <span>Done</span>
            </v-btn>
            <v-btn large outlined color="primary" id="start-cancel-btn" @click="onCancelClicked()">
              <span>Cancel</span>
            </v-btn>
          </div>
        </template>

        <!-- outer buttons -->
        <span v-if="isApplicableFiling" class="my-n2 mr-n3 float-right">
          <!-- Correct Changes button -->
          <v-btn v-if="!onEditMode && !isCorrected" text color="primary"
            id="start-changes-btn" @click="onChangeClicked()"
          >
            <v-icon small color="primary">mdi-pencil</v-icon>
            <span>{{ editLabel }}</span>
          </v-btn>

          <!-- Undo Changes buttons -->
          <v-btn v-if="!onEditMode && isCorrected" text color="primary"
            id="start-undo-btn" @click="onUndoClicked()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>

          <!-- Drop-down menu and More Changes button -->
          <v-menu v-if="!onEditMode && isCorrected"
            offset-y left nudge-bottom="4" v-model="dropdown">
            <template v-slot:activator="{ on }">
              <v-btn text small color="primary" id="start-menu-btn" v-on="on">
                <v-icon id="start-menu">{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
              </v-btn>
            </template>
            <v-btn text color="primary" id="more-changes-btn" @click="onChangeClicked(); dropdown = false">
              <v-icon small color="primary">mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
          </v-menu>
        </span>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { CommonMixin, DateMixin } from '@/mixins/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { ActionBindingIF } from '@/interfaces'

@Component({
  components: {
    DatePickerShared
  }
})
export default class StartDate extends Mixins(CommonMixin, DateMixin) {
  // Global getters
  @Getter isFirmCorrectionFiling!: boolean
  @Getter hasBusinessStartDateChanged!: boolean
  @Getter getCorrectionStartDate!: string
  @Getter getBusinessFoundingDateTime!: string
  @Getter getBusinessStartDate!: string
  @Getter getCurrentJsDate!: Date
  @Getter isFirmConversionFiling!: boolean

  // Global setter
  @Action setCorrectionStartDate!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  protected dropdown = false
  protected onEditMode = false
  protected isCorrected: boolean = null
  protected newCorrectedStartDate: string = null // date is "Month Day, Year"

  get isApplicableFiling (): boolean {
    // can change Business Start Date in firm corrections and firm conversions only
    return (this.isFirmCorrectionFiling || this.isFirmConversionFiling)
  }

  /** The minimum start date that can be entered (up to 2 years before reg date). */
  get minDate (): string {
    // no min date for conversion
    if (this.isFirmConversionFiling) return null

    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    date.setFullYear(date.getUTCFullYear() - 2)
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum start date that can be entered (up to 90 days after reg date). */
  get maxDate (): string {
    // no max date for conversion
    if (this.isFirmConversionFiling) return null

    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    date.setDate(date.getUTCDate() + 90)
    return this.dateToYyyyMmDd(date)
  }

  /** The business date or business start date string. */
  get businessStartDate (): string {
    if (this.hasBusinessStartDateChanged) {
      // set the Corrected flag when reloading from a saved filing
      this.isCorrected = true
      return this.yyyyMmDdToPacificDate(this.getCorrectionStartDate, true)
    }
    if (this.getBusinessStartDate) {
      return this.yyyyMmDdToPacificDate(this.getBusinessStartDate, true)
    }
    return '(Not entered)'
  }

  /** Whether this component is valid. */
  get isValid (): boolean {
    return (!this.onEditMode && (!!this.getCorrectionStartDate || !!this.getBusinessStartDate))
  }

  protected onChangeClicked (): void {
    this.onEditMode = true
  }

  /** Called to add a new date. */
  protected onOkClicked (date: string): void {
    if (date) {
      this.newCorrectedStartDate = date
    }
  }

  protected onDoneClicked (): void {
    if (this.newCorrectedStartDate) {
      // For firms only the date is valid
      if (this.newCorrectedStartDate !== this.getBusinessStartDate) {
        this.setCorrectionStartDate(this.newCorrectedStartDate)
        this.isCorrected = true
      } else {
        this.newCorrectedStartDate = null
      }
    }
    this.onEditMode = false
  }

  protected onCancelClicked (): void {
    this.onEditMode = false
  }

  protected onUndoClicked (): void {
    this.setCorrectionStartDate(null)
    this.newCorrectedStartDate = null
    this.isCorrected = false
  }

  @Watch('isValid', { immediate: true })
  private syncValidity (): void {
    this.setValidComponent({ key: 'isValidStartDate', value: this.isValid })
  }
}
</script>

<style lang="scss" scoped>
.dotted-underline {
  border-bottom: 1px dotted;
}
</style>
