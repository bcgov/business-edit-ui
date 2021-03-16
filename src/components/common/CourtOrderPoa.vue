<template>
  <v-card flat class="mt-4 pa-8">
    <v-row no-gutters align="start">
      <v-col cols="3">
        <label>Court Order <br>Number</label>
      </v-col>
      <v-col cols="9">
        <v-form ref="courtNumRef" v-model="valid">
          <v-text-field id="court-order-number-input"
                        v-model="courtOrderNumber"
                        label="Court Order Number"
                        :rules="courtOrderNumRules"
                        filled
          />
        </v-form>
      </v-col>
    </v-row>
    <v-row no-gutters align="end">
      <v-col cols="3">
        <label>Plan of <br>Arrangement</label>
      </v-col>
      <v-col cols="9">
        <v-checkbox id="plan-of-arrangement-checkbox"
                    v-model="planOfArrangement"
                    label="This filing is pursuant to a Plan of Arrangement"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { FormType } from '@/interfaces'

@Component({})
export default class CourtOrderPoa extends Vue {
  // Form Ref
  $refs: { courtNumRef: FormType }

  /** Prompt the validations. Used for global validations. */
  @Prop({ default: false })
  private validate

  private courtOrderNumber = ''
  private courtOrderNumRules = []
  private planOfArrangement = false
  private valid = false

  @Watch('validate')
  validateCourtNum (): void {
    if (this.planOfArrangement) {
      // Apply TextField rules
      this.courtOrderNumRules = [
        (v: string) => !!v || ' A court order number is required',
        (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
        (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
        (v: string) => !(v.length < 5) || 'court order number is invalid',
        (v: string) => !(v.length > 20) || 'court order number is invalid'
      ]
      this.$refs.courtNumRef.validate()
    } else this.$refs.courtNumRef.resetValidation()
  }

  /** Emit court order number. */
  @Watch('courtOrderNumber')
  @Emit('emitCourtNumber')
  private emitCourtNumber (): string { return this.courtOrderNumber }

  /** Emit plan of arrangement. */
  @Watch('planOfArrangement')
  @Emit('emitPoa')
  private emitPoa (): boolean {
    if (!this.planOfArrangement) this.$refs.courtNumRef.resetValidation()
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

::v-deep .v-card__actions {
  justify-content: flex-end;
}
::v-deep .v-input .v-label {
  font-weight: normal;
  color: $gray7;
}
::v-deep .theme--light.v-input input {
  font-weight: normal;
  color: $gray7;
}
</style>
