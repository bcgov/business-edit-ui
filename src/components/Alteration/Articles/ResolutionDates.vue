<template>
  <div id="resolution-dates">
    <!-- Base Display -->
    <v-row no-gutters>
      <v-col cols="3">
        <label>
          <span :class="{'error-text': !getIsResolutionDatesValid}">Resolution or<br>Court Order Dates</span>
        </label>
        <v-chip
          v-if="haveNewResolutionDates && isCorrectionFiling"
          id="corrected-lbl"
          x-small label
          color="primary"
          text-color="white"
        >
          Corrected
        </v-chip>
      </v-col>

      <v-col :cols="isEditMode ? '7' : '8'">
        <div class="info-text" v-if="isAdding">
          Indicate the date of the resolution or court order used to alter the company's share
          structure or the special rights and restrictions of a class or series of shares:
        </div>
        <div class="info-text" v-else>
          Dates of resolutions or court orders to alter the company's share structure or the
          special rights or restrictions attached to a class or series of shares:
        </div>
        <p v-if="!getIsResolutionDatesValid" class="error-text small-text mt-6">
          You must add a resolution or court order date because your share structure contains a class or series of
          shares with special rights or restrictions and changes were made to your share structure.
        </p>
      </v-col>

      <v-col cols="2" class="align-right" v-if="isEditMode && !isAdding">
        <v-btn id="add-resolution-date"
          class="add-btn mt-n1"
          text color="primary"
          :disabled="haveAddedDates"
          @click="isAdding = true"
        >
          <v-icon small>{{ addBtnIcon }}</v-icon>
          <span>{{ addBtnLabel }}</span>
        </v-btn>
      </v-col>
      <v-col cols="2" class="align-right" v-else-if="isAdding">
        <v-btn id="close-resolution-date"
          class="close-btn mt-n1"
          text color="primary"
          @click="isAdding = false"
        >
          <v-icon small>mdi-close</v-icon>
          <span>Cancel</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Added Dates -->
    <v-row no-gutters v-if="haveAddedDates" class="mt-2 mb-1">
      <v-col cols="3"></v-col>
      <v-col cols="7">
        <ul class="resolution-date-list info-text pl-0 mt-2">
          <li v-for="(date, index) in addedDates"
            :key="`newResolutionDate-${index}`"
          >
            <strong class="mr-2">{{date}}</strong>
            <v-btn v-if="isEditMode"
              id="remove-resolution-date"
              class="remove-btn mt-n1"
              text color="primary"
              @click="onRemove(index)"
            >
              <v-icon small>{{ removeBtnIcon }}</v-icon>
              <span>{{ removeBtnLabel }}</span>
            </v-btn>
          </li>
        </ul>
      </v-col>
    </v-row>

    <!-- Date Picker -->
    <v-row no-gutters v-if="isAdding" class="mt-4">
      <v-col cols="3"></v-col>
      <v-col cols="9" class="mb-n4 pr-3">
        <DatePickerShared
          title="Resolution or Court Order Date"
          nudge-right="80"
          nudge-top="15"
          :minDate="minDate"
          :maxDate="maxDate"
          @emitDate="onDateEmitted($event)"
          @emitCancel="isAdding = false"
        />
      </v-col>
    </v-row>

    <!-- Previous Dates -->
    <v-row no-gutters v-if="havePreviousDates && !isSummaryMode" class="mt-2 mb-1">
      <v-col cols="3"></v-col>
      <v-col cols="7">
        <v-btn class="show-previous-dates-btn ml-n4"
               text color="primary"
               :ripple="false"
               @click="displayPreviousDates = !displayPreviousDates"
        >
          <span v-if="!displayPreviousDates">Show previous resolutions or court order dates</span>
          <span v-else>Hide previous resolutions or court order dates</span>
        </v-btn>
        <template v-if="displayPreviousDates">
          <ul class="resolution-date-list info-text pl-0 mt-3">
            <li v-for="(resolutions, index) in previousDates" :key="`resolutionDate-${index}`">{{resolutions.date}}</li>
          </ul>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { CommonMixin, DateMixin } from '@/mixins/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { cloneDeep } from 'lodash'
import { ActionBindingIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({
  components: {
    DatePickerShared
  }
})
export default class ResolutionDates extends Mixins(CommonMixin, DateMixin) {
  /** New resolution dates. */
  @Prop({ default: () => [] }) readonly addedDates!: string[]

  /** Previously existing resolution dates. */
  @Prop({ default: () => [] }) readonly previousDates!: string[]

  /** Whether this component should be in edit mode or review mode. */
  @Prop({ default: true }) readonly isEditMode!: boolean

  /** Boolean indicating rights or restrictions in ShareStructure. */
  @Prop({ default: false }) readonly hasRightsOrRestrictions!: boolean

  // Global getters
  @Getter(useStore) getBusinessFoundingDateTime!: string
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) haveNewResolutionDates!: boolean
  @Getter(useStore) getIsResolutionDatesValid!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean

  // Global setter
  @Action(useStore) setValidComponent!: ActionBindingIF

  // Local properties
  displayPreviousDates = false
  isAdding = false

  /** The minimum date that can be entered (business founding date). */
  get minDate (): string {
    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum date that can be entered (today). */
  get maxDate (): string {
    return this.getCurrentDate
  }

  get haveAddedDates (): boolean {
    return (this.addedDates?.length > 0)
  }

  get havePreviousDates (): boolean {
    return (this.previousDates?.length > 0)
  }

  get addBtnIcon (): string {
    return this.isCorrectionFiling ? 'mdi-pencil' : 'mdi-plus'
  }

  get addBtnLabel (): string {
    return this.isCorrectionFiling ? 'Correct' : 'Add'
  }

  get removeBtnIcon (): string {
    return this.isCorrectionFiling ? 'mdi-undo' : 'mdi-delete'
  }

  get removeBtnLabel (): string {
    return this.isCorrectionFiling ? 'Undo' : 'Remove'
  }

  /** Called to add a new date. */
  onDateEmitted (date: string): void {
    if (date) {
      // Create a copy of the prop and add the new date
      const tempNewDates = cloneDeep(this.addedDates)
      tempNewDates.push(date)

      // Update parent
      this.emitAddRemoveDate(tempNewDates)
    }
    this.isAdding = false
  }

  /** Called to remove a previously-added date. */
  onRemove (index: number): void {
    // Create a copy of the prop and remove the new date
    const tempNewDates = cloneDeep(this.addedDates)
    tempNewDates.splice(index, 1)

    // Update parent
    this.emitAddRemoveDate(tempNewDates)
  }

  /** Updates store when resolution dates validity changes. */
  @Watch('isAdding', { immediate: true })
  @Watch('getIsResolutionDatesValid', { immediate: true })
  private onEditingNameChanged (): void {
    if (this.isAdding) {
      this.setValidComponent({ key: 'isValidResolutionDate', value: false })
    } else {
      this.setValidComponent({ key: 'isValidResolutionDate', value: this.getIsResolutionDatesValid })
    }
  }

  /** Emit updated list of dates. */
  @Emit('addRemoveDate')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitAddRemoveDate (dates: string[]): void {}

  @Watch('isAdding', { immediate: true })
  @Emit('isEditing')
  private emitIsEditing (): boolean {
    return this.isAdding
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.show-previous-dates-btn {
  text-decoration: underline;
}

.resolution-date-list {
  list-style-type: none;
}

#add-resolution-date[disabled] {
  color: $app-blue !important;
  opacity: 0.4;
}

:deep(.theme--light.v-btn.v-btn--disabled .v-icon) {
  color: $app-blue !important;
  opacity: 0.4;
}
</style>
