import { IncorporationApplicationIF } from '@/interfaces'

/** Incorporation Application filing loaded from / saved to the Legal API. */
export interface CorrectionFilingIF {
  header: {
    name: string
    certifiedBy: string
    date: string
    effectiveDate?: string
    routingSlipNumber?: string
    folioNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    legalType: string
    legalName: string
    identifier: string
  }
  correction: {
    correctedFilingId: string
    correctedFilingType: string
    correctedFilingDate: string
    comment: string
  }
  incorporationApplication?: IncorporationApplicationIF
}
