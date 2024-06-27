/**
 * Interface to define a base address.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/address.json
 * See also Address Interface in BCRS Shared Components repo.
 */
export interface AddressIF {
  id?: number // from API
  addressCity: string
  addressCountry: string
  addressRegion: string
  deliveryInstructions?: string
  postalCode: string
  streetAddress: string
  streetAddressAdditional?: string
  addressType?: string // 'mailing' or 'delivery'
}

/**
 * Interface to define an office address.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/office.json
 */
export interface OfficeIF {
  officeType?: string
  mailingAddress: AddressIF
  // Delivery Address is required for completing party and offices.
  // Delivery Address is optional for completing party and incorporators.
  deliveryAddress?: AddressIF
}

/** Interface to define various office address types. */
export interface AddressesIF {
  registeredOffice?: OfficeIF
  // Records Office is required for BC/BEN/CC/ULC and C/CBEN/CCC/CUL.
  // Records Office may be optional for other app types.
  recordsOffice?: OfficeIF
  // Business Office is required for SP/GP.
  // Business Office may be optional for other app types.
  businessOffice?: OfficeIF
}
