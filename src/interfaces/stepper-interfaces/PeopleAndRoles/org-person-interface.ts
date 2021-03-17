import { AddressIF, RoleIF } from '@/interfaces'
import { ActionTypes, IncorporatorTypes, RoleTypes } from '@/enums'

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

export interface GetOrgPersonIF {
  appointmentDate: string,
  cessationDate: string,
  deliveryAddress: AddressIF,
  mailingAddress: AddressIF,
  officer: {
    id?: string
    firstName: string,
    lastName: string
  },
  role: RoleTypes
}
