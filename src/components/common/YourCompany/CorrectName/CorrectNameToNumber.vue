<template>
  <v-form
    id="correct-name-to-number-form"
    lazy-validation
  >
    <v-row no-gutters>
      <v-col>
        <v-checkbox
          id="correct-name-to-number-checkbox"
          v-model="correctToNumbered"
          class="mb-n5"
          :label="`Change the company name to ${businessId} B.C. ${getUpdatedName}`"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
// Libraries
import Vue from 'vue'
import { Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { Action, Getter } from 'pinia-class'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'
import { CorrectNameOptions } from '@/enums/'
import { useStore } from '@/store/store'

@Component({})
export default class CorrectNameToNumber extends Vue {
  /** Form Submission Prop */
  @Prop({ default: null }) readonly formType!: CorrectNameOptions

  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestLegalName!: (x: string) => void

  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getOriginalLegalType!: CorpTypeCd
  @Getter(useStore) getUpdatedName!: string

  // Local properties
  correctToNumbered = false

  get businessId (): string {
    return this.getBusinessId && this.getBusinessId.substring(2)
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    // this component should only see correct-name-to-number form type
    if (this.formType === CorrectNameOptions.CORRECT_NAME_TO_NUMBER) {
      // delete the current NR number (if any)
      this.setNameRequest({
        ...this.getNameRequest,
        nrNum: undefined
      } as any)
      // delete the current legal name (if any)
      this.setNameRequestLegalName(null)
      this.emitSaved(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('saved')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitSaved (saved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('correctToNumbered')
  @Emit('valid')
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

:deep(.theme--light.v-label) {
  font-size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
