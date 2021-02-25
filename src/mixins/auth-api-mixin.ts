// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { axios } from '@/utils'

// Shared Interfaces
import {
  ContactPointIF
} from '@bcrs-shared-components/interfaces'

/**
 * Mixin that provides integration with the Auth API.
 */
@Component({})
export default class AuthApiMixin extends Vue {
  @Getter getBusinessId!: string

  /**
   * Update a businesses contact information.
   * @param contactInfo The contact information payload.
   */
  updateContactInfo (contactInfo: ContactPointIF): Promise<any> {
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
