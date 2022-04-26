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
          :minDate="getBusinessFoundingDate"
          :maxDate="getCurrentDate"
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
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { DatePickerShared } from '@/components/shared'
import { ActionBindingIF } from '@/interfaces/'

@Component({
  components: {
    DatePickerShared
  }
})
export default class ResolutionDateDialog extends Vue {
  /** Prop to provide attachment selector. */
  @Prop() readonly attach: string

  /** Prop to display the dialog. */
  @Prop() readonly dialog: boolean

  // Global getter
  @Getter getBusinessFoundingDate!: string
  @Getter getCurrentDate!: string
  @Getter getNewResolutionDates!: string []

  // Global action
  @Action setResolutionDates!: ActionBindingIF

  // Local properties
  private date = ''
  private errorMsg = ''

  /** Return an error msg if there is no date at Done. */
  get errors (): string {
    return this.date ? '' : this.errorMsg
  }

  /** Clear local properties. */
  private clearLocal (): void {
    this.date = ''
    this.errorMsg = ''
  }

  /** Adds a new date event. */
  protected onDateEmitted (date: string): void {
    if (date) {
      // Create a copy of the prop and add the new date
      const tempNewDates = cloneDeep(this.getNewResolutionDates)
      tempNewDates.push(date)

      // Emit to parent the new store value
      this.setResolutionDates(tempNewDates)

      this.exit()
      this.clearLocal()
    } else this.errorMsg = 'Enter Resolution or Court Order Date'
  }

  // Pass click event to parent.
  @Emit('emitClose') protected exit () {
    this.clearLocal()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__actions > .v-btn.v-btn {
  min-width: 100px;
  min-height: 40px;
}
</style>
