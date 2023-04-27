import { Store } from 'vuex'
import KeycloakServices from './keycloak.services'

// TODO: Remove the whole file once the other teams changed from token-service to keycloak-service

class TokenServices {
  async init (store?: Store<any>, isScheduleRefresh: boolean = true) {
    return KeycloakServices.initializeToken(store, isScheduleRefresh)
  }

  scheduleRefreshTimer (refreshEarlyTime = 0) {
    KeycloakServices.scheduleRefreshTimer(refreshEarlyTime)
  }
}

export default TokenServices
