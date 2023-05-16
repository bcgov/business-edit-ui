<template>
  <v-card
    id="memorandum"
    flat
  >
    <!-- Header -->
    <div class="section-container header-container">
      <v-icon color="appDkBlue">
        mdi-format-list-text
      </v-icon>
      <label class="font-weight-bold pl-2">Memorandum</label>
    </div>

    <v-form ref="memorandumForm">
      <div
        id="memorandum-section"
        class="section-container"
        :class="{'invalid-section': memorandumEditingInvalid}"
      >
        <v-row
          no-gutters
          class="mt-4"
        >
          <v-col
            cols="2"
            class="pr-2"
          >
            <label
              id="memorandum-title"
              :class="{'invalid-text': memorandumEditingInvalid}"
            >
              <strong>Memorandum</strong>
            </label>
            <v-col md="1">
              <v-chip
                v-if="hasChanged"
                id="corrected-lbl"
                x-small
                label
                color="primary"
                text-color="white"
              >
                {{ getEditedLabel }}
              </v-chip>
            </v-col>
          </v-col>

          <!-- Display Mode -->
          <template v-if="!hasChanged">
            <v-col
              :cols="isEditing ? 10 : 9"
              class="pr-2"
            >
              <div v-if="!isEditing">
                <div
                  v-if="!getMemorandum || !getMemorandum.key"
                  class="mx-4"
                >
                  <span
                    id="memorandum-paper-not-changed"
                    class="ml-7"
                  >Available on paper only</span>
                  <span
                    v-if="lastUploadedDetails"
                    class="mt-1 last-modified-details"
                  >
                    {{ lastUploadedDetails }}
                  </span>
                </div>
                <div
                  v-else
                  class="mx-4"
                >
                  <div
                    :key="getMemorandum.key"
                    class="download-link-container"
                  >
                    <v-icon
                      color="primary"
                      class="mt-n1"
                    >
                      mdi-file-pdf-outline
                    </v-icon>
                    <!-- Existing memorandum -->
                    <a
                      class="ml-1"
                      download
                      @click="openPdf()"
                    >
                      {{ getMemorandum.name }}
                    </a>
                    <span
                      v-if="lastUploadedDetails"
                      class="mt-1 last-modified-details"
                    >
                      {{ lastUploadedDetails }}
                    </span>
                  </div>
                </div>
              </div>

              <div
                v-if="isEditing"
                class="px-4 pt-0 section-container"
              >
                <v-checkbox
                  id="chk-memorandum-in-resolution"
                  v-model="memorandumInResolution"
                  hide-details
                  :rules="confirmCompletionMemorandum"
                >
                  <template #label>
                    <span
                      id="memorandum-in-resolution-text"
                      :class="{'invalid-text': memorandumEditingInvalid}"
                    >
                      The memorandum has changed and I will describe those changes in the Special Resolution.
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <v-row
                v-if="isEditing"
                id="memorandum-confirmation-buttons"
                no-gutters
                class="justify-end pr-8 pb-8 mt-8"
              >
                <v-btn
                  id="btn-memorandum-done"
                  large
                  color="primary"
                  class="mr-2"
                  @click="saveMemorandum()"
                >
                  <span>Done</span>
                </v-btn>
                <v-btn
                  large
                  outlined
                  color="primary"
                  @click="resetMemorandum()"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-row>
            </v-col>
          </template>

          <!-- Editing Mode -->
          <v-col
            v-if="hasChanged"
            cols="9"
          >
            <div
              class="mx-4"
            >
              <div
                class="download-link-container"
              >
                <div
                  v-if="getMemorandum && getMemorandum.key"
                  :key="getMemorandum.key"
                  class="mb-2"
                >
                  <v-icon
                    color="primary"
                    class="mt-n1"
                  >
                    mdi-file-pdf-outline
                  </v-icon>

                  <!-- New Memorandum -->
                  <a
                    class="ml-1"
                    download
                    @click="openPdf()"
                  >
                    {{ getMemorandum.name }}
                  </a>
                  <span
                    v-if="lastUploadedDetails"
                    class="mt-1 last-modified-details"
                  >
                    {{ lastUploadedDetails }}
                  </span>
                </div>

                <!-- Paper only -->
                <div
                  v-else
                  class="mb-2"
                >
                  <span
                    id="memorandum-paper-changed"
                    class="ml-7"
                  >Available on paper only</span>
                  <br>
                  <br>
                </div>
                <v-icon
                  color="green darken-2"
                >
                  mdi-check
                </v-icon>
                <span
                  id="memorandum-changes-included-resolution"
                  class="ml-1 d-inline-flex"
                >
                  {{ getMemorandum && getMemorandum.previouslyInResolution ? 'New ' : ' ' }}
                  Changes will be described in the special resolution text.
                </span>
              </div>
            </div>
          </v-col>
          <v-col
            v-if="hasChanged"
            cols="1"
            class="pt-0 mt-n2 align-right"
          >
            <div class="actions mr-4">
              <v-btn
                id="memorandum-undo"
                text
                color="primary"
                class="undo-action"
                @click="resetMemorandum()"
              >
                <v-icon small>
                  mdi-undo
                </v-icon>
                <span>Undo</span>
              </v-btn>
            </div>
          </v-col>
          <v-col
            v-if="!isEditing && !hasChanged"
            cols="1"
            class="mt-n2"
          >
            <v-btn
              id="btn-change-memorandum"
              text
              color="primary"
              @click="isEditing = true"
            >
              <v-icon small>
                mdi-pencil
              </v-icon>
              <span>Change</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { HelpSection } from '@/components/common/'
