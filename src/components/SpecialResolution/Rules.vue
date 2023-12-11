<template>
  <div id="rules">
    <v-card flat>
      <!-- Header -->
      <div class="section-container header-container">
        <v-icon color="appDkBlue">
          mdi-format-list-text
        </v-icon>
        <label class="font-weight-bold pl-2">Rules</label>
      </div>
      <v-form ref="rulesForm">
        <div
          class="section-container"
          :class="{'invalid-section': rulesEditingInvalid}"
        >
          <v-row
            no-gutters
            class="mt-4"
          >
            <v-col
              :cols="isEditing ? 2 : 3"
            >
              <label :class="{'error-text': rulesEditingInvalid}">
                <strong>Rules</strong>
              </label>
              <v-col
                md="1"
                class="pa-0"
              >
                <v-chip
                  v-if="hasChanged"
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
                class="pr-2"
              >
                <div
                  v-if="!isEditing"
                >
                  <div
                    v-if="!getSpecialResolutionRules || !getSpecialResolutionRules.key"
                  >
                    <span
                      id="rules-paper-not-changed"
                      class="ml-7 d-block info-text"
                    >
                      Available on paper only
                    </span>
                  </div>
                  <div
                    v-else
                  >
                    <div
                      :key="getSpecialResolutionRules.key"
                      class="download-link-container"
                    >
                      <v-icon
                        color="primary"
                        class="mt-n1"
                      >
                        mdi-file-pdf-outline
                      </v-icon>
                      <a
                        download
                        class="ml-1"
                        @click="openPdf()"
                      >
                        {{ getSpecialResolutionRules.name }}
                      </a>
                    </div>
                  </div>
                  <span
                    v-if="lastUploadedDetails"
                    class="mt-1 mb-2 last-modified-details info-text"
                  >
                    {{ lastUploadedDetails }}
                  </span>
                </div>
                <div v-else>
                  <div
                    v-if="hasResolutionOnFile"
                    class="pt-0 instructional-text section-container"
                    :class="{'error-text': rulesEditingInvalid}"
                  >
                    You can update the rules of association in one of the following ways:
                  </div>
                  <v-divider
                    v-if="hasResolutionOnFile"
                    class="mx-8"
                  />
                  <section
                    v-if="hasResolutionOnFile"
                    class="py-4 section-container"
                  >
                    <v-btn
                      id="btn-describe-rules"
                      text
                      block
                      color="primary"
                      class="pl-0 ml-0"
                      style="font-size: 1rem"
                      @click="rulesInResolution = false; rulesInUpload = false;
                              uploadDropdown = false; describeDropdown = !describeDropdown"
                    >
                      <v-expand-transition>
                        <span :class="{'black-bold-font' : describeDropdown}">
                          Describe the rule changes within the special resolution</span>
                      </v-expand-transition>
                      <v-spacer class="spacer" />
                      <v-icon>{{ describeDropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                    </v-btn>
                    <v-checkbox
                      v-if="describeDropdown"
                      id="chk-rules-describe"
                      v-model="rulesInResolution"
                      hide-details
                      class="mb-2"
                      :rules="confirmCompletionRules"
                    >
                      <template #label>
                        <div>The rules have changed and I will describe those changes in the Special Resolution.</div>
                      </template>
                    </v-checkbox>
                  </section>
                  <v-divider
                    v-if="hasResolutionOnFile"
                    class="mx-8"
                  />
                  <section :class="{'section-container': hasResolutionOnFile}">
                    <v-btn
                      id="btn-upload-rules"
                      text
                      block
                      color="primary"
                      class="pl-0 ml-0"
                      style="font-size: 1rem"
                      @click="rulesInUpload = false; rulesInResolution = false;
                              describeDropdown = false; uploadDropdown = !uploadDropdown"
                    >
                      <span
                        :class="{'black-bold-font' : uploadDropdown || !hasResolutionOnFile}"
                      >
                        Upload a new full set of the rules PDF document
                      </span>
                      <v-spacer class="spacer" />
                      <v-icon v-if="hasResolutionOnFile">
                        {{ uploadDropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}
                      </v-icon>
                    </v-btn>
                    <UploadRulesOrMemorandum
                      v-if="uploadDropdown || !hasResolutionOnFile"
                      ref="uploadRulesRef"
                      :invalidSection="rulesEditingInvalid"
                    />
                    <!-- Confirmation -->
                    <v-expand-transition>
                      <header v-if="uploadDropdown">
                        <v-checkbox
                          id="chk-rules-upload"
                          v-model="rulesInUpload"
                          hide-details
                          :rules="confirmCompletionRules"
                        >
                          <template #label>
                            <div>
                              I confirm the following items are included as
                              required in the Rules of the Association:
                            </div>
                          </template>
                        </v-checkbox>
                        <ul
                          class="mt-5 ml-6"
                        >
                          <li class="mt-1">
                            <span class="info-text">The Cooperative name is identified
                              <strong>exactly</strong> as follows throughout the Rules of the Association:
                              <strong>{{ getNameRequestLegalName }}</strong>
                            </span>
                          </li>
                          <li class="mt-1">
                            <span class="info-text">
                              The full and complete Rules of the Association are being uploaded.
                            </span>
                          </li>
                        </ul>
                      </header>
                    </v-expand-transition>
                  </section>
                  <v-divider
                    v-if="hasResolutionOnFile"
                    class="mx-8"
                  />

                  <v-row
                    id="rules-confirmation-buttons"
                    no-gutters
                    class="justify-end pr-8 pb-8 mt-8"
                  >
                    <v-btn
                      id="btn-rules-done"
                      large
                      color="primary"
                      class="mr-2"
                      @click="saveRules()"
                    >
                      <span>Done</span>
                    </v-btn>
                    <v-btn
                      id="btn-rules-cancel"
                      large
                      outlined
                      color="primary"
                      @click="resetRules()"
                    >
                      <span>Cancel</span>
                    </v-btn>
                  </v-row>
                </div>
              </v-col>
            </template>
            <!-- Editing Mode -->
            <v-col
              v-else
              cols="8"
            >
              <section
                id="rules-actions-section"
              >
                <div
                  v-if="!isEditing"
                >
                  <div
                    class="download-link-container"
                  >
                    <v-icon
                      v-if="getSpecialResolutionRules && getSpecialResolutionRules.key"
                      color="primary"
                      class="mt-n1"
                      :class=" {'dropdown-active': !getSpecialResolutionRules.url}"
                    >
                      mdi-file-pdf-outline
                    </v-icon>
                    <a
                      v-if="getSpecialResolutionRules && getSpecialResolutionRules.key"
                      :key="getSpecialResolutionRules.key"
                      download
                      class="ml-1"
                      :class=" {'dropdown-active': !getSpecialResolutionRules.url}"
                      @click="openPdf()"
                    >
                      {{ getSpecialResolutionRules.name }}
                    </a>
                    <span
                      v-else
                      id="rules-paper-changed"
                      class="ml-7 mb-2 d-block info-text"
                    >
                      Available on paper only
                    </span>
                    <span
                      v-if="lastUploadedDetails"
                      class="mt-1 mb-2 last-modified-details info-text"
                    >
                      {{ lastUploadedDetails }}
                    </span>
                    <div
                      v-if="getSpecialResolutionRules.includedInResolution"
                    >
                      <v-icon
                        color="green darken-2"
                      >
                        mdi-check
                      </v-icon>
                      <span
                        id="rules-changes-included-resolution"
                        class="ml-1 d-inline-block info-text"
                      >{{ getSpecialResolutionRules.previouslyInResolution ? 'new' : '' }}
                        changes will be described in the special resolution text.</span>
                    </div>
                  </div>
                </div>
              </section>
            </v-col>
            <!-- Actions -->
            <v-col
              v-if="!isEditing && !hasChanged"
              cols="1"
              class="mt-n2 align-right"
            >
              <div class="actions mr-4">
                <v-btn
                  id="btn-change-rules"
                  text
                  color="primary"
                  @click="isEditing = true; rulesInResolution = false; rulesInUpload = false;
                          describeDropdown = false; uploadDropdown = false;"
                >
                  <v-icon small>
                    mdi-pencil
                  </v-icon>
                  <span>{{ getEditLabel }}</span>
                </v-btn>
              </div>
            </v-col>
            <v-col
              v-if="!isEditing && hasChanged"
              cols="1"
              class="pt-0 mt-n2 align-right"
            >
              <!-- Actions -->
              <div class="actions mr-4">
                <v-btn
                  id="rules-undo"
                  text
                  color="primary"
                  class="undo-action"
                  @click="resetRules()"
                >
                  <v-icon small>
                    mdi-undo
                  </v-icon>
                  <span>Undo</span>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </v-card>
  </div>
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
export default class Rules extends Vue {
    @Getter(useStore) getComponentValidate!: boolean
    @Getter(useStore) getSpecialResolutionRules!: RulesMemorandumIF
    @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
    @Getter(useStore) getUserFirstName!: string
    @Getter(useStore) getUserLastName!: string
    @Getter(useStore) getEditedLabel!: string
    @Getter(useStore) getEditLabel!: string
    @Getter(useStore) getSpecialResolutionRulesValid!: boolean
    @Getter(useStore) getNameRequestLegalName!: string
    @Getter(useStore) hasSpecialResolutionRulesChanged!: boolean
    @Getter(useStore) hasResolutionOnFile!: boolean

    @Action(useStore) setEditingRules!: (x: boolean) => void
    @Action(useStore) setSpecialResolutionRules!: (x: RulesMemorandumIF) => void
    @Action(useStore) setSpecialResolutionRulesValid!: (x: boolean) => void

    $refs!: {
      rulesForm: FormIF,
      uploadRulesRef: FormIF
    }
    describeDropdown = false
    hasChanged = false
    isEditing = false
    noOptionSelected = false
    rulesInResolution = false
    rulesInUpload = false
    uploadDropdown = false

    confirmCompletionRules = [
      (v) => { return !!v }
    ]

    created (): void {
      this.hasChanged = this.hasSpecialResolutionRulesChanged
    }

    get lastUploadedDetails (): string {
      const rules = this.getSpecialResolutionRules
      if (!rules) return ''
      if (rules.previouslyInResolution) {
        let uploadedDetails = ''
        if (rules.key) {
          uploadedDetails +=
            `This document was uploaded on ${DateUtilities.apiToPacificDateLong(rules.uploaded)}.`
        } else {
          return 'Please refer to the special resolution filed previously to view any changes to the rules.'
        }
        if (rules.uploaded) {
          uploadedDetails +=
            ' Please refer to the special resolution filed after this date to view any changes to the rules.'
        }
        return uploadedDetails
      } else if (rules.uploaded) {
        return `Uploaded ${DateUtilities.apiToPacificDateLong(rules.uploaded)}`
      } else {
        return ''
      }
    }

    get rulesEditingInvalid (): boolean {
      return this.noOptionSelected || (this.getComponentValidate && this.isEditing)
    }

    openPdf (): void {
      const rules = this.getSpecialResolutionRules
      if (!rules.url) return
      LegalServices.fetchDocument({
        title: 'Certified Rules',
        filename: rules.name,
        link: rules.url
      })
    }

    /** Initial rules for the business, this is loaded in when undo or cancel is pressed. */
    initialRules (): RulesMemorandumIF {
      const documentsInfo = this.getEntitySnapshot?.businessDocuments?.documentsInfo
      const documents = this.getEntitySnapshot?.businessDocuments?.documents
      return {
        includedInResolution: false,
        key: documentsInfo?.certifiedRules?.key || null,
        name: documentsInfo?.certifiedRules?.name,
        previouslyInResolution: documentsInfo?.certifiedRules?.includedInResolution,
        uploaded: documentsInfo?.certifiedRules?.uploaded,
        url: documents?.certifiedRules
      }
    }

    resetRules (): void {
      this.isEditing = false
      this.hasChanged = false
      this.noOptionSelected = false
      this.setSpecialResolutionRules({
        ...this.initialRules()
      })
    }

    async saveRules (): Promise<void> {
      if (this.validate(false)) {
        this.hasChanged = true
        this.isEditing = false
        let rules = this.getSpecialResolutionRules
        if (this.uploadDropdown || !this.hasResolutionOnFile) {
          rules = {
            ...rules,
            ...this.$refs.uploadRulesRef.getNewRulesNameAndKey(),
            includedInResolution: false,
            uploaded: DateUtilities.dateToApi(new Date()),
            url: null // No URL, because we can't currently re-download drafts securely from Minio.
          }
        } else {
          rules = {
            ...rules,
            includedInResolution: true
          }
        }
        await this.setSpecialResolutionRules(rules)
      }
    }

    validate (includeIsEditing: boolean): boolean {
      // Show error in section, if no option is selected.
      // No options when there is no resolution on file.
      this.noOptionSelected = this.hasResolutionOnFile
        ? (this.isEditing && !this.rulesInResolution && !this.rulesInUpload) : false
      // Validate the form.
      let rulesValid = this.$refs.rulesForm.validate() && !this.noOptionSelected
      // If we have the rules upload, validate the file.
      if (this.rulesInUpload && this.isEditing) {
        rulesValid = this.$refs.uploadRulesRef.validate() && rulesValid
      }
      // Ensure we aren't in the middle of a change, otherwise we need to change the section color to red.
      if (includeIsEditing) {
        rulesValid = rulesValid && !this.isEditing
      }
      this.setSpecialResolutionRulesValid(rulesValid)
      return rulesValid
    }

    // Higher level component validation - when Review and Certify is pressed.
    @Watch('getComponentValidate')
    onComponentValidate (): void {
      this.validate(true)
    }

    /* Used for isCorrectionEditing */
    @Watch('isEditing', { immediate: true })
    async onIsEditingChanged (value: boolean): Promise<void> {
      await this.setEditingRules(value)
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

header {
  p {
    padding-top: 0.5rem;
  }
}

#rules-changes-included-resolution:first-letter {
  text-transform: capitalize;
}

#rules-confirmation-buttons {
  //  ensure both Done and cancel buttons are the same width
  .v-btn {
    min-width: 6rem;
  }
}

.black-bold-font {
  color: $gray9 !important;
  font-weight: bold !important
}

.section-container {
  color: black;
}

.dropdown-active {
  color: rgba(0,0,0,.87) !important; cursor: auto;
}

:deep(#confirm-rules-section) {
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text{
    color: $app-dk-blue !important;
  }
}
.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

.rules-coop-name {
  display: block;
  min-width: 100%
}

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}

.last-modified-details {
  display: block;
  font-size: .75rem;
  line-height: 1.25rem;
  margin-left: 30px;
}

a {
  display: inline-flex;
  text-decoration: none;
}
.undo-action {
  border: 0;
}

/* Override bold weight to regular weight. */
:deep(.v-label) {
  font-weight: normal;
}
.instructional-text {
  color: $gray7;
}

</style>
