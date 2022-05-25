import { AddressesIF, OrgPersonIF, ShareClassIF, NameTranslationIF } from '@/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/incorporation_application.json
//
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
    extension?: number
  }
  parties: OrgPersonIF[]
  shareStructure: {
    shareClasses: ShareClassIF[]
  }
  incorporationAgreement: {
    agreementType: string
  }
}
