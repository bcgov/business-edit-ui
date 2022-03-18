/** Interface to define a base address. */
export interface AddressIF {
  id?: number
  addressCity: string
  addressCountry: string
  addressRegion: string
  deliveryInstructions?: string
  postalCode: string
  streetAddress: string
  streetAddressAdditional?: string
  addressType?: string
}

/** Interface to define the joint base addresses. */
export interface BaseAddressObjIF {
  mailingAddress: AddressIF
  // Delivery Address is required for completing party and offices.
  // Delivery Address is optional for completing party and incorporators.
  deliveryAddress?: AddressIF
}

/** Interface to define the addresses. */
export interface AddressesIF {
  registeredOffice?: BaseAddressObjIF
  // Records Address is required for BCOMPs.
  // Records Address may be optional for other app types.
  recordsOffice?: BaseAddressObjIF
  // Business Office is for required for Firms.
  businessOffice?: BaseAddressObjIF
}

export interface BaseAddressType extends Vue {
  $refs: any
}
