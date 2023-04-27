export interface UserSettings {
  id: string
  label: string
  type: string
  urlpath: string
  urlorigin: string
  accountType: string // will be only present for accounts
  accountStatus: string
  additionalLabel?:string
}
