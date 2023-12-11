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
            :cols="isEditing ? 2 : 3"
          >
            <label
              id="memorandum-title"
              :class="{'error-text': memorandumEditingInvalid}"
            >
              <strong>Memorandum</strong>
            </label>
            <v-col
              md="1"
              class="pa-0"
            >
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
              :cols="isEditing ? 10 : 8"
            >
              <div v-if="!isEditing">
                <div
                  v-if="!getSpecialResolutionMemorandum || !getSpecialResolutionMemorandum.key"
                >
                  <span
                    id="memorandum-paper-not-changed"
                    class="ml-7 info-text"
                  >Available on paper only</span>
                  <span
                    v-if="lastUploadedDetails"
                    class="mt-1 last-modified-details d-block mb-2 info-text"
                  >
                    {{ lastUploadedDetails }}
                  </span>
                </div>
                <div
                  v-else
                >
                  <div
                    :key="getSpecialResolutionMemorandum.key"
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
                      {{ getSpecialResolutionMemorandum.name }}
                    </a>
                    <span
                      v-if="lastUploadedDetails"
                      class="mt-1 last-modified-details d-block mb-2 info-text"
                    >
                      {{ lastUploadedDetails }}
                    </span>
                  </div>
                </div>
              </div>

              <div
                v-if="isEditing"
                class="pt-0 section-container"
              >
                <v-checkbox
                  v-if="hasResolutionOnFile"
                  id="chk-memorandum-in-resolution"
                  v-model="memorandumInResolution"
                  hide-details
                  :rules="confirmCompletionMemorandum"
                >
                  <template #label>
                    <span
                      id="memorandum-in-resolution-text"
                      :class="{'error-text': memorandumEditingInvalid, 'info-text': true}"
                    >
                      The memorandum has changed and I will describe those changes in the Special Resolution.
                    </span>
                  </template>
                </v-checkbox>
                <span
                  v-if="!hasResolutionOnFile"
                  class="black-bold-font"
                >
                  Upload a new full set of the memorandum PDF document
                </span>
                <v-spacer class="spacer" />
                <UploadRulesOrMemorandum
                  v-if="!hasResolutionOnFile"
                  ref="uploadMemorandumRef"
                />
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
            cols="8"
          >
            <div>
              <div
                class="download-link-container"
              >
                <div
                  v-if="getSpecialResolutionMemorandum && getSpecialResolutionMemorandum.key"
                  :key="getSpecialResolutionMemorandum.key"
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
                    {{ getSpecialResolutionMemorandum.name }}
                  </a>
                </div>
                <!-- Paper only -->
                <div
                  v-else
                  class="mb-1"
                >
                  <span
                    id="memorandum-paper-changed"
                    class="ml-7 mb-2 info-text"
                  >Available on paper only</span>
                </div>
                <span
                  v-if="lastUploadedDetails"
                  class="mt-1 last-modified-details d-block mb-2 info-text"
                >
                  {{ lastUploadedDetails }}
                </span>
                <v-icon
                  color="green darken-2"
                >
                  mdi-check
                </v-icon>
                <span
                  id="memorandum-changes-included-resolution"
                  class="ml-1 d-inline-block info-text"
                >
                  {{ getSpecialResolutionMemorandum && getSpecialResolutionMemorandum.previouslyInResolution ?
                    'new ' : ' ' }}
                  changes will be described in the special resolution text.
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
            class="mt-n2 align-right"
          >
            <div class="actions mr-4">
              <v-btn
                id="btn-change-memorandum"
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
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { HelpSection } from '@/components/common/'
import { EntitySnapshotIF, RulesMemorandumIF } from '@/interfaces'
import DateUtilities from '@/services/date-utilities'
import { FormIF } from '@bcrs-shared-components/interfaces'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import UploadRulesOrMemorandum from './UploadRulesOrMemorandum.vue'
import { useStore } from '@/store/store'
import { LegalServices } from '@/services'

