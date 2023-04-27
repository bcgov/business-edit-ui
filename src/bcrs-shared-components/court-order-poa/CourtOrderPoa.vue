<template>
  <div id="court-order-poa">
    <v-row no-gutters>
      <v-col
        v-if="displaySideLabels"
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label
          id="court-order-label"
          :class="{'error-text': invalidSection}"
        >Court Order Number</label>
      </v-col>
      <v-col
        cols="12"
        :sm="displaySideLabels ? 9 : 12"
      >
        <v-form
          id="court-num-form"
          ref="courtNumRef"
          v-model="valid"
        >
          <v-text-field
            id="court-order-number-input"
            v-model="courtOrderNumber"
            label="Court Order Number"
            :rules="courtOrderNumRules"
            variant="filled"
          />
        </v-form>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        v-if="displaySideLabels"
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label id="poa-label">Plan of Arrangement</label>
      </v-col>
      <v-col
        cols="12"
        :sm="displaySideLabels ? 9 : 12"
      >
        <v-checkbox
          id="plan-of-arrangement-checkbox"
          v-model="planOfArrangement"
          class="mt-0 pt-0"
          hide-details
          label="This filing is pursuant to a Plan of Arrangement"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { FormIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class CourtOrderPoa extends Vue {
  // Refs
  declare $refs: Vue['$refs'] & {
    courtNumRef: FormIF
  }

  /** Prompt the validations. Used for global validations. */
  @Prop({ default: false }) readonly autoValidation!: boolean

  /** Draft court order number. */
  @Prop({ default: '' }) readonly draftCourtOrderNumber!: string

  /** Draft plan of arrangement. */
  @Prop({ default: false }) readonly hasDraftPlanOfArrangement!: boolean

  /** Prompt Error. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  /** Display side labels. */
  @Prop({ default: true }) readonly displaySideLabels!: boolean

  /** Wether court order number is required regardless plan of arrangement. */
  @Prop({ default: false }) readonly courtOrderNumberRequired!: boolean

  // Local properties
  private courtOrderNumber = ''
  private courtOrderNumRules = []
  private planOfArrangement = false
  private valid = false

  /** Called when component is mounted. */
  mounted (): void {
    // Set default draft values if they exist
    if (this.draftCourtOrderNumber) this.courtOrderNumber = this.draftCourtOrderNumber
    if (this.hasDraftPlanOfArrangement) this.planOfArrangement = this.hasDraftPlanOfArrangement
  }

  /** Clear rules and reset validations. */
  private clearValidations (): void {
    this.courtOrderNumRules = []
    this.$refs.courtNumRef.resetValidation()
  }

  /** Triggers the form validation. */
  public validate (): boolean {
    return this.$refs.courtNumRef.validate()
  }

  @Watch('autoValidation')
  @Watch('planOfArrangement')
  @Watch('courtOrderNumber')
  @Watch('courtOrderNumberRequired')
  validateCourtNum (): void {
    if (this.autoValidation) {
      // Apply TextField rules
      this.courtOrderNumRules = [
        (v: string) => (!v || !/^\s/g.test(v)) || 'Invalid spaces', // leading spaces
        (v: string) => (!v || !/\s$/g.test(v)) || 'Invalid spaces', // trailing spaces
        (v: string) => (!v || !(v.length < 5)) || 'Court order number is invalid',
        (v: string) => (!v || !(v.length > 20)) || 'Court order number is invalid'
      ]
      if (this.courtOrderNumberRequired || this.planOfArrangement) {
        this.courtOrderNumRules.push((v: string) => !!v || 'A Court Order number is required')
      }
      this.$refs.courtNumRef.validate()
    } else this.clearValidations()
  }

  /** Emit court order number. */
  @Watch('courtOrderNumber')
  @Emit('emitCourtNumber')
  private emitCourtNumber (): string { return this.courtOrderNumber }

  /** Emit plan of arrangement. */
  @Watch('planOfArrangement')
  @Emit('emitPoa')
  private emitPoa (): boolean {
    return this.planOfArrangement
  }

  @Watch('valid')
  @Emit('emitValid')
  private emitValid (): boolean {
    return this.valid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#court-order-label,
#poa-label {
  font-size: $px-16;
  font-weight: bold;
  color: $gray9;
}

:deep() {
  .v-card__actions {
    justify-content: flex-end;
  }

  .v-input .v-label {
    font-weight: normal;
    color: $gray7;
  }

  .theme--light.v-input input {
    font-weight: normal;
    color: $gray7;
  }
}
</style>
