<template>
  <v-form id="correct-name-form" ref="correctNameForm" v-model="valid" lazy-validation>
    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-model="companyName"
          id="company-name-input"
          class="mb-n3"
          filled
          :rules="companyNameRules"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Mixins
import { CommonMixin } from '@/mixins'

// Interfaces && enums
import { ActionBindingIF, NameRequestIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

@Component({})
export default class CorrectCompanyName extends Mixins(CommonMixin) {
  /** Form Submission Prop */
  @Prop({ default: null }) formType: CorrectionTypes

  @Action setNameRequest!: ActionBindingIF

  @Getter getApprovedName!: string
  @Getter getNameRequest!: NameRequestIF

  private valid = false
  private companyName = ''

  // Form Ref
  $refs: { correctNameForm: HTMLFormElement }

  // Rules
  private companyNameRules = [
    (v: string) => !!v || ' A company name is required'
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

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    if (this.formType === CorrectionTypes.CORRECT_NAME) {
      const correctedCompanyName = { legalName: this.companyName }
      this.setNameRequest({ ...this.getNameRequest, ...correctedCompanyName })
      this.emitDone(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('done')
  private emitDone (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>
