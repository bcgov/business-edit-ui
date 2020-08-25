import { Component, Vue } from 'vue-property-decorator'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({})
export default class TokenMixin extends Vue {
  /** Gets Keycloak JWT and parses it. */
  private getJWT (): any {
    const token = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    if (token) {
      return this.parseToken(token)
    }
    throw new Error('Error getting Keycloak token')
  }

  /** Decodes and parses Keycloak token. */
  private parseToken (token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(base64)
    } catch (err) {
      throw new Error('Error parsing token - ' + err)
    }
  }

  /** Gets Keycloak roles from JWT. */
  getKeycloakRoles (): Array<string> {
    const jwt = this.getJWT()
    const keycloakRoles = jwt.roles
    if (keycloakRoles && keycloakRoles.length > 0) {
      return keycloakRoles
    }
    throw new Error('Error getting Keycloak roles')
  }
}
