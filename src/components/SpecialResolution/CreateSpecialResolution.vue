<template>
  <v-card
    v-if="showCreateSpecialResolution"
    id="create-special-resolution"
    flat
  >
    <!-- Header -->
    <article class="header-container section-container">
      <v-icon color="appDkBlue">
        mdi-handshake
      </v-icon>
      <label class="font-weight-bold pl-2">Special Resolution</label>
    </article>

    <v-card
      flat
      :class="{'invalid-section': invalidCreateSpecialResolutionSection}"
    >
      <InstructionalText />

      <HelpSpecialResolution />

      <section
        id="resolution-date-section"
        class="section-container mt-4"
      >
        <header id="resolution-date-header">
          <h2>Special Resolution</h2>
        </header>
        <p class="section-description mt-2">
          Enter the date the special resolution passed and the text as it appears on your printed form.
        </p>
        <v-form ref="resolutionForm">
          <ResolutionEditor />
          <SigningParty />
        </v-form>
      </section>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF } from '@/interfaces/'
import HelpSpecialResolution from './HelpSpecialResolution.vue'
import InstructionalText from './InstructionalText.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces/'
import { useStore } from '@/store/store'
import ResolutionEditor from './ResolutionEditor.vue'
import SigningParty from './SigningParty.vue'

@Component({
  components: {
    DatePickerShared,
    HelpSpecialResolution,
    InstructionalText,
    ResolutionEditor,
    SigningParty
  }
})
export default class CreateSpecialResolution extends Vue {
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) getSpecialResolutionFormValid!: boolean
  @Getter(useStore) showCreateSpecialResolution!: boolean

  @Action(useStore) setSpecialResolution!: ActionBindingIF

  $refs!: {
    resolutionForm: HTMLFormElement
  }

  /** The section validity state (when prompted by app). */
  get invalidCreateSpecialResolutionSection (): boolean {
    return !this.getSpecialResolutionFormValid
  }

  /** Set validate on file and pay click. */
  @Watch('getComponentValidate')
  private updateResolutionValidationDetail (): void {
    this.$refs.resolutionForm.validate()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

:deep(label.v-label.theme--light) {
  color: $gray7 !important;
  font-weight: normal;
}

// show error color for label and placeholder
:deep() {
  .invalid-section label,
  .invalid-section label.v-label.error--text {
    color: $BCgovInputError !important;
  }
}
</style>
