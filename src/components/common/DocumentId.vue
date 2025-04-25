<template>
  <section
    id="document-id"
    class="mt-10"
  >
    <header>
      <h2>{{ sectionNumber }} Document ID</h2>
      <p
        class="mt-4"
      >
        Enter or select your document ID preference. Upon submission,
        a document record will be created with the details from this registration.
      </p>
    </header>

    <DocumentIdShared
      :docApiUrl="getDrsApiUrl"
      :docApiKey="getDrsApiKey"
      :validate="getAppValidate"
      @updateDocId="docId = $event"
      @isValid="isDocIdValid = $event"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'

// Components
import { DocumentId as DocumentIdShared } from '@bcrs-shared-components/document-id/'

// Interfaces and Enums
import { DocumentIdIF, FlagsReviewCertifyIF } from '@/interfaces/'

import { useStore } from '@/store/store'

@Component({
  components: {
    DocumentIdShared
  }
})
export default class DocumentId extends Vue {
  // Store getters
  @Getter(useStore) getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getDocumentIdState!: DocumentIdIF

  // Store actions
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void
  @Action(useStore) setDocumentIdStateValidity!: (x: boolean) => void

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  docId = ''
  isDocIdValid = false

  mounted (): void {
    this.docId = this.getDocumentIdState.consumerDocumentId
    this.isDocIdValid = this.getDocumentIdState.valid
  }
  /** Get Document Record Service API URL */
  get getDrsApiUrl (): string {
    return sessionStorage.getItem('DOC_API_URL')
  }

  get getDrsApiKey (): string {
    return sessionStorage.getItem('DOC_API_KEY')
  }

  @Watch('docId', { immediate: true })
  @Watch('isDocIdValid', { immediate: true })
  // Update Document Id state
  private onDocumentIdStateChange (): void {
    this.setDocumentIdState({
      valid: this.isDocIdValid,
      consumerDocumentId: this.docId
    })
    this.setDocumentIdStateValidity(this.isDocIdValid)
  }
}
</script>
