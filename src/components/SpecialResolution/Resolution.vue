<template>
  <v-card
    v-if="showSpecialResolutionResolution"
    id="resolution"
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
      :class="{'invalid-section': invalidResolutionSection}"
    >
      <InstructionalText />

      <HelpResolution />

      <section
        id="resolution-section"
        class="section-container"
      >
        <div
          id="resolution-header"
        >
          <v-row
            no-gutters
            class="mt-4"
          >
            <v-col>
              <h2>Special Resolution</h2>
              <v-chip
                v-if="isCoopCorrectionFiling && hasChanged"
                id="resolution-corrected-lbl"
                x-small
                label
                color="primary"
                text-color="white"
              >
                {{ getEditedLabel }}
              </v-chip>
            </v-col>
            <v-col class="align-right mt-n2">
              <div
                class="actions mr-4"
              >
                <v-btn
                  v-if="!isEditing && hasChanged && isCoopCorrectionFiling"
                  id="btn-resolution-undo"
                  text
                  color="primary"
                  class="undo-action"
                  @click="undoSpecialResolutionStore()"
                >
                  <v-icon small>
                    mdi-undo
                  </v-icon>
                  <span>Undo</span>
                </v-btn>
                <!-- Change behaviour for edit
                  - Special Resolution: show edit button when not editing
                  - Correction: show edit button when not editing and not changed
                  -->
                <v-btn
                  v-if="(!hasChanged || isSpecialResolutionFiling) && !isEditing"
                  id="btn-change-resolution"
                  text
                  color="primary"
                  @click="isEditing = true"
                >
                  <v-icon small>
                    mdi-pencil
                  </v-icon>
                  <span>{{ getEditLabel }}</span>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>

        <p
          v-if="isEditing"
          class="section-description mt-2 info-text"
        >
          Enter the date the special resolution passed and the text as it appears on your printed form.
        </p>

        <v-form ref="resolutionForm">
          <ResolutionEditor
            ref="resolutionEditor"
            :isEditing="isEditing"
          />
          <SigningParty
            ref="signingParty"
            :isEditing="isEditing"
          />
          <div
            v-if="isEditing"
            id="resolution-confirmation-buttons"
            no-gutters
            class="justify-end pb-8 mt-8 d-flex"
          >
            <v-btn
              id="btn-resolution-done"
              large
              color="primary"
              @click="updateSpecialResolutionStore()"
            >
              <span>Done</span>
            </v-btn>
            <v-btn
              v-if="isCoopCorrectionFiling"
              id="btn-resolution-cancel"
              large
              outlined
              color="primary"
              @click="undoSpecialResolutionStore()"
            >
              <span>Cancel</span>
            </v-btn>
          </div>
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
import HelpResolution from './HelpResolution.vue'
import InstructionalText from './InstructionalText.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { FormIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces/'
import { useStore } from '@/store/store'
import ResolutionEditor from './ResolutionEditor.vue'
import SigningParty from './SigningParty.vue'

@Component({
  components: {
    DatePickerShared,
    HelpResolution,
    InstructionalText,
    ResolutionEditor,
    SigningParty
  }
})
export default class Resolution extends Vue {
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) getSpecialResolutionFormValid!: boolean
  @Getter(useStore) isCoopCorrectionFiling: boolean
  @Getter(useStore) isSpecialResolutionFiling: boolean
  @Getter(useStore) showSpecialResolutionResolution!: boolean

  @Action(useStore) setEditingSpecialResolution!: ActionBindingIF
  @Action(useStore) setSpecialResolution!: ActionBindingIF

  $refs!: {
    resolutionEditor: FormIF,
    signingParty: FormIF,
    resolutionForm: HTMLFormElement
  }

  isEditing = true
  hasChanged = false

  /** Displays an invalid section to user if form is invalid. */
  get invalidResolutionSection (): boolean {
    return !this.getSpecialResolutionFormValid && this.isEditing
  }

  /** For ok button, stores using setSpecialResolution. */
  async updateSpecialResolutionStore (): Promise<void> {
    await this.$refs.resolutionEditor.onValidate(false)
    await this.$refs.signingParty.onValidate(false)
    if (this.getSpecialResolutionFormValid) {
      this.isEditing = false
      this.hasChanged = true
      await this.$refs.resolutionEditor.saveToStore()
      await this.$refs.signingParty.saveToStore()
    }
  }

  /** For cancel/undo button, stores using setSpecialResolution. */
  async undoSpecialResolutionStore (): Promise<void> {
    // Special Resolution has create functionality for the resolution, correction has edit functionality.
    if (this.isSpecialResolutionFiling) {
      this.isEditing = true
    } else {
      this.isEditing = false
    }
    this.hasChanged = false
    await this.$refs.resolutionEditor.undoToStore()
    await this.$refs.signingParty.undoToStore()
  }

  /** Set validate on file and pay click. */
  @Watch('getComponentValidate')
  updateResolutionValidationDetail (): void {
    this.$refs.resolutionForm.validate()
  }

  /* Show editable / non editable fields for child components. */
  @Watch('isCoopCorrectionFiling', { immediate: true })
  updateEditMode (val): void {
    this.isEditing = !val
  }

  /* Used for isCorrectionEditing */
  @Watch('isEditing', { immediate: true })
  async updateIsEditingSpecialResolution (val): Promise<void> {
    await this.setEditingSpecialResolution(val)
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

.actions .undo-action {
  border-right: 0px;
}

</style>
