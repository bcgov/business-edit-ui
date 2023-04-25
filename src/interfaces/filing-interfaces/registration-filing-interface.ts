import { AddressesIF, NameRequestIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF, NaicsIF } from '@/bcrs-shared-components/interfaces/'
import { BusinessTypes } from '@/enums'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
export interface RegistrationIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  businessType?: BusinessTypes // SP only
  contactPoint: ContactPointIF
  courtOrder?: string
  nameRequest: NameRequestIF
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}
