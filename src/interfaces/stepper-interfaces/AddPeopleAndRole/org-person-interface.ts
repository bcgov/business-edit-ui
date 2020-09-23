import { AddressIF, RolesIF } from '@/interfaces'
import { ActionTypes, IncorporatorTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: number
    partyType: IncorporatorTypes
    firstName: string
    middleName?: string
    lastName: string
    orgName: string
    email?: string
  }
  roles: RolesIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  action?: ActionTypes
}
