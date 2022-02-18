import { CorpTypeCd, FilingCodes, NameRequestEntityTypes } from '@/enums'

/** Interface to define the resource model example */
export interface ResourceIF {
  entityType: CorpTypeCd
  entityReference: string
  contactLabel?: string
  displayName: string
  nameRequestType: NameRequestEntityTypes
  filingData: {
    entityType: CorpTypeCd,
    filingTypeCode: FilingCodes,
    priority?: boolean
  },
  certifyClause: string
}
