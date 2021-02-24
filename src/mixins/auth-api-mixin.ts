// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { axios } from '@/utils'

// Interfaces
import { BusinessContactIF } from '@/interfaces'
/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class AuthApiMixin extends Vue {
  @Getter getBusinessId!: string

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
          // Always take the first contact.
          return {
            ...response.data.contacts[0],
            confirmEmail: response.data.contacts[0].email,
            extension: response.data.contacts[0].phoneExtension
          } || []
        } else {
          // eslint-disable-next-line no-console
          console.log('getContactInfo() error - invalid response =', response)
          throw new Error('Invalid API response')
        }
      })
  }

  /**
   * Update a businesses contact information.
   * @param contactInfo The contact information payload.
   */
  updateContactInfo (contactInfo: BusinessContactIF): Promise<any> {
    try {
      const contactPayload = {
        email: contactInfo.email,
        phone: contactInfo.phone,
        phoneExtension: contactInfo.extension
      }
      const authUrl = sessionStorage.getItem('AUTH_API_URL')
      let url = `${authUrl}entities/${this.getBusinessId}/contacts`

      return axios.put(url, contactPayload)
    } catch (error) {
      // TODO: Update error handling modal after design review
      this.$root.$emit('save-error-event', error)
    }
  }
}
