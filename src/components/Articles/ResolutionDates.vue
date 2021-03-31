<template>
  <div id="resolution-dates">

    <!-- Base Display -->
    <v-row no-gutters>
      <v-col cols="3">
        <label>
          <span>Resolution or<br>Court Order Dates</span>
        </label>
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
      </v-col>

      <v-col cols="2" class="align-right" v-if="isEditMode && !isAdding">
        <v-btn id="add-resolution-date"
               class="add-btn"
               text color="primary"
               @click="isAdding = true"
        >
          <v-icon small>mdi-plus</v-icon>
          <span>Add</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Added Dates -->
    <v-row no-gutters v-if="haveAddedDates" class="mt-3 mb-1">
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
              <v-icon small>mdi-delete</v-icon>
              <span>Remove</span>
            </v-btn>
          </li>
        </ul>
      </v-col>
    </v-row>

    <!-- Date Picker -->
    <v-row no-gutters v-if="isAdding" class="mt-4">
      <v-col cols="3"></v-col>
      <v-col cols="9" class="mb-n4 pr-3">
        <date-picker
          title="Resolution or Court Order Date"
          nudge-right="80"
          nudge-top="15"
          @emitDate="onDateEmitted($event)"
          @emitCancel="isAdding = false"
        />
      </v-col>
    </v-row>

    <!-- Previous Dates -->
    <v-row no-gutters v-if="havePreviousDates" class="mt-3 mb-1">
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
            <li v-for="(date, index) in previousDates" :key="`resolutionDate-${index}`">{{date}}</li>
          </ul>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { CommonMixin, DateMixin } from '@/mixins'
import { DatePicker } from '@bcrs-shared-components/date-picker'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    DatePicker
  }
})
export default class ResolutionDates extends Mixins(DateMixin, CommonMixin) {
  /** New resolution dates. */
  @Prop({ default: () => [] })
  readonly addedDates: string[]

  /** Previously existing resolution dates. */
  @Prop({ default: () => [] })
  readonly previousDates: string[]

  /** Whether this component should be in edit mode or review mode. */
  @Prop({ default: true })
  readonly isEditMode: boolean

  // Local properties
  displayPreviousDates = false
  isAdding = false

  get haveAddedDates (): boolean {
    return (this.addedDates?.length > 0)
  }

  get havePreviousDates (): boolean {
    return (this.previousDates?.length > 0)
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

  /** Emit updated list of dates. */
  @Emit('addRemoveDate')
  private emitAddRemoveDate (dates: string[]): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.add-btn {
  height: inherit !important;
}

.show-previous-dates-btn {
  text-decoration: underline;
}

.resolution-date-list {
  list-style-type: none;
}
</style>
