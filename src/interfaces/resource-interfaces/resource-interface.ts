import { CorrectionTypes, FilingCodes, NameRequestEntityTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { HelpSectionIF } from '@/interfaces/'

/** Interface to define the resource model example */
export interface ResourceIF {
  entityType: CorpTypeCd
  entityReference: string
  contactLabel?: string
  displayName: string
  nameRequestType: NameRequestEntityTypes
  addressLabel: string
  filingData: {
    entityType: CorpTypeCd
    filingTypeCode: FilingCodes
    priority?: boolean
  }
  changeData?: {
    nameChangeOptions?: Array<CorrectionTypes>
    typeChangeInfo?: string
    orgPersonInfo?: {
      orgPersonLabel: string
      orgTypesLabel?: string
      subtitle: string
      helpSection?: HelpSectionIF
    }
  }
  certifyClause: string
}
