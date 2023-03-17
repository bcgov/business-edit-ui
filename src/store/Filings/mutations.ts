
export default {
  setBusinessInfo (state: any, businessInfo) {
    state.businessInfo = businessInfo
  },

  setAddresses (state: any, addresses) {
    state.addresses = addresses
  },

  setRestorationFiling (state: any, filing) {
    state.restorationFiling = filing
  },

  setNameTranslations (state: any, aliases) {
    state.nameTranslations = aliases
  },

  setDirectors (state: any, directors) {
    state.orgPersons = directors
  },

  setAuthData (state: any, data) {
    state.authInfo = data
  },

  setStateFilingData (state: any, data) {
    state.stateFilingData = data
  }
}