@Component({
  components: {
    HelpSection,
    UploadRulesOrMemorandum
  }
})
export default class Memorandum extends Vue {
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getSpecialResolutionMemorandum!: RulesMemorandumIF
  @Getter(useStore) hasSpecialResolutionMemorandumChanged!: boolean
  @Getter(useStore) hasResolutionOnFile!: boolean

  @Action(useStore) setEditingMemorandum!: (x: boolean) => void
  @Action(useStore) setSpecialResolutionMemorandumValid!: (x: boolean) => void
  @Action(useStore) setSpecialResolutionMemorandum!: (x: RulesMemorandumIF) => void

  $refs!: {
    memorandumForm: FormIF
    uploadMemorandumRef: FormIF
  }

  hasChanged = false
  isEditing = false
  memorandumInResolution = false

  readonly confirmCompletionMemorandum = [
    (v) => { return !!v }
  ]

  created (): void {
    this.hasChanged = this.hasSpecialResolutionMemorandumChanged
  }

  get lastUploadedDetails (): string {
    const memorandum = this.getSpecialResolutionMemorandum
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
    const memorandum = this.getSpecialResolutionMemorandum
    if (!memorandum.url) return
    LegalServices.fetchDocument({
      title: 'Certified Memorandum',
      filename: memorandum.name,
      link: memorandum.url
    })
  }

  /** Initial memorandum for the business, this is loaded in when undo or cancel is pressed. */
  initialMemorandum (): RulesMemorandumIF {
    const documentsInfo = this.getEntitySnapshot?.businessDocuments?.documentsInfo
    const documents = this.getEntitySnapshot?.businessDocuments?.documents
    return {
      includedInResolution: false,
      key: documentsInfo?.certifiedMemorandum?.key || null,
      name: documentsInfo?.certifiedMemorandum?.name,
      previouslyInResolution: documentsInfo?.certifiedMemorandum?.includedInResolution,
      uploaded: documentsInfo?.certifiedMemorandum?.uploaded,
      url: documents?.certifiedMemorandum
    }
  }

  resetMemorandum (): void {
    this.hasChanged = false
    this.isEditing = false
    this.setSpecialResolutionMemorandum({
      ...this.initialMemorandum()
    })
  }

  async saveMemorandum (): Promise<void> {
    if (this.validate(false)) {
      this.hasChanged = true
      this.isEditing = false
      let memorandum = this.getSpecialResolutionMemorandum
      if (!this.hasResolutionOnFile) {
        memorandum = {
          ...memorandum,
          ...this.$refs.uploadMemorandumRef.getNewRulesNameAndKey(),
          includedInResolution: false,
          uploaded: DateUtilities.dateToApi(new Date()),
          url: null // No URL, because we can't currently re-download drafts securely from Minio.
        }
      } else {
        memorandum = {
          ...this.getSpecialResolutionMemorandum,
          includedInResolution: true
        }
      }
      await this.setSpecialResolutionMemorandum(memorandum)
    }
  }

  validate (includeIsEditing: boolean): boolean {
    // This validates the checkbox.
    let memorandumValid = this.$refs.memorandumForm.validate() || !this.hasResolutionOnFile
    if (includeIsEditing) {
      memorandumValid = memorandumValid && !this.isEditing
    }
    this.setSpecialResolutionMemorandumValid(memorandumValid)
    return memorandumValid
  }

  // Higher level component validation - when Review and Certify is pressed.
  @Watch('getComponentValidate')
  onComponentValidate (): void {
    this.validate(true)
  }

  @Watch('isEditing', { immediate: true })
  async onIsEditingChanged (value: boolean): Promise<void> {
    await this.setEditingMemorandum(value)
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

#memorandum-changes-included-resolution:first-letter {
  text-transform: capitalize;
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
  margin-left: 28px;
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
  /* Override bold font for labels. */
  .v-label {
    font-weight: normal;
  }
  /* Align memorandum checkbox with Memorandum left side text.  */
  .v-input--selection-controls {
    padding-top: 0;
    margin-top: 0;
  }
}
</style>
