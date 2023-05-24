<template>
  <div
    id="upload-rules"
    class="section-container overflow-hidden px-0 py-0"
  >
    <header>
      <ul
        class="mt-5"
      >
        <li class="mt-1">
          <span class="ml-2">Must be set to fit onto 8.5" x 11" letter-size paper</span>
        </li>
        <li class="mt-1">
          <span class="ml-2">Use a white background and a legible font with contrasting
            font colour</span>
        </li>
        <li class="mt-1">
          <span class="ml-2">PDF file type (maximum 30 MB file size)</span>
        </li>
      </ul>
    </header>
    <div
      class="mt-6"
      :class="{ 'invalid-label': invalidSection }"
    >
      <FileUploadPdf
        ref="fileUploadRef"
        class="flex-grow-1"
        customErrorMSg="Rules document required"
        :isRequired="true"
        :pageSize="PageSizes.LETTER_PORTRAIT"
        :file="file"
        :fileKey="fileKey"
        :maxSize="30"
        :getPresignedUrl="LegalServices.getPresignedUrl"
        :uploadToUrl="LegalServices.uploadToUrl"
        :userId="userKeycloakGuid"
        @update:file="updateFile"
        @update:fileKey="updateDocumentKey"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF, FormIF, RulesMemorandumIF } from '@/interfaces'
import { PageSizes } from '@/enums/'
import FileUploadPdf from '@/components/common/FileUploadPdf.vue'
import { useStore } from '@/store/store'
import { LegalServices } from '@/services/'

@Component({
  components: {
    FileUploadPdf
  }
})
export default class UploadRules extends Vue {
  @Getter(useStore) getSpecialResolutionRules!: RulesMemorandumIF
  @Getter(useStore) getUserInfo!: any

  @Action(useStore) setSpecialResolutionRules!: ActionBindingIF

  @Prop({ default: false })
  readonly invalidSection: boolean

  readonly LegalServices = LegalServices
  readonly PageSizes = PageSizes

  file: File = null
  fileKey: string = null

  $refs!: {
    fileUploadRef: FormIF,
  }

  get userKeycloakGuid (): string {
    return this.getUserInfo?.keycloakGuid
  }

  updateFile (file: File): void {
    this.file = file
  }

  updateDocumentKey (fileKey: string): void {
    // Ensure we aren't setting it to undefined.
    this.fileKey = fileKey || null
  }

  getNewRulesNameAndKey (): RulesMemorandumIF {
    return { name: this.file.name, key: this.fileKey }
  }

  validate (): boolean {
    // Validates file field and checkbox.
    return this.$refs.fileUploadRef.validate()
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  :deep(.invalid-label) {
    .v-label {
      color: $app-red;
    }
  }
</style>
