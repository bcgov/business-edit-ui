import { CourtOrderIF } from './court-order-interface'
import { ValidFlagsIF } from './valid-flags-interface'
import { ValidComponentsIF } from './valid-components-interface'

export interface NewAlterationIF {
  appValidate: boolean,
  provisionsRemoved: boolean,
  courtOrder: CourtOrderIF,
  validFlags: ValidFlagsIF,
  validComponents: ValidComponentsIF
}
