import { FilingHeaderIF, AlterationIF, BusinessInformationIF } from '@/interfaces/'
import { CompletingPartyIF, NameRequestIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces'

/** Override what's in BCRS Shared Components, needs to be refactored in the future. */
export interface ChangeOfNameIF {
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
  legalName: string
}

/** Special resolution + UI only state. Not in API schema, only saved in drafts. */
export interface SpecialResolutionDraftIF extends SpecialResolutionIF {
  isDone?: boolean // whether the user clicked "Done" on the special resolution section
}

/** Interface for data object UI sends to API. */
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfName?: ChangeOfNameIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
  completingParty?: CompletingPartyIF // not in API schema; only saved in drafts
}
