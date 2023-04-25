/** Interface to define a base address. */
export interface AddressIF {
  addressCity: string
  addressCountry: string
  addressRegion: string
  addressType?: string
  deliveryInstructions?: string
  postalCode: string
  streetAddress: string
  streetAddressAdditional?: string
}

/** Empty address for initializing address objects. */
export const EmptyAddress: AddressIF = {
  addressCity: '',
  addressCountry: '',
  addressRegion: '',
  addressType: null,
  deliveryInstructions: '',
  postalCode: '',
  streetAddress: '',
  streetAddressAdditional: ''
}

/** Interface to define the joint base addresses. */
export interface BaseAddressObjIF {
  mailingAddress: AddressIF
  // Delivery Address is required for directors and offices.
  // Delivery Address is optional for completing party and incorporators.
  deliveryAddress?: AddressIF
}

/** Interface to define the incorporation addresses. */
export interface IncorporationAddressIf {
  registeredOffice: BaseAddressObjIF
  // Records Address is required for BCOMPs.
  // Records Address may be optional for other app types.
  recordsOffice?: BaseAddressObjIF
}

export interface BaseAddressType extends Vue {
  $refs: any
}
