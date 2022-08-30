import { CorrectionTypes, NameRequestEntityTypes, NameRequestTypes } from '@/enums/'
import { HelpSectionIF, FilingDataIF, SpecialResolutionSampleFormIF } from '@/interfaces/'

/** Interface to define the resource model example */
export interface ResourceIF {
  entityReference: string
  contactLabel?: string
  displayName: string
  nameRequestType: NameRequestEntityTypes
  addressLabel: string
  filingData: FilingDataIF
  changeData?: {
    nameChangeOptions?: Array<CorrectionTypes>
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
}
