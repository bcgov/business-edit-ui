import { AddressIF, RoleIF } from '@/interfaces/'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums/'

export interface ApiPersonIF {
  id?: string // used by UI only
  partyType: PartyTypes
  firstName?: string // required when partyType="person"
  middleName?: string
  lastName?: string // required when partyType="person"
  organizationName?: string // required when partyType="organization"
  email?: string
  identifier?: string // may not be used
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
