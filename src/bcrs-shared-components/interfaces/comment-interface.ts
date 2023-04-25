/** A comment from the API. */
export interface CommentIF {
  businessId?: string
  comment: string
  filingId?: string
  submitterDisplayName: string
  timestamp: string
}

export const EmptyComment: CommentIF = {
  comment: '',
  submitterDisplayName: '',
  timestamp: ''
}
