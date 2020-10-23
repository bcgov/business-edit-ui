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

export interface getOrgPersonsIF {
  appointmentDate: string,
  cessationDate: string,
  deliveryAddress: AddressIF,
  mailingAddress: AddressIF,
  officer: {
    firstName: string,
    lastName: string
  },
  role: string
}
