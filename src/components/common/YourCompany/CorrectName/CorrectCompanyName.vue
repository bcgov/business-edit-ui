<template>
  <v-form
    id="correct-name-form"
    ref="correctNameForm"
    v-model="valid"
    lazy-validation
  >
    <v-row no-gutters>
      <v-col>
        <v-text-field
          id="company-name-input"
          v-model="companyName"
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
import { Action, Getter } from 'pinia-class'
import { CommonMixin } from '@/mixins/'
import { CorrectNameOptions } from '@/enums/'
import { useStore } from '@/store/store'

@Component({})
export default class CorrectCompanyName extends Mixins(CommonMixin) {
  /** Form Submission Prop */
  @Prop({ default: null }) readonly formType!: CorrectNameOptions

  @Action(useStore) setNameRequestLegalName!: (x: string) => void

  @Getter(useStore) getNameRequestLegalName!: string

  // Local properties
  valid = false
  companyName = ''

  // Form Ref
  $refs: { correctNameForm: HTMLFormElement }

  // Rules
  readonly companyNameRules = [
    (v: string) => !!v || ' A company name is required'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // Set the current company name to the form
    if (this.getNameRequestLegalName) {
      this.companyName = this.getNameRequestLegalName
    }
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private onSubmit (): void {
    // this component should only see correct-name form type
    if (this.formType === CorrectNameOptions.CORRECT_NAME) {
      // set the new company name
      this.setNameRequestLegalName(this.companyName)
      this.emitSaved(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('saved')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitSaved (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Emit('valid')
  private emitValid (): boolean {
    return this.valid
  }
}
</script>
