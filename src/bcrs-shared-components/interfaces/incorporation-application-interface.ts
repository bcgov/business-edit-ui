import { IncorporationAddressIf, ShareClassIF, NameTranslationIF } from './'

/** Incorporation Application filing loaded from / saved to the Legal API. */
export interface IncorporationApplicationIF {
  nameRequest: {
    legalType: string
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations: NameTranslationIF[]
  offices: IncorporationAddressIf | object
  contactPoint: {
    email: string
    phone: string
    extension: string
  }
  parties: any[]
  shareStructure: {
    shareClasses: ShareClassIF[]
  }
  incorporationAgreement: {
    agreementType: string
  }
}
