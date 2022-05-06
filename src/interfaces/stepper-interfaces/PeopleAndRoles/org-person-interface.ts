import { AddressIF, RoleIF } from '@/interfaces/'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums/'

export interface ApiPersonIF {
  id?: string // used by UI only
  partyType: PartyTypes
  firstName: string
  middleName?: string
  lastName: string
  organizationName: string
  email?: string
  identifier?: string // used by API only ???
  taxId?: string // aka Business Number
}

export interface OrgPersonIF {
  officer: ApiPersonIF
  role?: RoleTypes
  roles: RoleIF[] | any
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  actions?: ActionTypes[]
  appointmentDate?: string
  cessationDate?: string
  confirmNameChange?: boolean
}
