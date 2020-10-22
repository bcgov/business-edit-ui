import { AddressIF, RoleIF } from '@/interfaces'
import { ActionTypes, IncorporatorTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: string
    partyType: IncorporatorTypes
    firstName: string
    middleName?: string
    lastName: string
    orgName: string
    email?: string
  }
  roles: RoleIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  action?: ActionTypes
}
