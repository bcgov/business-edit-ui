<template>
    <div class="section-container overflow-hidden px-0 py-0">
      <header>
        <ul class="mt-5 pl-0" style="list-style: none">
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
      <div class="mt-6" :class="{ 'invalid-section': invalidSection && !hasValidUploadFile }">
        <FileUploadPreview
            :inputFileLabel="inputFileLabel"
            :maxSize="MAX_FILE_SIZE"
            :pdfPageSize="PdfPageSize.LETTER_SIZE"
            :inputFile="document"
            :showErrors="invalidSection"
            :customErrorMessage="uploadErrorMsg"
            @isFileValid="isFileUploadValid($event)"
            @fileSelected="fileSelected($event)"
        />
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF, RulesMemorandumIF } from '@/interfaces'
import { ItemTypes, PdfPageSize } from '@/enums/'
// import { FileUploadMixin } from '@bcrs-shared-components/mixins'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadRulesMemorandum extends Vue {
  @Prop({ default: false })
  readonly invalidSection: boolean
  @Prop({ default: null })
  readonly inputFileLabel: string
  @Prop({ default: null })
  readonly note!: string
  @Prop({ default: false })
  readonly isMemorandum!: boolean

  // Enum for template
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  @Getter(useStore) getMemorandum!: RulesMemorandumIF
  @Getter(useStore) getRules!: RulesMemorandumIF
  @Getter(useStore) getUserKeycloakGuid!: string // TODO: replace this

  @Action(useStore) setMemorandum!: ActionBindingIF
  @Action(useStore) setRules!: ActionBindingIF

  /* Assumes the data is already saved in the store */
  created (): void {
    const data = this.isMemorandum ? this.getMemorandum : this.getRules
    this.document = data as File
    this.documentKey = data?.key
    this.hasValidUploadFile = !!this.documentKey
  }

  /* File upload preview component changes this state */
  private isFileUploadValid (val) {
    this.hasValidUploadFile = val
  }

  /* File upload preview component changes this state */
  private async fileSelected (file) {
    // reset state of file uploader to ensure not in manual error mode
    this.uploadErrorMsg = ''
    this.documentKey = null
    if (!file) {
      this.document = null
    } else {
      this.document = file
      await this.uploadFileAndUpdateStore()
    }
  }

  private async uploadFileAndUpdateStore () {
    const documentResponse = await this.uploadDocsToStorage('KEYCLOAK_GUID')
    if (documentResponse) {
      if (this.isMemorandum) {
        this.setMemorandum({ ...documentResponse })
      } else {
        this.setRules({ ...documentResponse })
      }
    } else {
      // put file uploader into manual error mode by passing custom error message
      this.uploadErrorMsg = this.UPLOAD_FAILED_MESSAGE
      this.hasValidUploadFile = false
    }
  }

  @Watch('documentKey')
  private updateDocumentKey (newValue: string) {
    if (this.isMemorandum) {
      this.setMemorandum({
        ...this.getMemorandum,
        key: newValue
      })
    } else {
      this.setRules({
        ...this.getRules,
        key: newValue
      })
    }
  }

  @Watch('hasValidUploadFile')
  private hasValidationChanged (newValue: boolean): void {
    if (this.isMemorandum) {
      this.setMemorandum({
        ...this.getMemorandum,
        valid: newValue
      })
    } else {
      this.setRules({
        ...this.getRules,
        valid: newValue
      })
    }
  }
}
</script>
