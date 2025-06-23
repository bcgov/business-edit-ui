/** Interface for account information object in store. */
export interface AccountInformationIF {
  accountType: string
  id: number
  label: string
  type: string
  // NB: there are other fields but we don't need them
  [x: string | number | symbol]: unknown
}
