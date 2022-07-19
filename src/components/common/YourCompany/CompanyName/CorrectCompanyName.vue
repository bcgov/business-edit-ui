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
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins/'
import { ActionBindingIF, NameRequestIF } from '@/interfaces/'
import { CorrectionTypes } from '@/enums/'

@Component({})
export default class CorrectCompanyName extends Mixins(CommonMixin) {
  /** Form Submission Prop */
  @Prop({ default: null }) readonly formType: CorrectionTypes

  @Action setNameRequest!: ActionBindingIF

  @Getter getNameRequestApprovedName!: string
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
    if (this.getNameRequestApprovedName) {
      this.companyName = this.getNameRequestApprovedName
    }
  }

  // Validations
  get isFormValid (): boolean {
    return this.valid
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    if (this.formType === CorrectionTypes.CORRECT_NAME) {
      // set the new company name
      this.setNameRequest({
        ...this.getNameRequest,
        legalName: this.companyName
      })
      this.emitIsSaved(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('isSaved')
  private emitIsSaved (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>
