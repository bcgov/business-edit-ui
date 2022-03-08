import { AddressesIF, OrgPersonIF, ShareClassIF,
  NameTranslationIF } from '@/interfaces'

/** Incorporation Application filing loaded from / saved to the Legal API. */
export interface IncorporationApplicationIF {
  nameRequest: {
    legalType: string
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations: NameTranslationIF[]
  offices: AddressesIF | {}
  contactPoint: {
    email: string
    phone: string
    extension: string
  }
  parties: OrgPersonIF[]
  shareStructure: {
    shareClasses: ShareClassIF[]
  }
  incorporationAgreement: {
    agreementType: string
  }
}
