import { axios } from '@/utils/'
import { AuthInformationIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { NOT_FOUND } from 'http-status-codes'

/**
 * Class that provides integration with the Auth API.
 */
export default class AuthServices {
  /**
   * Fetches authorizations.
   * @param businessIdentifier the business identifier (eg, BC1219948)
   * @returns a promise to return the authorizations object
   */
  static async fetchAuthorizations (businessIdentifier: string): Promise<any> {
    if (!businessIdentifier) throw new Error('Invalid parameter \'businessIdentifier\'')

    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}entities/${businessIdentifier}/authorizations`

    return axios.get(url)
  }

  /**
   * Fetches user info of the current user.
   * @returns a promise to return the user info object
   */
  static async fetchUserInfo (): Promise<any> {
    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}users/@me`

    return axios.get(url)
  }

  /**
   * Fetches org info of specified organization.
   * @param orgId the org id (aka account id)
   * @returns a promise to return the org info object
   */
  static async fetchOrgInfo (orgId: number): Promise<any> {
    if (!orgId) throw new Error('Invalid org id')

    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}orgs/${orgId}`

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

    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}entities/${businessId}`

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

    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}entities/${businessId}/contacts`
    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      phoneExtension: contactInfo.extension
    }

    // if put fails because there is no existing contacts record
    // then try posting a new contacts record
    return axios.put(url, data)
      .catch(reason => {
        if (reason?.response?.status === NOT_FOUND) {
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

    const authApiUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authApiUrl}entities/${businessId}`
    const data = { businessIdentifier: businessId, folioNumber: folioNumber ?? '' }

    return axios.patch(url, data)
  }
}
