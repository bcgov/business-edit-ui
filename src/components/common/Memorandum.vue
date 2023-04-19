<template>
    <div id="upload-rules">

      <v-card flat>

        <!-- Header -->
        <div class="section-container header-container">
          <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
            <label class="font-weight-bold pl-2">Memorandum</label>
        </div>

        <div class="section-container">
          <v-row no-gutters class="mt-4">
            <v-col cols="2" class="pr-2">
              <label>
                <strong>Memorandum</strong>
              </label>
              <v-flex md1>
                <v-chip
                  v-if="isEditingMemorandum"
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
            <template v-if="!isEditingMemorandum">
              <v-col :cols="selectChange ? 10 : 9" class="pr-2">
                <!-- Edit Mode -->
                <!-- Instructional Text -->
                <div v-if="!selectChange && getMemorandum?.length <= 0" class="mx-4">
                  Available on paper only
                </div>
                <div v-if="!selectChange && getMemorandum?.length > 0" class="mx-4">
                  <div class="download-link-container" v-for="memorandum in getMemorandum" :key="memorandum.key">
                    <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                    <a :href="memorandum.url" download class="ml-1">
                      {{memorandum.name}}
                    </a>
                  </div>
                </div>

                <div v-if="selectChange" class="px-4 my-2 pt-0 section-container">
                    <v-checkbox
                      ref=""
                      id="chk-rules-describe"
                      class="chk-lable"
                      hide-details
                      v-model="describeMemorandum"
                    ></v-checkbox>
                    <span>The memorandum has changed and I will describe those changes in the Special Resolution.</span>
                </div>

                <v-row v-if="selectChange" id="rules-confirmation-buttons"
                  no-gutters class="justify-end pr-8 pb-8 mt-8">
                  <v-btn large color="primary" class="mr-2" @click="saveMemorandum($event)">
                    <span>Done</span>
                  </v-btn>
                  <v-btn large outlined color="primary" @click="resetMemorandum($event)">
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
                    <div v-if="getMemorandum?.length > 0" class="mx-4">
                        <div class="download-link-container" v-for="memorandum in getMemorandum" :key="memorandum.key">
                            <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                            <a :href="memorandum.documentURL" download class="ml-1">
                            {{memorandum.name}}
                            </a>
                        </div>
                    </div>
                    <div v-if="selectChange" class="px-4 my-2 pt-0 py-5 section-container">
                        <span>Changes will be described in the special resolution text.</span>
                    </div>
                  </v-col>
                  <v-col cols="2" class="pt-0 mt-n2 align-right">

                    <!-- Actions -->
                    <div class="actions mr-4">
                      <v-btn
                        text color="primary"
                        id="rules-undo"
                        class="undo-action"
                        @click="resetMemorandum()"
                      >
                        <v-icon small>mdi-undo</v-icon>
                        <span>Undo</span>
                      </v-btn>

                      <!-- Drop Down Actions -->
                      <span class="more-actions" v-if="!selectChange">
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
                              @click="isEditingMemorandum = true; dropdown = false; selectChange = true"
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
            <v-col cols="1" v-if="!selectChange && !isEditingMemorandum">
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
import { FormIF } from '@bcrs-shared-components/interfaces'
// import { FileUploadMixin } from '@bcrs-shared-components/mixins'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'

@Component({
  components: {
    FileUploadPreview,
    HelpSection
  }
})
export default class Memorandum extends Vue {
    $refs!: {
      confirmMemorandumChk: FormIF
    }
    protected dropdown = false
    protected confirmed = false
    protected helpToggle = false
    protected isEditingMemorandum = false
  protected selectChange = false
    protected describeMemorandum = false
    protected uploadDropdown = false

    @Getter(useStore) getNameRequestLegalName!: string
    @Getter(useStore) getMemorandum!: RulesMemorandumIF[]
    @Getter(useStore) getMemorandumResource!: RulesMemorandumResourceIF
    @Getter(useStore) invalidMemorandumSection!: boolean
    @Getter(useStore) getUserKeycloakGuid!: string // TODO: replace this
    @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
    @Getter(useStore) getUserFirstName!: string
    @Getter(useStore) getUserLastName!: string
    @Getter(useStore) getEditedLabel!: string

    @Action(useStore) setMemorandum!: ActionBindingIF
    @Action(useStore) setMemorandumValidity!: ActionBindingIF

    private confirmCompletionMemorandum = [
      (v) => { return !!v }
    ]

    private resetMemorandum (): void {
      this.selectChange = false
      this.isEditingMemorandum = false
    //   this.setMemorandum(this.getEntitySnapshot.businessInfo)
    }

    /** Trigger form submission */
    private saveMemorandum (): void {
      // if (this.isFormValid) {
      //   this.isLoading = true
      //   this.formType = this.currentFormType
      //   this.isEditingMemorandum = false
      // } else this.validMemorandumChange = true
      this.selectChange = false
      this.isEditingMemorandum = true
    }

    /* Assumes the data is already saved in the store */
    created (): void {
      this.confirmed = this.getMemorandum?.confirmed
    }

    get confirmSectionContent (): string[] {
      return this.getMemorandumResource?.confirm
    }

    get urlDownload (): string {
      return this.getMemorandum?.url
    }

    @Watch('confirmed')
    private hasValidationChanged (): void {
      this.setMemorandum({
        ...this.getMemorandum,
        confirmed: this.confirmed
      })
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
