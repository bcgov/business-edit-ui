import { AxiosInstance as axios } from '@/utils/'
import { AuthInformationIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { StatusCodes } from 'http-status-codes'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * Class that provides integration with the Auth API.
 */
export default class AuthServices {
  /** The Auth API URL, from session storage. */
  static get authApiUrl (): string {
    return sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
  }

  /**
   * Fetches user info of the current user.
   * @returns a promise to return the user info object
   */
  static async fetchUserInfo (): Promise<any> {
    const url = `${this.authApiUrl}users/@me`

    return axios.get(url).then(response => {
      if (response?.data) return response.data
      throw new Error('Invalid response data')
    })
  }

  /**
   * Fetches org info of specified organization.
   * @param orgId the org id (aka account id)
   * @returns a promise to return the org info object
   */
  static async fetchOrgInfo (orgId: number): Promise<any> {
    if (!orgId) throw new Error('Invalid org id')

    const url = `${this.authApiUrl}orgs/${orgId}`

    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid response data')
      })
  }

  /**
   * Fetches the auth info of the current business.
   * @returns a promise to return the data
   */
  static async fetchAuthInfo (businessId: string): Promise<AuthInformationIF> {
    if (!businessId) throw new Error('Invalid business id')

    const url = `${this.authApiUrl}entities/${businessId}`

    return axios.get(url).then(response => {
      if (response?.data) {
        return {
          contact: {
            // NB: some businesses don't have contacts
            email: response.data.contacts[0]?.email,
            phone: response.data.contacts[0]?.phone,
            extension: response.data.contacts[0]?.phoneExtension
          },
          folioNumber: response.data.folioNumber
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('fetchAuthInfo() error - invalid response =', response)
        throw new Error('Invalid API response')
      }
    })
  }

  /**
   * Updates (or creates) the businesses contact information.
   * @param contactInfo the contact information object
   */
  static async updateContactInfo (contactInfo: ContactPointIF, businessId: string): Promise<any> {
    if (!businessId) throw new Error('Invalid business id')

    const url = `${this.authApiUrl}entities/${businessId}/contacts`
    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      phoneExtension: contactInfo.extension
    }

    // if put fails because there is no existing contacts record
    // then try posting a new contacts record
    return axios.put(url, data)
      .catch(reason => {
        if (reason?.response?.status === StatusCodes.NOT_FOUND) {
          return axios.post(url, data)
        }
        throw reason
      })
  }

  /**
   * Updates the folio number.
   * @param folioNumber the folio number
   */
  static async updateFolioNumber (folioNumber: string, businessId: string): Promise<any> {
    if (!businessId) throw new Error('Invalid business id')

    const url = `${this.authApiUrl}entities/${businessId}`
    const data = {
      businessIdentifier: businessId,
      folioNumber: folioNumber || ''
    }

    return axios.patch(url, data)
  }
}
