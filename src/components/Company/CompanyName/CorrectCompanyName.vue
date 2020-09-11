<template>
  <v-form ref="correctNameForm" v-model="valid" lazy-validation>
    <v-layout row>
      <v-flex>
        <v-text-field
          v-model="companyName"
          filled
          req
          persistent-hint
          :rules="companyNameRules"
          data-test="business-identifier"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'

// Interfaces && enums
import { ActionBindingIF, BusinessInformationIF, NameRequestIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

@Component({})
export default class CorrectNameRequest extends Vue {
  /** Form Submission Prop */
  @Prop({ default: false }) submitId: string

  // Global state
  @State(state => state.stateModel.nameRequest)
  readonly nameRequest!: NameRequestIF

  @Action setNameRequest!: ActionBindingIF

  @Getter getApprovedName!: string

  private valid = false
  private companyName = ''

  // Form Ref
  $refs: { correctNameForm: HTMLFormElement }

  // Rules
  private companyNameRules = [
    v => !!v || ' A company name is required'
  ]

  mounted (): void {
    // Set the current company name to the form
    if (this.getApprovedName) {
      this.companyName = this.getApprovedName
    }
  }

  // Validations
  private get isFormValid (): boolean {
    return this.valid
  }

  private resetForm () {
    this.$refs.correctNameForm.resetValidation()
  }

  /** Watch for form submission and emit results. */
  @Watch('submitId')
  private async onSubmit (): Promise<any> {
    if (this.submitId === CorrectionTypes.CORRECT_NAME) {
      const correctedCompanyName = { legalName: this.companyName }
      this.setNameRequest({ ...this.nameRequest, ...correctedCompanyName })
      this.emitDone(CorrectionTypes.CORRECT_NEW_NR)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('done')
  private emitDone (type: CorrectionTypes = null): void {
    if (!type) this.resetForm()
  }

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
  .v-expansion-panel-content ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
  }
</style>
