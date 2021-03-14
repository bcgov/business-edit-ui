<template>
  <div id="resolution-dates">
    <template>

      <!-- Base Display -->
      <v-row no-gutters class="mb-4">
        <v-col cols="3">
          <label>
            <span>Resolution or <br> Court Order Dates</span>
          </label>
        </v-col>

        <v-col cols="7">
          <span class="info-text">Indicate the date of the resolution or court order used to alter the company's share
            structure or the special rights and restrictions of a class or series of shares:</span>
        </v-col>

        <v-col cols="2" class="align-right">
          <v-btn v-if="!isEditing"
                 id="add-resolution-date"
                 class="add-btn"
                 text color="primary"
                 @click="isEditing = true"
          >
            <v-icon small>mdi-plus</v-icon>
            <span>Add</span>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Display NEW Dates -->
      <v-row no-gutters v-if="addedDates && addedDates.length >= 1" class="my-4">
        <v-col cols="3"></v-col>
        <v-col cols="7">
          <ul class="resolution-date-list info-text pl-0 mt-2">
            <li v-for="(date, index) in addedDates"
                :key="`newResolutionDate-${index}`"
                class="my-n2"
            >
              <strong class="mr-2">{{date}}</strong>
              <v-btn id="remove-resolution-date"
                     class="remove-btn"
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

      <!-- Add Dates Menu -->
      <v-row no-gutters>
        <v-col cols="3"></v-col>
        <v-col cols="9" class="pl-0 pr-3">
          <date-picker v-if="isEditing"
                       title="Resolution or Court Order Date"
                       nudge-right="80"
                       nudge-top="15"
                       @emitDate="onAdd($event)"
                       @emitCancel="onCancel()"/>
        </v-col>
      </v-row>

      <!-- Display PREVIOUS Dates -->
      <v-row no-gutters>
        <v-col cols="3"></v-col>
        <v-col cols="7" v-if="previousDates && previousDates.length >= 1">
          <v-btn class="show-previous-dates-btn pl-0"
                 text color="primary"
                 :ripple="false"
                 @click="displayPreviousDates = !displayPreviousDates"
          >
            <span v-if="!displayPreviousDates">Show previous resolutions or court order dates</span>
            <span v-else>Hide previous resolutions or court order dates</span>
          </v-btn>
          <template v-if="displayPreviousDates">
            <ul class="resolution-date-list info-text pl-0 mt-2">
              <li v-for="(date, index) in previousDates" :key="`resolutionDate-${index}`">{{date}}</li>
            </ul>
          </template>
        </v-col>
      </v-row>

    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { CommonMixin, DateMixin } from '@/mixins'
import { DatePicker } from '@/components/common'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    DatePicker
  }
})
export default class ResolutionDates extends Mixins(DateMixin, CommonMixin) {
  // Props
  /** New resolution dates. */
  @Prop({ default: () => [] })
  private addedDates!: string[]

  /** Previously existing resolution dates. */
  @Prop({ default: () => [] })
  private previousDates!: string[]

  // Local Properties
  private displayPreviousDates = false
  private isEditing = false

  /** Cancel the current date selection. */
  private onCancel (): void {
    this.isEditing = false
  }

  /** Add a new date event. */
  private onAdd (date: string): void {
    if (date) {
      this.isEditing = false

      // Create a copy of the prop and add the new date
      const tempNewDates = cloneDeep(this.addedDates)
      tempNewDates.push(date)

      // Emit to parent the new store value
      this.emitAddRemoveDate(tempNewDates)

      // Reset the local model
    } else this.onCancel()
  }

  /** Remove the specified NEW date. */
  private onRemove (index: number): void {
    // Create a copy of the prop and remove the new date
    const tempNewDates = cloneDeep(this.addedDates)
    tempNewDates.splice(index, 1)

    // Emit to parent the new store value
    this.emitAddRemoveDate(tempNewDates)
  }

  /** Emit date to add or remove. */
  @Emit('addRemoveDate')
  private emitAddRemoveDate (date: string[]): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.add-btn {
  height: inherit !important
}
.show-previous-dates-btn {
  text-decoration: underline;
}
.resolution-date-list{
  list-style-type: none;
}
</style>
