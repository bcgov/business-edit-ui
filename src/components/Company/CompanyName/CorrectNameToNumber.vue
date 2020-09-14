<template>
  <v-form ref="correctNameToNumberForm" lazy-validation>
    <v-layout row>
        <v-checkbox
          v-model="correctToNumbered"
          label="Change the company name to 1234567 B.C. Ltd."
        ></v-checkbox>
    </v-layout>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces && enums
import { ActionBindingIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

@Component({})
export default class CorrectNameToNumber extends Vue {
  /** Form Submission Prop */
  @Prop({ default: '' }) formType: string

  @Action setNameRequest!: ActionBindingIF

  @Getter getApprovedName!: string
  @Getter getEntityType!: string

  // Local Properties
  private correctToNumbered = false

  // Form Ref
  $refs: { correctNameToNumberForm: HTMLFormElement }

  // Validations
  private get isFormValid (): boolean {
    return this.correctToNumbered
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    if (this.formType === CorrectionTypes.CORRECT_NAME_TO_NUMBER) {
      const correctedNameToNumber = { legalType: this.getEntityType }
      this.setNameRequest(correctedNameToNumber)
      this.emitDone(CorrectionTypes.CORRECT_NEW_NR)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('done')
  private emitDone (type: CorrectionTypes): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('correctToNumbered')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
  .v-input--selection-controls {
    padding: 0;
    margin: 0;
  }

  .v-label {
    color: #3b6cff;
  }
</style>
