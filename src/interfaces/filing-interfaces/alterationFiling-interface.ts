import { AlterationIF } from '@/interfaces'

export interface AlterationFilingIF {
  header: {
    name: string
    certifiedBy: string
    date: string
    effectiveDate?: string // Optional and should be set only for future effective filings
    filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
    folioNumber?: string // Optional to the user and only displayed for certain account types
    isFutureEffective: boolean
    status?: string
  }
  business: {
    legalType: string,
    identifier: string,
  },
  alteration: AlterationIF
}
