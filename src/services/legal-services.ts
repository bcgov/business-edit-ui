import { axios } from '@/utils/'
import { AddressesIF, AlterationFilingIF, BusinessInformationIF, ChgRegistrationFilingIF, ConversionFilingIF,
  CorrectionFilingIF, NameTranslationIF, OrgPersonIF, ResolutionsIF, ShareStructureIF, SpecialResolutionFilingIF }
  from '@/interfaces/'
import { RoleTypes } from '@/enums'

/**
 * Class that provides integration with the Legal API.
 */
export default class LegalServices {
  /**
   * Fetches a filing by its id.
   * @returns a promise to return the filing of the specified type
   */
  static async fetchFilingById (businessId: string, filingId: number): Promise<any> {
    const url = `businesses/${businessId}/filings/${filingId}`

    return axios.get(url)
      .then(response => {
        if (response && response.data) {
          return response.data.filing
        }
        // eslint-disable-next-line no-console
        console.log('fetchFilingById() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Deletes a filing by its id.
   * @returns a promise to delete the filing or return a failure.
   */
  static async deleteFilingById (businessId: string, filingId: number): Promise<any> {
    const url = `businesses/${businessId}/filings/${filingId}`

    return axios.delete(url)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('deleteFilingById() error - invalid response =', error)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Updates an existing filing.
   * @param businessId the id of the business to update
   * @param filingId the id of the filing to update
   * @param filing the object body of the filing
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  static async updateFiling (
    businessId: string,
    filingId: number,
    // eslint-disable-next-line max-len
    filing: CorrectionFilingIF | AlterationFilingIF | ChgRegistrationFilingIF | ConversionFilingIF | SpecialResolutionFilingIF,
    isDraft: boolean
  ): Promise<any> {
    // put updated filing to filings endpoint
    let url = `businesses/${businessId}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }
    return axios.put(url, { filing }).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (filing && filingId) {
        return filing
      }
      // eslint-disable-next-line no-console
      console.log('updateFiling() error - invalid response =', response)
      throw new Error('Invalid API response')
    })
    // NB: for error handling, see "save-error-event"
  }

  /**
   * Creates a new filing.
   * @param businessId the id of the business to update
   * @param filing the object body of the filing
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  static async createFiling (
    businessId: string,
    filing: AlterationFilingIF | ChgRegistrationFilingIF | ConversionFilingIF | SpecialResolutionFilingIF,
    isDraft: boolean
  ): Promise<any> {
    // put updated filing to filings endpoint
    let url = `businesses/${businessId}/filings`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.post(url, { filing }).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (filing && filingId) {
        return filing
      }
      // eslint-disable-next-line no-console
      console.log('createFiling() error - invalid response =', response)
      throw new Error('Invalid API response')
    })
    // NB: for error handling, see "save-error-event"
  }

  /**
   * Fetches the business info of the current business.
   * @returns a promise to return the data
   */
  static async fetchBusinessInfo (businessId: string): Promise<BusinessInformationIF> {
    const url = `businesses/${businessId}`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.business
        }
        // eslint-disable-next-line no-console
        console.log('fetchBusinessInfo() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches the name translations of the current business.
   * @returns a promise to return the data
   */
  static async fetchNameTranslations (businessId: string): Promise<NameTranslationIF[]> {
    const url = `businesses/${businessId}/aliases`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.aliases
        }
        // eslint-disable-next-line no-console
        console.log('fetchNameTranslations() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches the address of the current entity.
   * @returns a promise to return the data
   */
  static async fetchAddresses (businessId: string): Promise<AddressesIF> {
    const url = `businesses/${businessId}/addresses`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data
        }
        // eslint-disable-next-line no-console
        console.log('fetchAddresses() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches the directors of the current business.
   * @returns a promise to return the data
   */
  static async fetchDirectors (businessId: string): Promise<OrgPersonIF[]> {
    const url = `businesses/${businessId}/directors`

    return axios.get(url)
      .then(response => {
        const directors = response?.data?.directors
        if (directors) {
          // convert director list to org-person list
          return directors.map(director => {
            const orgPerson: OrgPersonIF = {
              deliveryAddress: director.deliveryAddress,
              mailingAddress: director.mailingAddress,
              officer: director.officer,
              roles: [
                {
                  appointmentDate: director.appointmentDate,
                  cessationDate: director.cessationDate,
                  roleType: RoleTypes.DIRECTOR
                }
              ],
              isLookupBusiness: null
            }
            return orgPerson
          })
        }
        // eslint-disable-next-line no-console
        console.log('fetchDirectors() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches the parties of the current business.
   * @returns a promise to return the data
   */
  static async fetchParties (businessId: string): Promise<OrgPersonIF[]> {
    const url = `businesses/${businessId}/parties`

    return axios.get(url)
      .then(response => {
        const parties = response?.data?.parties
        if (parties) {
          return parties
        }
        // eslint-disable-next-line no-console
        console.log('fetchParties() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetch the share structure of the current business.
   * @returns a promise to return the data
   */
  static async fetchShareStructure (businessId: string): Promise<ShareStructureIF> {
    const url = `businesses/${businessId}/share-classes`

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
        }
        // eslint-disable-next-line no-console
        console.log('fetchShareStructure() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetch the resolutions of the current business.
   * @returns a promise to return the data
   */
  static async fetchResolutions (businessId: string): Promise<ResolutionsIF[]> {
    const url = `businesses/${businessId}/resolutions`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data.resolutions
        }
        // eslint-disable-next-line no-console
        console.log('fetchResolutions() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches name request data.
   * @param nrNumber the name request number (eg, NR 1234567) to fetch
   * @returns a promise to return the NR data, or null if not found
   */
  static async fetchNameRequest (nrNumber: string): Promise<any> {
    const url = `nameRequests/${nrNumber}`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data
        }
        // eslint-disable-next-line no-console
        console.log('fetchNameRequest() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }
}
