// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { axios } from '@/utils'

// Interfaces
import { AuthInformationIF } from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/**
 * Mixin that provides integration with the Auth API.
 */
@Component({})
export default class AuthApiMixin extends Vue {
  @Getter getBusinessId!: string

  /**
   * Fetches authorizations.
   * @param businessIdentifier the business identifier (eg, BC1219948)
   * @returns a promise to return the authorizations object
   */
  async fetchAuthorizations (businessIdentifier: string): Promise<any> {
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
   * Fetches the auth info of the current business.
   * @returns a promise to return the data
   */
  async fetchAuthInfo (): Promise<AuthInformationIF> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const url = `entities/${this.getBusinessId}`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
      .then(response => {
        if (response?.data) {
          return {
            contacts: response.data.contacts,
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
   * Updates the businesses contact information.
   * @param contactInfo the contact information object
   */
  updateContactInfo (contactInfo: ContactPointIF): Promise<any> {
    if (!this.getBusinessId) throw new Error('Invalid business id')

    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      phoneExtension: contactInfo.extension
    }
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authUrl}entities/${this.getBusinessId}/contacts`

    return axios.put(url, data)
  }

  /**
   * Updates the folio number.
   * @param folioNumber the folio number
   */
  updateFolioNumber (folioNumber: string): Promise<any> {
    const businessIdentifier = this.getBusinessId
    if (!businessIdentifier) throw new Error('Invalid business id')

    const data = { businessIdentifier, folioNumber }
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authUrl}entities/${businessIdentifier}`

    return axios.patch(url, data)
  }
}
