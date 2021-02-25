import { IncorporationAddressIf } from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

export interface DefineCompanyIF {
  valid: boolean
  changed: boolean
  businessContact: ContactPointIF
  officeAddresses: IncorporationAddressIf | {}
  folioNumber?: string
}
