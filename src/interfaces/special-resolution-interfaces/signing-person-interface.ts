export interface SigningPersonIF {
  givenName: string
  additionalName?: string
  familyName: string
  email?: string
}

export const EmptySigningPersonIF: SigningPersonIF = {
  givenName: '',
  familyName: '',
  additionalName: null
}
