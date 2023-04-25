import { AddressIF } from './addresses-interface'

export interface CompletingPartyIF {
  firstName: string
  middleName?: string
  lastName: string
  mailingAddress: AddressIF
  email?: string
  phone?: string
}
