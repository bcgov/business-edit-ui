<template>
  <v-form :attach="attach" ref="form" id="date-picker-form" class="date-time-selectors">
    <v-menu v-model="displayPicker"
            close-on-click
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
        <v-text-field id="date-text-field"
                      append-icon="mdi-calendar"
                      :error-messages="errorMsg"
                      :error="!!errorMsg"
                      :value="dateText"
                      :label="title"
                      autocomplete="chrome-off"
                      :name="Math.random()"
                      v-on="on"
                      v-on:keydown="$event.preventDefault()"
                      v-on:keyup.enter="emitDate(dateText)"
                      filled
        />
      </template>
      <v-date-picker width="490" v-model="dateText">
        <template v-slot:default>
          <div>
            <v-btn text color="primary" @click="emitDate(dateText)"><strong>Ok</strong></v-btn>
            <v-btn text color="primary" @click="emitCancel()">Cancel</v-btn>
          </div>
        </template>
      </v-date-picker>
    </v-menu>
  </v-form>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class DatePicker extends Vue {
  @Prop()
  private attach!: string

  @Prop({ default: '' })
  private title!: string

  @Prop({ default: null })
  private errorMsg!: string

  @Prop({ default: null })
  private nudgeTop!: number

  @Prop({ default: null })
  private nudgeBottom!: number

  @Prop({ default: null })
  private nudgeRight!: number

  @Prop({ default: null })
  private nudgeLeft!: number

  private dateText = ''
  private displayPicker = false

  /** Clear local model after each action. */
  private clearDate (): void { this.dateText = '' }

  /** Emit date to add or remove. */
  @Emit('emitDate')
  private emitDate (date: string): void { this.clearDate() }

  /** Emit date to add or remove. */
  @Emit('emitCancel')
  private emitCancel (): void { this.clearDate() }

  @Watch('dateText')
  @Emit('emitDateSync')
  private emitDateSync (date: string): string { return this.dateText }
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