import { ActionBindingIF, EntitySnapshotIF, RulesMemorandumIF } from '@/interfaces'
import DateUtilities from '@/services/date-utilities'
import { FormIF } from '@bcrs-shared-components/interfaces'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { LegalServices } from '@/services'

@Component({
  components: {
    HelpSection
  }
})
export default class Memorandum extends Vue {
    @Getter(useStore) getComponentValidate!: boolean
    @Getter(useStore) getMemorandum!: RulesMemorandumIF
    @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
    @Getter(useStore) getEditedLabel!: string
    @Getter(useStore) hasMemorandumChanged!: boolean

    @Action(useStore) setMemorandum!: ActionBindingIF
    @Action(useStore) setMemorandumValid!: ActionBindingIF

    $refs!: {
      memorandumForm: FormIF
    }

    hasChanged = false
    isEditing = false
    memorandumInResolution = false

    confirmCompletionMemorandum = [
      (v) => { return !!v }
    ]

    created (): void {
      this.hasChanged = this.hasMemorandumChanged
    }

    get lastUploadedDetails (): string {
      const memorandum = this.getMemorandum
      if (!memorandum) return ''
      if (memorandum.previouslyInResolution) {
        let uploadedDetails = ''
        if (memorandum.key) {
          uploadedDetails +=
            `This document was uploaded on ${DateUtilities.apiToPacificDateLong(memorandum.uploaded)}.`
        } else {
          return 'Please refer to the special resolution filed previously to view any changes to the memorandum.'
        }
        if (memorandum.uploaded) {
          uploadedDetails +=
            ' Please refer to the special resolution filed after this date to view any changes to the memorandum.'
        }
        return uploadedDetails
      } else if (memorandum.uploaded) {
        return `Uploaded ${DateUtilities.apiToPacificDateLong(memorandum.uploaded)}`
      } else {
        return ''
      }
    }

    get memorandumEditingInvalid (): boolean {
      return this.getComponentValidate && this.isEditing
    }

    openPdf (): void {
      const memorandum = this.getMemorandum
      if (!memorandum.url) return
      LegalServices.fetchDocument({
        title: 'Certified Memorandum',
        filename: memorandum.name,
        link: memorandum.url
      })
    }

    resetMemorandum (): void {
      this.hasChanged = false
      this.isEditing = false
      this.setMemorandum({
        ...this.getMemorandum,
        includedInResolution: false
      })
    }

    saveMemorandum (): void {
      if (this.validate(false)) {
        this.hasChanged = true
        this.isEditing = false
        this.setMemorandum({
          ...this.getMemorandum,
          includedInResolution: true
        })
      }
    }

    validate (includeIsEditing: boolean): boolean {
      // This validates the checkbox.
      let memorandumValid = this.$refs.memorandumForm.validate()
      if (includeIsEditing) {
        memorandumValid = memorandumValid && !this.isEditing
      }
      this.setMemorandumValid(memorandumValid)
      return memorandumValid
    }

    // Higher level component validation - when Review and Certify is pressed.
    @Watch('getComponentValidate')
    onComponentValidate (): void {
      this.validate(true)
    }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  a {
      display: inline-flex;
      text-decoration: none;
  }

  header {
    p {
      padding-top: 0.5rem;
    }
  }

  ul {
    list-style: none;
    color: $gray7;
  }

  #memorandum-confirmation-buttons {
    //  ensure both Done and cancel buttons are the same width
    .v-btn {
      min-width: 6rem;
    }
  }

  .section-container {
    color: black;
  }

  .last-modified-details {
    display: inline-flex;
    font-size: .75rem;
    line-height: 1.25rem;
    margin-left: 30px;
  }

  .header-container {
    display: flex;
    background-color: $BCgovBlue5O;
  }

  .actions {
    position: absolute;
    right: 0;

    .v-btn {
      min-width: 0.5rem;
    }
  }

  .undo-action {
      border: 0;
  }

  :deep() {
    .v-label {
      font-weight: normal;
    }
    .v-input--selection-controls {
      padding-top: 0;
      margin-top: 0;
    }
  }
</style>
