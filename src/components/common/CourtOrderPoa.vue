<template>
  <v-card flat class="mt-4 pa-8">
    <v-row no-gutters align="top">
      <v-col cols="3">
        <label>Court Order <br>Number</label>
      </v-col>
      <v-col cols="9">
        <label>
          <v-text-field id="court-order-number-input"
                        v-model="courtOrderNumber"
                        label="Court Order Number"
                        filled
          />
        </label>
      </v-col>
    </v-row>
    <v-row no-gutters align="end">
      <v-col cols="3">
        <label>Plan of <br>Arrangement</label>
      </v-col>
      <v-col cols="9">
        <label>
          <v-checkbox id="plan-of-arrangement-checkbox"
                      v-model="planOfArrangement"
                      label="This filing is pursuant to a Plan of Arrangement"
          />
        </label>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class CourtOrderPoa extends Vue {
  private courtOrderNumber: number = null
  private planOfArrangement = false

  // @Prop({ default: '' })
  // private title!: string
  //
  // @Prop({ default: null })
  // private errorMsg!: string
  //
  // @Prop({ default: null })
  // private nudgeTop!: number
  //
  // @Prop({ default: null })
  // private nudgeBottom!: number
  //
  // @Prop({ default: null })
  // private nudgeRight!: number
  //
  // @Prop({ default: null })
  // private nudgeLeft!: number
  //
  // private dateText = ''
  // private displayPicker = false
  //
  // /** Clear local model after each action. */
  // private clearDate (): void { this.dateText = '' }
  //
  // /** Emit date to add or remove. */
  // @Emit('emitDate')
  // private emitDate (date: string): void { this.clearDate() }
  //
  // /** Emit date to add or remove. */
  // @Emit('emitCancel')
  // private emitCancel (): void { this.clearDate() }
  //
  // @Watch('dateText')
  // @Emit('emitDateSync')
  // private emitDateSync (date: string): string { return this.dateText }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  ::v-deep .v-card__actions {
    justify-content: flex-end;
  }
  ::v-deep .v-input .v-label {
    font-weight: normal;
    color: $gray7;
  }
</style>
