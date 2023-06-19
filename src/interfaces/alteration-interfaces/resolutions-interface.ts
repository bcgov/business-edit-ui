import { PersonIF } from '@bcrs-shared-components/interfaces'

/**
 * Directly from LegalServices.fetchResolutions
 */
export interface ResolutionsIF {
  date: string
  id: number
  type: string
  signatory?: PersonIF
  signingDate?: string
}
