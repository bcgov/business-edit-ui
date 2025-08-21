import { AxiosInstance as axios, GetFeatureFlag } from '@/utils/'
import { AddressesIF, AlterationFilingIF, BusinessInformationIF, ChgRegistrationFilingIF, ConversionFilingIF,
  CorrectionFilingIF, DocumentIF, NameTranslationIF, OrgPersonIF, PresignedUrlIF, ResolutionsIF, RestorationFilingIF,
  SpecialResolutionFilingIF } from '@/interfaces/'
import { AuthorizedActions, RoleTypes } from '@/enums'
import { NameRequestIF, ShareStructureIF } from '@bcrs-shared-components/interfaces/'
import { BusinessDocumentsIF } from '@/interfaces/business-document-interface'
import { AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'

/**
 * Class that provides integration with the Legal (aka Business) API.
 */
export default class LegalServices {
  /** The Legal API URL or Business API Gateway URL, depending on the FF. */
  static get legalBusinessUrl (): string {
    return GetFeatureFlag('use-business-api-gw-url')
      ? sessionStorage.getItem('BUSINESS_API_GW_URL')
      : sessionStorage.getItem('LEGAL_API_URL')
  }

  /**
   * Fetches a filing by its URL.
   * @param url the full URL of the filing
   * @returns a promise to return the filing
   */
  static async fetchFiling (url: string): Promise<any> {
    return axios.get(url)
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) {
          // eslint-disable-next-line no-console
          console.log('fetchFiling() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
        return filing
      })
  }

  /**
   * Fetches a filing by its id.
   * @param businessId the id of the business
   * @param filingId the id of the filing
   * @returns a promise to return the filing
   */
  static async fetchFilingById (businessId: string, filingId: number): Promise<any> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/filings/${filingId}`

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
   * @param businessId the id of the business
   * @param filingId the id of the filing
   * @returns a promise to delete the filing
   */
  static async deleteFilingById (businessId: string, filingId: number): Promise<any> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/filings/${filingId}`

    return axios.delete(url)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('deleteFilingById() error - invalid response =', error)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Updates an existing filing.
   * @param businessId the id of the business
   * @param filingId the id of the filing
   * @param filing the object body of the filing
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  static async updateFiling (
    businessId: string,
    filingId: number,
    // eslint-disable-next-line max-len
    filing: CorrectionFilingIF | AlterationFilingIF | ChgRegistrationFilingIF | ConversionFilingIF | RestorationFilingIF | SpecialResolutionFilingIF,
    isDraft: boolean
  ): Promise<any> {
    // put updated filing to filings endpoint
    let url = `${this.legalBusinessUrl}businesses/${businessId}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, { filing })
      .then(response => {
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
   * @param businessId the id of the business
   * @param filing the object body of the filing
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the new filing
   */
  static async createFiling (
    businessId: string,
    filing: AlterationFilingIF | ChgRegistrationFilingIF | ConversionFilingIF | SpecialResolutionFilingIF,
    isDraft: boolean
  ): Promise<any> {
    // put updated filing to filings endpoint
    let url = `${this.legalBusinessUrl}businesses/${businessId}/filings`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.post(url, { filing })
      .then(response => {
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
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchBusinessInfo (businessId: string): Promise<BusinessInformationIF> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}`

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
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchNameTranslations (businessId: string): Promise<NameTranslationIF[]> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/aliases`

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
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchAddresses (businessId: string): Promise<AddressesIF> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/addresses`

    return axios.get(url)
      .then(response => {
        return response.data
      }).catch(error => {
        // eslint-disable-next-line no-console
        if (error.response.status == StatusCodes.NOT_FOUND) return { businessOffice: null }
        console.log('fetchAddresses() error - invalid response =', error)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches the directors of the current business.
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchDirectors (businessId: string): Promise<OrgPersonIF[]> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/directors`

    return axios.get(url)
      .then(response => {
        const directors = response?.data?.directors
        if (directors) {
          // convert director list to org-person list
          return directors.map(director => {
            // WORK-AROUND WARNING !!!
            // convert directors from "middleInitial" to "middleName"
            const middleInitial = director.officer['middleInitial']
            if (middleInitial !== undefined) {
              director.officer.middleName = middleInitial
              delete director.officer['middleInitial']
            }

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
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchParties (businessId: string): Promise<OrgPersonIF[]> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/parties`

    return axios.get(url)
      .then(response => {
        const parties = response?.data?.parties
        if (parties) {
          // WORK-AROUND WARNING !!!
          // convert parties from "middleInitial" to "middleName"
          return parties.map(party => {
            const middleInitial = party.officer['middleInitial']
            if (middleInitial !== undefined) {
              party.officer.middleName = middleInitial
              delete party.officer['middleInitial']
            }
            return party
          })
        }
        // eslint-disable-next-line no-console
        console.log('fetchParties() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetch the share structure of the current business.
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchShareStructure (businessId: string): Promise<ShareStructureIF> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/share-classes`

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
   * @param businessId the id of the business
   * @param isSpecialResolution whether to fetch resolution type SPECIAL
   * @returns a promise to return the data
   */
  static async fetchResolutions (businessId: string, isSpecialResolution = false): Promise<ResolutionsIF[]> {
    let url = `${this.legalBusinessUrl}businesses/${businessId}/resolutions`

    if (isSpecialResolution) url += '?type=SPECIAL'

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
   * @param phone the name request phone (eg, 12321232)
   * @param email the name request email (eg, nr@example.com)
   * @returns a promise to return the NR data, or null if not found
   */
  static async fetchNameRequest (nrNumber: string, phone = '', email = ''): Promise<NameRequestIF> {
    const url = `${this.legalBusinessUrl}nameRequests/${nrNumber}/validate?phone=${phone}&email=${email}`

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

  /** Fetches the document info for a business. EG. Rules / Memorandum keys
   * @param businessId the id of the business
   * @returns a promise to return the data
   */
  static async fetchBusinessDocuments (businessId: string): Promise<BusinessDocumentsIF> {
    const url = `${this.legalBusinessUrl}businesses/${businessId}/documents`

    return axios.get(url)
      .then(response => {
        if (response?.data) {
          return response.data
        }
        // eslint-disable-next-line no-console
        console.log('fetchBusinessDocuments() error - invalid response =', response)
        throw new Error('Invalid API response')
      })
  }

  /**
   * Fetches a document and prompts browser to open/save it.
   * @param document the document info object
   * @returns the axios response
   */
  static async fetchDocument (document: DocumentIF): Promise<AxiosResponse> {
    // safety checks
    if (!document?.link || !document?.filename) {
      throw new Error('Invalid parameters')
    }

    const config = {
      headers: { 'Accept': 'application/pdf' },
      responseType: 'blob' as 'json'
    }

    return axios.get(document.link, config)
      .then(response => {
        if (!response?.data) {
          // eslint-disable-next-line no-console
          console.log('fetchDocument() error - invalid response =', response)
          throw new Error('Invalid API response')
        }

        /* solution from https://github.com/axios/axios/issues/1392 */

        // it is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const blob = new Blob([response.data], { type: 'application/pdf' })

        // use Navigator.msSaveOrOpenBlob if available (possibly IE)
        // warning: this is now deprecated
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/msSaveOrOpenBlob
        if (window.navigator && window.navigator['msSaveOrOpenBlob']) {
          window.navigator['msSaveOrOpenBlob'](blob, document.filename)
        } else {
          // for other browsers, create a link pointing to the ObjectURL containing the blob
          const url = window.URL.createObjectURL(blob)
          const a = window.document.createElement('a')
          window.document.body.appendChild(a)
          a.setAttribute('style', 'display: none')
          a.href = url
          a.download = document.filename
          a.click()
          window.URL.revokeObjectURL(url)
          a.remove()
        }

        return response
      })
  }

  /**
   * Gets a pre-signed URL for the specified filename.
   * @param filename the file name
   * @returns the presigned url object
   */
  static async getPresignedUrl (fileName: string): Promise<PresignedUrlIF> {
    const url = `${this.legalBusinessUrl}documents/${fileName}/signatures`

    return axios.get(url)
      .then(response => response?.data)
  }

  /**
   * Uploads the specified file to the specified URL.
   * @param url the URL to upload to
   * @param file the file to upload
   * @param key the file key
   * @param userId the file user id
   * @returns the axios response
   */
  static async uploadToUrl (url: string, file: File, key: string, userId: string): Promise<AxiosResponse> {
    const headers = {
      'Content-Type': file.type,
      'x-amz-meta-userid': `${userId}`,
      'x-amz-meta-key': `${key}`,
      'Content-Disposition': `attachment; filename=${file.name}`
    }

    return axios.put(url, file, { headers })
  }

  /**
   * Fetches the current account's authorized actions (permissions).
   * @returns a promise to return the list of authorized actions
   */
  static async fetchAuthorizedActions (): Promise<AuthorizedActions[]> {
    const url = `${this.legalBusinessUrl}permissions`

    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) throw new Error('Invalid API response')
        return data.authorizedPermissions
      })
  }
}
