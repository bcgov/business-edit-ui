import { AuthServices, LegalServices } from '@/services'
import { promise } from 'sinon'

export default {
  /** Fetches the business info by business id */
  fetchBusinessInfo (context, businessId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchBusinessInfo(businessId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setBusinessInfo', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches the addresses by business id */
  fetchAddresses (context, businessId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchAddresses(businessId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setAddresses', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches the filings by business id and filing id
   * CAUTION: This action doesn't commit a mutation. Use the
   * response to commit to the appropriate filing type. */
  fetchFilingByIds (context, { businessId, filingId }): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchFilingById(businessId, filingId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches the name translations by business id */
  fetchNameTranslations (context, businessId): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchNameTranslations(businessId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setNameTranslations', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches the name translations by business id */
  fetchDirectors (context, businessId): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchDirectors(businessId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setDirectors', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches the authentication data by business id */
  fetchAuthentication (context, businessId): Promise<any> {
    return new Promise((resolve, reject) => {
      AuthServices.fetchAuthInfo(businessId)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setAuthData', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  },

  /** Fetches state filing; Caution: must call fetchBusinessInfo first  */
  fetchStateFiling (context): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchFiling(context.getters.getStateFilingUrl)
        .then((response) => {
          if (!response) {
            reject(new Error('Invalid configuration.json'))
          } else {
            context.commit('setStateFilingData', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(new Error('Error: ' + error))
        })
    })
  }
}
