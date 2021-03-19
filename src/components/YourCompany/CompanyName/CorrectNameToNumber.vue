<template>
  <v-form id="correct-name-to-number-form" lazy-validation>
    <v-layout row>
        <v-checkbox
          v-model="correctToNumbered"
          id="correct-name-to-number-checkbox"
          :label="`Change the company name to ${getBusinessId} B.C. Ltd.`"
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
import { CorrectionTypes, CorpTypeCd } from '@/enums'

@Component({})
export default class CorrectNameToNumber extends Vue {
  /** Form Submission Prop */
  @Prop({ default: null }) formType: CorrectionTypes

  @Action setNameRequest!: ActionBindingIF

  @Getter getApprovedName!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getBusinessId!: string

  // Local properties
  private correctToNumbered = false

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    if (this.formType === CorrectionTypes.CORRECT_NAME_TO_NUMBER) {
      const correctedNameToNumber = { legalType: this.getEntityType }
      this.setNameRequest(correctedNameToNumber)
      this.emitDone(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('done')
  private emitDone (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('correctToNumbered')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.correctToNumbered
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-input--selection-controls {
  padding: 0;
  margin: 0;
}
::v-deep .theme--light.v-label {
  font-size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
