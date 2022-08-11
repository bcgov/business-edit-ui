import { AssociationTypes } from '@/enums'
import { BusinessInformationIF, CourtOrderIF, NameRequestIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

/** Interface for data object UI sends to API. */
export interface SpecialResolutionIF {
  provisionsRemoved?: boolean,
  business?: BusinessInformationIF,
  nameRequest?: NameRequestIF,
  contactPoint?: ContactPointIF,
  courtOrder?: CourtOrderIF
  cooperativeAssociationType: AssociationTypes
}
