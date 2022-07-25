import { BusinessInformationIF, CourtOrderIF, NameRequestIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
//
export interface SpecialResolutionIF {
  provisionsRemoved?: boolean,
  business?: BusinessInformationIF,
  nameRequest?: NameRequestIF,
  contactPoint?: ContactPointIF,
  courtOrder?: CourtOrderIF
}
