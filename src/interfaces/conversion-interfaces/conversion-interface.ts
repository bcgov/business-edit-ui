import { AddressesIF, NameRequestIF, OrgPersonIF, ShareStructureIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
export interface ConversionIF {
  business: {
    natureOfBusiness?: string
    naics?: {
      naicsCode: string
      naicsDescription: string
    }
    identifier: string
  }
  startDate?: string
  nameRequest?: NameRequestIF
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  shareStructure?: ShareStructureIF
  contactPoint: ContactPointIF
  incorporationAgreement?: {
    agreementType: string
  }
  courtOrder?: string
}
