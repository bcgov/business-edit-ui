import { CorpTypeCd } from '@/bcrs-shared-components/corp-type-module/'

/** Enum to help map name request type codes */
export enum NameRequestTypes {
  NEW = 'NEW',
  CHANGE_OF_NAME = 'CHG',
  CONVERSION = 'CNV'
  // Expand types here as required. Add description in getNrRequestDesc via NameRequestMixin.
}

/** Enum to sync NR types with corp types. */
export enum NameRequestEntityTypes {
  BC = CorpTypeCd.BC_COMPANY,
  CR = CorpTypeCd.BC_CORPORATION, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  UL = CorpTypeCd.BC_UNLIMITED, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  CC = CorpTypeCd.BC_CCC,
  CP = CorpTypeCd.COOP,
  FR = CorpTypeCd.NR_SOLE_PROP,
  GP = CorpTypeCd.PARTNERSHIP
}
