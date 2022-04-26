import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { axios } from '@/utils/'
import { AddressesIF, AlterationFilingIF, BusinessInformationIF, CorrectionFilingIF, NameTranslationIF,
  OrgPersonIF, ShareStructureIF, ResolutionsIF, ChangeFirmIF } from '@/interfaces/'
import { OrgPersonTypes } from '@/enums/'

/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class LegalApiMixin extends Vue {
  // Global getters
  @Getter getFilingId!: number
  @Getter getBusinessId!: string

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
  async updateFiling (filing: CorrectionFilingIF | AlterationFilingIF | ChangeFirmIF, isDraft: boolean): Promise<any> {
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
   * Creates a filing.
   * @param filing the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  async createFiling (filing: AlterationFilingIF | ChangeFirmIF, isDraft: boolean): Promise<any> {
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
  async fetchNameTranslations (): Promise<NameTranslationIF[]> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/aliases`

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
  async fetchAddresses (): Promise<AddressesIF> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/addresses`

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
   * Fetches the org persons of the current business.
   * @returns a promise to return the data
   */
  async fetchOrgPersons (orgPersonType: OrgPersonTypes): Promise<OrgPersonIF[]> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/${orgPersonType}`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data[orgPersonType]
        }
        // eslint-disable-next-line no-console
        console.log('fetchOrgPersons() error - invalid response =', response)
        throw new Error('Invalid API response')
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
  async fetchResolutions (): Promise<ResolutionsIF[]> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `businesses/${this.getBusinessId}/resolutions`

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
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the NR data, or null if not found
   */
  async fetchNameRequest (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

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
