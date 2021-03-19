// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'
import { axios } from '@/utils'

// Interfaces
import { AlterationFilingIF, BusinessInformationIF, CorrectionFilingIF, IncorporationAddressIf,
  NameTranslationIF, GetOrgPersonIF, ShareStructureIF } from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

// Mixins
import { FilingTemplateMixin } from '@/mixins'

/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class LegalApiMixin extends Mixins(FilingTemplateMixin) {
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
   * @returns a promise to delete the filing or return a failure.
   */
  async deleteFilingById (id: number): Promise<any> {
    const url = `businesses/${this.getBusinessId}/filings/${id}`

    return axios.delete(url)
      .catch(error => {
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
  async getAuthorizations (businessIdentifier: string): Promise<any> {
    if (!businessIdentifier) throw new Error('Invalid parameter \'businessIdentifier\'')

    const url = `entities/${businessIdentifier}/authorizations`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
  }

  /**
   * Fetches the current user data.
   * @returns a promise to return the data
   */
  async fetchCurrentUser (): Promise<any> {
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get('users/@me', config)
  }

  /**
   * Fetches the business info of the current business.
   * @returns a promise to return the data
   */
  async fetchBusinessInfo (): Promise<BusinessInformationIF> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.business
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchBusinessInfo() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetches the name translations of the current business.
   * @returns a promise to return the data
   */
  async fetchNameTranslations (): Promise<NameTranslationIF[]> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/aliases`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.aliases
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchNameTranslations() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetches the incorporation address of the current business.
   * @returns a promise to return the data
   */
  async fetchIncorporationAddress (): Promise<IncorporationAddressIf> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/addresses`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchIncorporationAddress() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetches the org persons of the current business.
   * @returns a promise to return the data
   */
  async fetchOrgPersons (): Promise<GetOrgPersonIF[]> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/directors`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.directors
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchOrgPersons() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetch the share structure of the current business.
   * @returns a promise to return the data
   */
  async fetchShareStructure (): Promise<ShareStructureIF> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/share-classes`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          const shareStructure = response.data
          // Apply a type to share classes and series
          shareStructure.shareClasses.forEach(shareClass => {
            shareClass.type = 'Class'
            shareClass.series.forEach(shareSeries => { shareSeries.type = 'Series' })
          })

          return shareStructure
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchShareStructure() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Fetches the contact point of the current business.
   * @returns a promise to return the data
   */
  async fetchContactPoint (): Promise<ContactPointIF> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `entities/${this.getBusinessId}`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
      .then(response => {
        // take the first contact
        const contact = response?.data?.contacts[0]
        if (contact) {
          return {
            email: contact.email,
            confirmEmail: contact.email,
            phone: contact.phone,
            extension: contact.phoneExtension
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('fetchContactPoint() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }
}
