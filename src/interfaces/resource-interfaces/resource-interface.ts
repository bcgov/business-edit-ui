import { NameChangeOptions, NameRequestTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { HelpSectionIF, FilingDataIF, SpecialResolutionSampleFormIF } from '@/interfaces/'

/** Interface to define the resource model example */
export interface ResourceIF {
  entityReference: string
  contactLabel?: string
  displayName: string
  entityType?: CorpTypeCd // corrections only
  addressLabel: string
  title?: string // BEN corrections only
  description?: string // BEN corrections only
  filingData: FilingDataIF | Array<FilingDataIF>
  changeData?: {
    nameChangeOptions?: Array<NameChangeOptions>
    typeChangeInfo?: string
    orgPersonInfo?: {
      orgPersonLabel: string
      orgTypesLabel?: string
      subtitle: string
      helpSection?: HelpSectionIF
    }
    specialResolution?: {
      helpSection?: HelpSectionIF,
      sampleFormSection?: SpecialResolutionSampleFormIF
    }
    nameRequestTypes?: Array<NameRequestTypes>
    addressChangeInfo?: string
  }
  certifyClause: string
  showEmailUnderName?: boolean
  certifyText?: string
  userEmailOptional?: boolean
  userEmailLabel?: string
}
