// This comes back from the business API documents call for a business - see LegalService.fetchDocumentInfo
export interface DocumentInfoContentIF {
  includedInResolution: boolean
  includedInResolutionDate?: string
  key: string,
  name: string,
  uploaded: string
}

export interface DocumentInfoIF {
  certifiedMemorandum?: DocumentInfoContentIF
  certifiedRules?: DocumentInfoContentIF
}

export interface DocumentsIF {
  certifiedMemorandum?: string,
  certifiedRules?: string
}

export interface BusinessDocumentsIF {
  documents: DocumentsIF
  documentsInfo: DocumentInfoIF
}
