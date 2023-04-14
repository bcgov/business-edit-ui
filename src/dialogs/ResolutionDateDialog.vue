<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="resolution-date-dialog">
    <v-card id="resolution-dates-dialog">
      <v-card-title id="dialog-title">Resolution or Court Order Required</v-card-title>

      <v-card-text id="dialog-text">
        <div>
          <p>Your share structure contains a class or series of shares with special rights or restrictions. You must
          have passed a resolution or have a court order to change your share structure.</p>
          <p>Enter the date of the Resolution or Court Order here:</p>
        </div>
        <DatePickerShared
          title="Resolution or Court Order Date"
          :error-msg="errors"
          nudge-right="100"
          :minDate="minDate"
          :maxDate="maxDate"
          @emitDate="onDateEmitted($event)"
          @emitCancel="exit()"
          @emitDateSync="date = $event"
        />
      </v-card-text>

      <v-divider class="my-0"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="dialog-done-button" color="primary" @click="onDateEmitted(date)">Done</v-btn>
        <v-btn id="dialog-cancel-button" color="primary" outlined @click="exit()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { cloneDeep } from 'lodash'
import { ActionBindingIF } from '@/interfaces/'
import { DateMixin } from '@/mixins/'
import { useStore } from '@/store/store'

@Component({
  components: { DatePickerShared },
  mixins: [DateMixin]
})
export default class ResolutionDateDialog extends Vue {
  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  // Global getters
  @Getter(useStore) getBusinessFoundingDateTime!: string
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getNewResolutionDates!: string []

  // Global action
  @Action(useStore) setNewResolutionDates!: ActionBindingIF

  // Local properties
  private date = ''
  private errorMsg = ''

  /** The minimum date that can be entered (business founding date). */
  get minDate (): string {
    const date = this.apiToDate(this.getBusinessFoundingDateTime)
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum date that can be entered (today). */
  get maxDate (): string {
    return this.getCurrentDate
  }

  /** Return an error msg if there is no date at Done. */
  get errors (): string {
    return this.date ? '' : this.errorMsg
  }

  /** Clear local properties. */
  private clearLocal (): void {
    this.date = ''
    this.errorMsg = ''
  }

  /** Add a new date event. */
  protected onDateEmitted (date: string): void {
    if (date) {
      // Create a copy of the prop and add the new date
      const tempNewDates = cloneDeep(this.getNewResolutionDates)
      tempNewDates.push(date)

      // Emit to parent the new store value
      this.setNewResolutionDates(tempNewDates)

      this.exit()
      this.clearLocal()
    } else this.errorMsg = 'Enter Resolution or Court Order Date'
  }

  // Pass click events to parent.
  @Emit('emitClose')
  protected exit (): void {
    this.clearLocal()
  }
}
</script>

<style lang="scss" scoped>
:deep(.v-card__actions > .v-btn.v-btn) {
  min-width: 100px;
  min-height: 40px;
}
</style>
