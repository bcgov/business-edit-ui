<template>
  <div>
    <v-row no-gutters v-if="!isEditing" id="folio-number-read-only">
      <v-col cols="3">
        <label><strong>Folio Information</strong></label>
      </v-col>
      <v-col cols="7">
        <label><strong>Folio Number</strong></label>
        <div id="lbl-folio-number">{{ !!folioNumber ? folioNumber : 'Not entered' }}</div>
      </v-col>
      <v-col cols="2">
        <!-- TODO: add actions here (for alterations only) -->
      </v-col>
    </v-row>

    <v-row no-gutters v-else id="folio-number-editing">
      <v-col>
        <label><strong>Folio Number</strong></label>
      </v-col>
      <v-col cols="12" sm="8" md="10">
        <v-form>
          <v-text-field
            id="folio-number-text-field"
            label="Folio or Reference Number"
            persistent-hint
            v-model="folioNumber"
            filled
            :rules="rules"
          />
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class FolioNumber extends Vue {
  // Props
  @Prop({ default: null })
  readonly initialValue: string

  @Prop({ default: false })
  readonly isEditing: boolean

  @Prop({ default: false })
  readonly invalidSection: boolean

  // Data variable
  private folioNumber: string = null

  // Validation rules
  private readonly rules: Array<Function> = [
    (v: string) => /^[0-9A-Za-z]*$/.test(v) || 'Invalid character', // numbers and letters only
    (v: string) => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is created. */
  private created (): void {
    if (this.initialValue) {
      this.folioNumber = this.initialValue
    }
  }

  @Watch('initialValue', { deep: true, immediate: true })
  private onFolioNumberPropValueChanged (): void {
    this.folioNumber = this.initialValue
  }

  // TODO: never used; delete or keep this?
  /** When Folio Number changes, emit it to parent. */
  @Watch('folioNumber')
  @Emit('folioNumberChange')
  private emitFolioNumber (val: string): void { }

  @Emit('haveChanges')
  private emitHaveChanges (val: boolean): void {
    // TODO: implement
  }

  @Emit('isEditing')
  private emitIsEditing (val: boolean): void {
    // TODO: implement
  }
}
</script>
