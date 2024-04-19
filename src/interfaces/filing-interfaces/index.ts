export * from './alteration-filing-interface'
export * from './chg-registration-interfaces'
export * from './conversion-interfaces'
export * from './correction-filing-interface'
export * from './filing-data-interface'
export * from './filing-header-interface'
export * from './incorporation-interfaces'
export * from './restoration-filing-interface'
export * from './special-resolution-filing-interface'

// Alias for Shared Components that import IncorporationAddressIf
export type { AddressesIF as IncorporationAddressIf }
  from '@/interfaces/stepper-interfaces/YourCompany/address-interfaces'
