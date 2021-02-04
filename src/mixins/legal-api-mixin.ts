// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'
import { axios } from '@/utils'

// Interfaces
import { ActionBindingIF, AlterationFilingIF, CorrectionFilingIF, IncorporationFilingIF } from '@/interfaces'

// Mixins
import { FilingTemplateMixin } from '@/mixins'

/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class LegalApiMixin extends Mixins(FilingTemplateMixin) {
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Global getters
  @Getter getFilingId!: number
  @Getter getBusinessId!: string

  /**
   * Fetches a filing by its type.
   * @returns a promise to return the filing of the specified type
   */
  async fetchFilingByType (filingType: string): Promise<any> {
    const url = `businesses/${this.getBusinessId}/filings`

    return axios.get(url)
      .then(response => {
        const filings = response?.data?.filings
        const returnFiling = filings?.find((filings: any) => filings.filing.header.name === filingType)

        if (!filings || !returnFiling) {
          throw new Error('Invalid API response')
        }
        return returnFiling
      })
      .catch((error) => {
        if (error?.response?.status === NOT_FOUND) {
          throw error
        }
      })
  }

  /**
   * Fetches a filing by its id.
   * @returns a promise to return the filing of the specified type
   */
  async fetchFilingById (id: number): Promise<any> {
    const url = `businesses/${this.getBusinessId}/filings/${id}`

    return axios.get(url)
      .then(response => {
        if (response && response.data) {
          return response.data.filing
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchFilingById() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Deletes a filing by its id.
   * @returns a promise to return the filing of the specified type
   */
  async deleteFilingById (id: number): Promise<any> {
    const url = `businesses/${this.getBusinessId}/filings/${id}`

    return axios.delete(url)
      .then().catch(error => {
        // eslint-disable-next-line no-console
        console.log('deleteFilingById() error - invalid response =', error)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Updates an existing filing.
   * @param filing the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  async updateFiling (filing: CorrectionFilingIF | AlterationFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('updateFiling(), invalid filing')
    const filingId = this.getFilingId
    if (!filingId) throw new Error('updateFiling(), invalid filing id')

    // put updated filing to filings endpoint
    let url = `businesses/${this.getBusinessId}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, { filing }).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }
      return filing
    })
    // NB: for error handling, see "save-error-event"
  }

  /**
   * Creates an alteration filing.
   * @param filing the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  async createAlteration (filing: AlterationFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('updateFiling(), invalid filing')

    // put updated filing to filings endpoint
    let url = `businesses/${this.getBusinessId}/filings`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.post(url, { filing }).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }
      return filing
    })
    // NB: for error handling, see "save-error-event"
  }

  /**
   * Fetches authorizations.
   * @param businessIdentifier the business identifier (eg, BC1219948)
   * @returns a promise to return the authorizations object
   */
  getAuthorizations (businessIdentifier: string): Promise<any> {
    if (!businessIdentifier) throw new Error('Invalid parameter \'businessIdentifier\'')

    const url = `entities/${businessIdentifier}/authorizations`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
  }

  /**
   * Fetches current user data.
   * @returns a promise to return the user data
   */
  async fetchCurrentUser (): Promise<any> {
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get('users/@me', config)
  }

  /**
   * Fetch business data for current business.
   * @param datatype The type of data to request.
   * @returns a promise to return the business base info or of the specified data type.
   */
  async getBusinessData (datatype: string = null): Promise<any> {
    if (!this.getBusinessId) throw new Error('Invalid parameter \'businessIdentifier\'')

    let url = `businesses/${this.getBusinessId}`
    if (datatype) {
      url += `/${datatype}`
    }

    return axios.get(url)
      .then(response => {
        if (response && response.data) {
          return response.data
        } else {
          // eslint-disable-next-line no-console
          console.log(`getBusinessData(${datatype}) error - invalid response =`, response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetches contact information for the specified business.
   * @returns a promise to return the contact data
   */
  async getContactInfo (): Promise<any> {
    if (!this.getBusinessId) throw new Error('Invalid parameter \'businessIdentifier\'')

    const url = `entities/${this.getBusinessId}`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
      .then(response => {
        if (response && response.data && response.data.contacts) {
          return response.data.contacts[0] || [] // Always take the first contact.
        } else {
          // eslint-disable-next-line no-console
          console.log('getContactInfo() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }
}
