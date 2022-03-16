import { required, maxLength } from 'vuelidate/lib/validators'

// The Person Address schema containing Vuelidate rules.
// NB: This should match the subject JSON schema.
export const PersonAddressSchema = {
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
    required
  },
  addressRegion: {
    maxLength: maxLength(2)
  },
  postalCode: {
    required,
    maxLength: maxLength(15)
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

export const RegistrationMailingAddressSchema = PersonAddressSchema
