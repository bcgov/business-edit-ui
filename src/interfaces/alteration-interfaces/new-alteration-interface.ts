import { CourtOrderIF } from './court-order-interface'
import { ValidFlagsIF } from './valid-flags-interface'

export interface NewAlterationIF {
  provisionsRemoved: boolean,
  planOfArrangement: boolean,
  courtOrder: CourtOrderIF
  validFlags: ValidFlagsIF
}
