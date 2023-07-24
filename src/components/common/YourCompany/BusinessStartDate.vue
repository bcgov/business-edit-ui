<template>
  <div
    id="business-start-date"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <v-row no-gutters>
      <v-col
        cols="3"
        class="pr-2"
      >
        <label :class="{'error-text': invalidSection}">
          <strong>Business Start Date</strong>
        </label>
        <v-chip
          v-if="isCorrected"
          x-small
          label
          color="primary"
          text-color="white"
        >
          <span>{{ getEditedLabel }}</span>
        </v-chip>
      </v-col>

      <v-col cols="9">
        <!-- display mode -->
        <span
          v-if="!onEditMode"
          class="info-text mr-1"
        >{{ businessStartDate }}</span>

        <!-- edit mode -->
        <template v-if="onEditMode">
          <div
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label class="start-date-title title-label">Start Date</label>
            <p class="mt-4">
              Enter the start date of the business.

              <template v-if="!isRoleStaff">
                The start date can be
                <v-tooltip
                  top
                  max-width="20rem"
                  content-class="top-tooltip"
                  transition="fade-transition"
                >
                  <template #activator="{ on }">
                    <span
                      class="tool-tip dotted-underline"
                      v-on="on"
                    >up to 10 years before the Registration Date</span>
                  </template>
                  <span>Choose the oldest date possible even if the actual start date is older than 10 years before
                    the Registration Date.</span>
                </v-tooltip>
                and up 90 days after the Registration Date.
              </template>

              Make certain that this is the correct date as it cannot be easily corrected afterwards.
            </p>
            <DatePickerShared
              title="Start Date"
              nudge-right="80"
              nudge-top="15"
              :minDate="startDateMin"
              :maxDate="startDateMax"
              :editLabel="getEditLabel"
              :editedLabel="getEditedLabel"
              @emitDate="onOkClicked($event)"
            />
          </div>

          <!-- inner buttons -->
          <div class="float-right mb-2">
            <v-btn
              id="start-done-btn"
              large
              color="primary"
              class="mr-2"
              @click="onDoneClicked()"
            >
              <span>Done</span>
            </v-btn>
            <v-btn
              id="start-cancel-btn"
              large
              outlined
              color="primary"
              @click="onCancelClicked()"
            >
              <span>Cancel</span>
            </v-btn>
          </div>
        </template>

        <!-- outer buttons -->
        <span
          v-if="isApplicableFiling"
          class="my-n2 mr-n3 float-right"
        >
          <!-- Correct Changes button -->
          <v-btn
            v-if="!onEditMode && !isCorrected"
            id="start-changes-btn"
            text
            color="primary"
            @click="onChangeClicked()"
          >
            <v-icon
              small
              color="primary"
            >mdi-pencil</v-icon>
            <span>{{ getEditLabel }}</span>
          </v-btn>

          <!-- Undo Changes buttons -->
          <v-btn
            v-if="!onEditMode && isCorrected"
            id="start-undo-btn"
            text
            color="primary"
            @click="onUndoClicked()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>

          <!-- Drop-down menu and More Changes button -->
          <v-menu
            v-if="!onEditMode && isCorrected"
            v-model="dropdown"
            offset-y
            left
            nudge-bottom="4"
          >
            <template #activator="{ on }">
              <v-btn
                id="start-menu-btn"
                text
                small
                color="primary"
                v-on="on"
              >
                <v-icon id="start-menu">{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
              </v-btn>
            </template>
            <v-btn
              id="more-changes-btn"
              text
              color="primary"
              @click="onChangeClicked(); dropdown = false"
            >
              <v-icon
                small
                color="primary"
              >mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
          </v-menu>
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { CommonMixin, DateMixin } from '@/mixins/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { ActionKvIF, FlagsCompanyInfoIF } from '@/interfaces'
import { useStore } from '@/store/store'

@Component({
  components: {
    DatePickerShared
  }
})
export default class BusinessStartDate extends Mixins(CommonMixin, DateMixin) {
  // Global getters
  @Getter(useStore) getBusinessFoundingDateTime!: string
  @Getter(useStore) getBusinessStartDate!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCorrectionStartDate!: string
  @Getter(useStore) getCurrentJsDate!: Date
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) hasBusinessStartDateChanged!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isFirmCorrectionFiling!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  // Global setter
  @Action(useStore) setCorrectionStartDate!: (x: string) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  dropdown = false
  onEditMode = false
  isCorrected: boolean = null
  private newCorrectedStartDate: string = null // date is "Month Day, Year"

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidStartDate)
  }

  get isApplicableFiling (): boolean {
    // can change Business Start Date in firm corrections and firm conversions only
    return (this.isFirmCorrectionFiling || this.isFirmConversionFiling)
  }

  /** The minimum start date that can be entered (up to 10 years before reg date). */
  get startDateMin (): string {
    // no min date for staff
    if (this.isRoleStaff) return null

    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    date.setFullYear(date.getFullYear() - 10)
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum start date that can be entered (up to 90 days after reg date). */
  get startDateMax (): string {
    // no max date for conversion
    if (this.isFirmConversionFiling) return null

    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    date.setDate(date.getDate() + 90)
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

  onChangeClicked (): void {
    this.onEditMode = true
  }

  /** Called to add a new date. */
  onOkClicked (date: string): void {
    if (date) {
      this.newCorrectedStartDate = date
    }
  }

  onDoneClicked (): void {
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

  onCancelClicked (): void {
    this.onEditMode = false
  }

  onUndoClicked (): void {
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
