import { NameRequestIF, OfficeIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

export interface ChangeOfRegistrationIF {
  business: {
    natureOfBusiness?: string
    naics?: {
      naicsCode: string
      naicsDescription: string
    }
    identifier: string
  }
  offices?: {
    businessOffice: OfficeIF
  }
  contactPoint: ContactPointIF
  nameRequest?: NameRequestIF
  parties?: Array<OrgPersonIF>
  courtOrder?: string
}
