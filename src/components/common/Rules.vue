<template>
    <div id="upload-rules">

      <v-card flat>

        <!-- Header -->
        <div class="section-container header-container">
          <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
            <label class="font-weight-bold pl-2">Rules</label>
        </div>

        <div class="section-container">
          <v-row no-gutters class="mt-4">
            <v-col cols="2" class="pr-2">
              <label>
                <strong>Rules</strong>
              </label>
              <v-flex md1>
                <v-chip
                  v-if="isEditingRules"
                  id="corrected-lbl"
                  x-small label
                  color="primary"
                  text-color="white"
                >
                  {{getEditedLabel}}
                </v-chip>
              </v-flex>
            </v-col>

            <!-- Display Mode -->
            <template v-if="!isEditingRules">
              <v-col :cols="selectChange ? 10 : 9" class="pr-2">
                <!-- Edit Mode -->
                <!-- Instructional Text -->
                <div v-if="!selectChange && getRules?.length <= 0" class="mx-4">
                  Available on paper only
                </div>
                <div v-if="!selectChange && getRules?.length > 0" class="mx-4">
                  <div class="download-link-container" v-for="rule in getRules" :key="rule.key">
                    <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                    <a :href="rule.url" download class="ml-1">
                      {{rule.name}}
                    </a>
                  </div>
                </div>

                <div v-if="selectChange" class="px-4 my-2 pt-0 section-container">
                  You can update the rules of association in one of the following ways:
                </div>
                <v-divider class="mx-4" />
                <!-- Describe -->
                <section class="px-4 py-2 section-container" v-if="selectChange">
                    <v-btn
                    text block
                    color="primary"
                    id="btn-describe-rules"
                    class="pl-0 ml-0 text-body-1"
                    v-on="on"
                    @click="describeDropdown = !describeDropdown">
                      <span :style="describeDropdown ? 'color: black !important; font-weight: bold !important' : ''">
                        Describe the rule changes within the special resolution</span>
                      <v-spacer class="spacer"></v-spacer>
                      <v-icon>{{describeDropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                    <v-checkbox
                      v-if="describeDropdown"
                      ref=""
                      id="chk-rules-describe"
                      class="chk-lable"
                      hide-details
                    >
                      <template v-slot:label>
                        <div>The rules have changed and I will describe those changes in the Special Resolution.</div>
                      </template>
                    </v-checkbox>
                </section>
                <v-divider class="mx-4" />
                <!-- Upload -->
                <section class="px-4 py-2 section-container" v-if="selectChange">
                    <v-btn
                    text block
                    color="primary"
                    id="btn-upload-rules"
                    class="pl-0 ml-0 text-body-1"
                    v-on="on"
                    @click="uploadDropdown = !uploadDropdown">
                      <span v-if="!uploadDropdown">
                        Upload a new rules PDF document</span>
                      <span v-else :style="'color: black !important; font-weight: bold !important'">
                        Upload a new full set of the rules PDF document</span>
                      <v-spacer class="spacer"></v-spacer>
                      <v-icon>{{uploadDropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                    <!-- Upload Rules -->
                    <UploadRulesMemorandum
                      v-if="uploadDropdown"
                      :invalidSection='invalidRulesSection'
                      inputFileLabel='Rules of Association'
                      note='Do not upload Housing Cooperative occupancy agreements.'
                      :isMemorandum="false"
                    />
                    <!-- Confirmation -->
                    <header v-if="uploadDropdown" >
                      <v-checkbox
                        ref=""
                        id="chk-rules-describe"
                        class="chk-lable"
                        hide-details
                      >
                        <template v-slot:label>
                          <div>TI confirm the following items are included as
                            required in the Rules of the Association:</div>
                        </template>
                      </v-checkbox>
                      <ul class="mt-5" style="list-style: none">
                        <li class="mt-1">
                          <v-icon>mdi-circle-small</v-icon>
                          <span class="ml-2">Must be set to fit onto 8.5" x 11" letter-size paper</span>
                        </li>
                        <li class="mt-1">
                          <v-icon>mdi-circle-small</v-icon>
                          <span class="ml-2">Use a white background and a legible font with contrasting
                            font colour</span>
                        </li>
                        <li class="mt-1">
                          <v-icon>mdi-circle-small</v-icon>
                          <span class="ml-2">PDF file type (maximum 30 MB file size)</span>
                        </li>
                      </ul>
                    </header>
                </section>
                <v-divider class="mx-4" />

                <v-row v-if="selectChange" id="rules-confirmation-buttons"
                  no-gutters class="justify-end pr-8 pb-8 mt-8">
                  <v-btn large color="primary" class="mr-2" @click="saveRules($event)">
                    <span>Done</span>
                  </v-btn>
                  <v-btn large outlined color="primary" @click="resetRules($event)">
                    <span>Cancel</span>
                  </v-btn>
                </v-row>
              </v-col>
            </template>
            <!-- Editing Mode -->
            <v-col cols="9" v-else>
              <section id="rules-actions-section" class="section-container">
                <v-row no-gutters>
                  <v-col cols="10">
                    <!-- <v-icon color="appDkBlue" class="mt-n1">mdi-file-pdf-outline</v-icon>
                    <a :href="urlDownload"
                      id="rules-pdf-download"
                      download
                      class="ml-1"
                    > {{ getRules.name }}
                    </a> -->
                    <div v-if="!selectChange && getRules?.length > 0" class="mx-4">
                    <div class="download-link-container" v-for="rule in getRules" :key="rule.key">
                      <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                      <a :href="documenrule.url" download class="ml-1">
                        {{rule.name}}
                      </a>
                    </div>
                </div>
                  </v-col>
                  <v-col cols="2" class="pt-0 mt-n2 align-right">

                    <!-- Actions -->
                    <div class="actions mr-4">
                      <v-btn
                        text color="primary"
                        id="rules-undo"
                        class="undo-action"
                        @click="resetRules()"
                      >
                        <v-icon small>mdi-undo</v-icon>
                        <span>Undo</span>
                      </v-btn>

                      <!-- Drop Down Actions -->
                      <span class="more-actions">
                        <v-menu
                          offset-y left nudge-bottom="4"
                          v-model="dropdown"
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn
                              text small color="primary"
                              id="rules-more-actions"
                              v-on="on"
                            >
                              <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item
                              id="rules-more-actions-edit"
                              class="v-list-item"
                              @click="isEditingRules = true; dropdown = false"
                            >
                              <v-list-item-subtitle>
                                <v-icon small color="primary">mdi-pencil</v-icon>
                                <span class="drop-down-action ml-1">Change</span>
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </section>
            </v-col>
            <!-- Actions -->
            <v-col cols="1" v-if="!selectChange && !isEditingRules">
              <v-btn
                text color="primary"
                id="btn-correct-company-name"
                @click="selectChange = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>Change</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </template>

<script lang="ts">
import Vue from 'vue'
import { HelpSection } from '@/components/common/'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { ActionBindingIF, EntitySnapshotIF, RulesMemorandumIF, RulesMemorandumResourceIF } from '@/interfaces'
import { ItemTypes, PdfPageSize } from '@bcrs-shared-components/enums'
import { FormIF } from '@bcrs-shared-components/interfaces'
// import { FileUploadMixin } from '@bcrs-shared-components/mixins'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import UploadRulesMemorandum from './UploadRulesMemorandum.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    FileUploadPreview,
    HelpSection,
    UploadRulesMemorandum
  }
})
export default class Rules extends Vue {
    $refs!: {
      confirmRulesChk: FormIF
    }
    protected dropdown = false
    protected confirmed = false
    protected helpToggle = false
    protected isEditingRules = false
    protected selectChange = false
    protected describeDropdown = false
    protected uploadDropdown = false

    @Getter(useStore) getNameRequestLegalName!: string
    @Getter(useStore) getRules!: RulesMemorandumIF[]
    @Getter(useStore) getRulesResource!: RulesMemorandumResourceIF
    @Getter(useStore) invalidRulesSection!: boolean
    @Getter(useStore) getUserKeycloakGuid!: string // TODO: replace this
    @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
    @Getter(useStore) getUserFirstName!: string
    @Getter(useStore) getUserLastName!: string
    @Getter(useStore) getEditLabel!: string
    @Getter(useStore) getEditedLabel!: string

    @Action(useStore) setRules!: ActionBindingIF
    @Action(useStore) setRulesValidity!: ActionBindingIF

    // Enum for template
    readonly ItemTypes = ItemTypes
    readonly PdfPageSize = PdfPageSize

    private confirmCompletionRules = [
      (v) => { return !!v }
    ]

    private resetRules (): void {
      this.selectChange = false
      this.isEditingRules = false
      this.setRules(this.getEntitySnapshot.businessInfo)
    }

    /** Trigger form submission */
    private saveRules (): void {
      // if (this.isFormValid) {
      //   this.isLoading = true
      //   this.formType = this.currentFormType
      //   this.isEditingRules = false
      // } else this.validRulesChange = true
      this.isEditingRules = true
      this.selectChange = false
    }

    /* Assumes the data is already saved in the store */
    created (): void {
      this.confirmed = this.getRules?.confirmed
    }

    get helpSectionHeader (): string {
      return this.getRulesResource?.helpSection?.header
    }

    get helpSectionText (): string {
      return this.getRulesResource?.helpSection?.helpText
    }

    get confirmSectionContent (): string[] {
      return this.getRulesResource?.confirm
    }

    get urlDownload (): string {
      return this.getRules?.url
    }

    @Watch('confirmed')
    private hasValidationChanged (): void {
      this.setRules({
        ...this.getRules,
        confirmed: this.confirmed
      })
    }

    /** Updates store initially and when isEditingRules property has changed. */
    @Watch('isEditingRules', { immediate: true })
    private onEditingRulesChanged (val: boolean): void {
      // this.setValidComponent({ key: 'isValidRule', value: !val })
      this.setRules(val)
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

  ul {
    list-style: none;
    color: $gray7;
  }

  .section-container {
    color: black;
  }

  .upload-rules-error-message {
    padding-top: 1.25rem;
    padding-left: 1.25rem;
    color: $app-blue;
  }

  .rules-help {
    #rules-help-header {
      display: flex;
      justify-content: center;
    }

    h2, h4 {
      padding: 1rem 0;
    }

    u {
      display: flex;
      direction: rtl;
    }

    a {
      text-decoration: none;
    }
  }

  ::v-deep #confirm-rules-section {
    // override default validation styling so checkbox does not turn red on validation error
    .v-input--selection-controls__input .error--text{
      color: $app-lt-gray !important;
    }
  }

  .chk-rules {
    color: $gray9;

    ::v-deep {
      .theme--light.v-icon {
        color: $gray9;
      }
      .v-label {
        line-height: 1.5rem;
        font-weight: normal;
        color: $gray7;
      }
    }
  }

  .upload-rules-vcard-title {
    font-size: $px-17;
    font-weight: bold;
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

    .undo-action {
      border-right: 1px solid $gray1;
    }

    .v-btn {
      min-width: 0.5rem;
    }
  }

  #rules-confirmation-buttons {
    //  ensure both Done and cancel buttons are the same width
    .v-btn {
      min-width: 6rem;
    }
  }

  #rules-pdf-download {
    text-decoration: none;
  }
  </style>
