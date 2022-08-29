import { CorrectionTypes, NameRequestEntityTypes, NameRequestTypes } from '@/enums/'
import { HelpSectionIF, FilingDataIF, SampleFormIF } from '@/interfaces/'

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
    specialSpecialResolution?: {
      helpSection?: HelpSectionIF,
      sampleFormSection?: SampleFormIF
    }
    nameRequestTypes?: Array<NameRequestTypes>
    addressChangeInfo?: string
  }
  certifyClause: string
}
