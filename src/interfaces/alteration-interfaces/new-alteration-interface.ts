import { CourtOrderIF, ValidFlagsIF, ValidComponentsIF } from './'

export interface NewAlterationIF {
  appValidate: boolean,
  componentValidate: boolean,
  provisionsRemoved: boolean,
  courtOrder: CourtOrderIF,
  validFlags: ValidFlagsIF,
  validComponents: ValidComponentsIF
}
