export interface SigningPersonIF {
  givenName: string
  additionalName?: string
  familyName: string
}

export const EmptySigningPerson: SigningPersonIF = {
  givenName: '',
  familyName: '',
  additionalName: null
}
