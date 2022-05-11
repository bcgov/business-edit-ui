import { BaseAddressObjIF, NameRequestIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

export interface ChangeOfRegistrationIF {
  business: {
    natureOfBusiness?: string,
    naics?: {
      naicsCode: string,
      naicsDescription: string
    },
    identifier: string
  },
  offices?: {
    businessOffice: BaseAddressObjIF
  },
  contactPoint: ContactPointIF,
  nameRequest?: NameRequestIF,
  parties?: Array<OrgPersonIF>
  courtOrder?: string
}
