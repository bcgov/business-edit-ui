import { AddressIF, RoleIF } from '@/interfaces'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: string
    partyType: PartyTypes
    firstName: string
    middleName?: string
    lastName: string
    organizationName?: string
    email?: string
  }
  role?: RoleTypes
  roles: RoleIF[] | any
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  action?: ActionTypes
  appointmentDate?: string
  cessationDate?: string
  confirmNameChange?: boolean
}
