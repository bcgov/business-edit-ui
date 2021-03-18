import { CourtOrderIF } from './court-order-interface'
import { ValidFlagsIF } from './valid-flags-interface'

export interface NewAlterationIF {
  appValidate: boolean,
  provisionsRemoved: boolean,
  planOfArrangement: boolean,
  courtOrder: CourtOrderIF,
  validFlags: ValidFlagsIF
}
