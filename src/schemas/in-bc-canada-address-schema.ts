import { required, maxLength } from 'vuelidate/lib/validators'
import { AddressSchemaIF } from '@/interfaces/'

// The schema containing Vuelidate rules.
// NB: This should match the subject JSON schema.
export const InBcCanadaAddressSchema: AddressSchemaIF = {
  streetAddress: {
    required,
    maxLength: maxLength(50)
  },
  streetAddressAdditional: {
    maxLength: maxLength(50)
  },
  addressCity: {
    required,
    maxLength: maxLength(40)
  },
  addressCountry: {
    required,
    // FUTURE: create new validation function isCountry('CA')
    isCanada: (val: string) => Boolean(val === 'CA')
  },
  addressRegion: {
    maxLength: maxLength(2),
    // FUTURE: create new validation function isRegion('BC')
    isBC: (val: string) => Boolean(val === 'BC')
  },
  postalCode: {
    required,
    maxLength: maxLength(15)
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}
