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

      <!-- Info tooltip-->
      <v-col cols="9">
        <span v-if="!onEditMode" class="info-text mr-1">{{ businessStartDate }}</span>
        <v-tooltip v-if="isFirmChangeFiling || isFirmConversionFiling"
                    top
                    content-class="top-tooltip"
                    transition="fade-transition"
                    nudge-right="3"
        >
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="info-icon">mdi-information-outline</v-icon>
          </template>
          <span>If the business start date is incorrect, it must be corrected through a correction filing.</span>
        </v-tooltip>

        <!-- Edit mode -->
        <template v-if="onEditMode">
          <div cols="12" sm="3" class="pr-4">
            <label class="start-date-title title-label">Start Date</label>
            <p class="mt-4">
              Enter the start date of the business. The start date can be
              <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="tool-tip dotted-underline">no more than 2 years in the past</span>
                </template>
                <span>Choose the oldest date possible even if the actual start date is older than 2 years in the
                  past.</span>
              </v-tooltip>
              and 90 days in the future. Make certain that this is the correct date as it cannot be easily
              corrected afterwards.
            </p>
            <DatePickerShared
              title="Start Date"
              nudge-right="80"
              nudge-top="15"
              :minDate="startDateMinStr"
              :maxDate="startDateMaxStr"
              @emitDate="onOkClicked($event)"
            />
          </div>
          <div class="float-right mb-2">
            <v-btn large color="primary" id="start-done-btn" class="mr-2" @click="onDoneClicked()">
              <span>Done</span>
            </v-btn>
            <v-btn large outlined color="primary" id="start-cancel-btn" @click="onCancelClicked()">
              <span>Cancel</span>
            </v-btn>
          </div>
        </template>

        <span class="mt-n2 mr-n3 float-right">
          <!-- Correct changes button -->
          <v-btn v-if="isCorrectionFiling && !onEditMode && !isCorrected" text color="primary"
            id="start-changes-btn" @click="onChangeClicked()">
            <v-icon small color="primary">mdi-pencil</v-icon>
            <span>{{ editLabel }}</span>
          </v-btn>

          <!-- Undo changes buttons -->
          <v-btn v-if="isCorrectionFiling && !onEditMode && isCorrected"
          text color="primary" id="start-undo-btn" @click="onUndoClicked()">
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
          <v-menu v-if="isCorrectionFiling && !onEditMode && isCorrected"
            offset-y left nudge-bottom="4" v-model="dropdown">
            <template v-slot:activator="{ on }">
              <v-btn text small color="primary" id="start-menu-btn" v-on="on">
                <v-icon id="start-menu">{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
              </v-btn>
            </template>
            <v-btn text color="primary" id="more-changes-btn"
              @click="onChangeClicked(); dropdown = false">
              <v-icon small color="primary">mdi-pencil</v-icon>
              <span>{{ editLabel }}</span>
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
  @Getter getBusinessFoundingDate!: string // actually date-time
  @Getter getCurrentJsDate!: Date

  // Global setter
  @Action setCorrectionStartDate!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection: boolean

  protected dropdown = false
  protected onEditMode = false
  protected isCorrected = null
  protected newCorrectedStartDate = null as string // date is "Month Day, Year"

  /** The minimum start date that can be entered (Up to 2 years ago today). */
  protected get startDateMin (): Date {
    const startDateMin = new Date(this.getCurrentJsDate) // make a copy
    startDateMin.setFullYear(startDateMin.getUTCFullYear() - 2)
    startDateMin.setHours(0, 0, 0) // Set time to 0 for accurate Date Rules comparison
    return startDateMin
  }

  /** The minimum start date string. */
  protected get startDateMinStr (): string {
    return this.dateToYyyyMmDd(this.startDateMin)
  }

  /** The maximum start date that can be entered (Up to 90 days from today). */
  protected get startDateMax (): Date {
    const startDateMax = new Date(this.getCurrentJsDate) // make a copy
    startDateMax.setDate(startDateMax.getUTCDate() + 90)
    return startDateMax
  }

  /** The maximum start date string. */
  protected get startDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.startDateMax)
  }

  /** The business date or business start date string. */
  protected get businessStartDate (): string {
    if (
      this.isFirmCorrectionFiling ||
      this.isFirmChangeFiling ||
      this.isFirmConversionFiling
    ) {
      if (this.hasBusinessStartDateChanged) {
        // Sets the Corrected flag when reloading from a saved filing.
        this.isCorrected = true
        return this.yyyyMmDdToPacificDate(this.getCorrectionStartDate, true)
      } else if (this.getBusinessFoundingDate) {
        // Business Founding Date is is stored in UTC time for BENs and COOPs.
        // For firms only, the date is valid and is in Pacific Time.
        return this.yyyyMmDdToPacificDate(this.getBusinessFoundingDate.slice(0, 10), true)
      }
    }
    return 'Unknown'
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
      if (this.newCorrectedStartDate !== this.getBusinessFoundingDate.slice(0, 10)) {
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

  @Watch('onEditMode', { immediate: true })
  protected syncValidity (): void {
    const isValid = !this.onEditMode
    this.setValidComponent({ key: 'isValidStartDate', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.dotted-underline {
  border-bottom: 1px dotted;
}

</style>
