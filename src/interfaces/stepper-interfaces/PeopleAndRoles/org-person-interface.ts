import { AddressIF, RoleIF } from '@/interfaces/'
import { ActionTypes, PartyTypes } from '@/enums/'

export interface ApiPersonIF {
  id?: string // used by UI only
  partyType: PartyTypes
  firstName?: string // required when partyType="person"
  middleName?: string
  lastName?: string // required when partyType="person"
  organizationName?: string // required when partyType="organization"
  email?: string
  identifier?: string // aka Incorporation/Registration number
  taxId?: string
}

export interface OrgPersonIF {
  officer: ApiPersonIF
  roles: RoleIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  actions?: ActionTypes[]
  confirmNameChange?: boolean // for UI use only
  confirmBusiness?: boolean // for firms only // for UI use only
  confirmDocuments?: boolean // for proprietor-orgs only // for UI use only
  isLookupBusiness: boolean // for firms only // for UI use only
}

/**
 * Empty OrgPerson for adding a new one.
 * Must use `cloneDeep()` to assign it.
 */
export const EmptyOrgPerson: OrgPersonIF = {
  officer: {
    id: null,
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: '',
    partyType: null,
    email: null
  },
  roles: [],
  mailingAddress: {
    streetAddress: '',
    streetAddressAdditional: '',
    addressCity: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: '',
    deliveryInstructions: ''
  },
  actions: [],
  isLookupBusiness: null // can't be undefined
}
