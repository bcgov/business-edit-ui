/* eslint-disable */
// External
import Keycloak, { KeycloakInitOptions, KeycloakInstance, KeycloakLoginOptions } from 'keycloak-js'
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
// BC Registry
import { KCUserProfile } from 'sbc-common-components/src/models/KCUserProfile'
import ConfigHelper from 'sbc-common-components/src/util/config-helper'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { decodeKCToken } from 'sbc-common-components/src/util/common-util'
// Local
import AuthModule from '../modules/auth'

class KeyCloakService {
  private kc: KeycloakInstance | undefined
  private parsedToken: any
  private static instance: KeyCloakService
  private store: Store<any> | null = null
  private counter = 0
  private REFRESH_ATTEMPT_INTERVAL = 10 // in seconds
  private timerId: any = 0

  public static getInstance (): KeyCloakService {
    return (this.instance) ? this.instance : new KeyCloakService()
  }

  public get isInitialized (): boolean {
    return !!this.kc
  }

  // Setting keycloak config url as a static configuration to access from other parts of the app if needed
  async setKeycloakConfigUrl (keyCloakConfigurl: string) {
    ConfigHelper.setKeycloakConfigUrl(keyCloakConfigurl)
  }

  getKCInstance () : KeycloakInstance | undefined {
    return this.kc
  }

  async initializeKeyCloak (idpHint: string, store: Store<any>) {
    this.store = store
    this.clearSession()
    const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || undefined
    const keycloakConfig = ConfigHelper.getKeycloakConfigUrl()
    this.kc = Keycloak(keycloakConfig)
    const kcLogin = this.kc.login
    this.kc.login = (options?: KeycloakLoginOptions) => {
      if (options) {
        options.idpHint = idpHint
      }
      return kcLogin(options)
    }
    let kcOptions :KeycloakInitOptions = {
      onLoad: 'login-required',
      checkLoginIframe: false,
      timeSkew: 0,
      token,
      refreshToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || undefined,
      idToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || undefined,
      pkceMethod: 'S256'
    }
    return this.kc.init(kcOptions)
  }

  async initSession () {
    if (!this.store) {
      return
    }

    const authModule = getModule(AuthModule, this.store)
    authModule.setKCToken(this.kc?.token || '')
    authModule.setIDToken(this.kc?.idToken || '')
    authModule.setRefreshToken(this.kc?.refreshToken || '')

    const userInfo = this.getUserInfo()
    authModule.setKCGuid(userInfo?.keycloakGuid || '')
    authModule.setLoginSource(userInfo?.loginSource || '')

    await this.syncSessionAndScheduleTokenRefresh()
  }

  getUserInfo () : KCUserProfile {
    if (!this.parsedToken || !Object.keys(this.parsedToken).length) {
      this.parsedToken = decodeKCToken()
    }
    return {
      lastName: this.parsedToken?.lastname,
      firstName: this.parsedToken?.firstname,
      email: this.parsedToken?.email,
      // eslint-disable-next-line camelcase
      roles: this.parsedToken?.realm_access?.roles,
      keycloakGuid: this.parsedToken?.sub,
      userName: this.parsedToken?.username,
      fullName: this.parsedToken?.name,
      loginSource: this.parsedToken?.loginSource
    }
  }

  async logout (redirectUrl?: string) {
    let token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || undefined
    if (token) {
      this.kc = Keycloak(ConfigHelper.getKeycloakConfigUrl())
      let kcOptions :KeycloakInitOptions = {
        onLoad: 'login-required',
        checkLoginIframe: false,
        timeSkew: 0,
        token,
        refreshToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || undefined,
        idToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || undefined,
        pkceMethod: 'S256'
      }
      // Here we clear session storage, and add a flag in to prevent the app from
      // putting tokens back in from returning async calls  (see #2341)
      ConfigHelper.clearSession()
      ConfigHelper.addToSession(SessionStorageKeys.PreventStorageSync, true)
      return new Promise<void>((resolve, reject) => {
        this.kc && this.kc.init(kcOptions)
          .then(authenticated => {
            if (!authenticated) {
              resolve()
            }
            redirectUrl = redirectUrl || `${window.location.origin}${process.env.VUE_APP_PATH}`
            this.kc && this.kc.logout({ redirectUri: redirectUrl })
              .then(() => {
                resolve()
              })
              .catch(error => {
                reject(error)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }

  async refreshToken (isForceRefresh?: boolean) {
    // Set the token expiry time as the minValidity to force refresh token
    if (!isForceRefresh && (!this.kc?.tokenParsed?.exp || !this.kc.timeSkew)) {
      return
    }
    // if isForceRefresh is true, send -1 in updateToken to force update the token
    let tokenExpiresIn = (isForceRefresh) ? -1 : this.kc.tokenParsed.exp - Math.ceil(new Date().getTime() / 1000) + this.kc.timeSkew + 100
    if (this.kc) {
      this.kc.updateToken(tokenExpiresIn)
        .then(refreshed => {
          if (refreshed) {
            this.initSession()
          }
        })
        .catch(() => {
          this.clearSession()
          return new Error('Could not refresh Token')
        })
    } else {
      return new Error('Could not refresh Token:No Kc Instance')
    }
  }

  verifyRoles (allowedRoles:[], disabledRoles:[]) {
    let isAuthorized = false
    if (allowedRoles || disabledRoles) {
      let userInfo = this.getUserInfo()
      isAuthorized = allowedRoles ? allowedRoles.some(role => userInfo.roles.includes(role)) : !disabledRoles.some(role => userInfo.roles.includes(role))
    } else {
      isAuthorized = true
    }
    return isAuthorized
  }

  async initializeToken (store?: Store<any>, isScheduleRefresh: boolean = true, forceLogin: boolean = false) {
    this.store = store
    const kcOptions: KeycloakInitOptions = {
      onLoad: forceLogin ? 'login-required' : 'check-sso',
      checkLoginIframe: false,
      timeSkew: 0,
      token: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || undefined,
      refreshToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || undefined,
      idToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || undefined,
      pkceMethod: 'S256'
    }

    return new Promise((resolve, reject) => {
      this.kc = Keycloak(ConfigHelper.getKeycloakConfigUrl())
      ConfigHelper.addToSession(SessionStorageKeys.SessionSynced, false)
      this.kc.init(kcOptions)
        .then(authenticated => {
          console.info('[TokenServices] is User Authenticated?: Syncing ' + authenticated)
          resolve(this.syncSessionAndScheduleTokenRefresh(isScheduleRefresh))
        })
        .catch(error => {
          reject(new Error('Could not Initialize KC' + error))
        })
    })
  }

  async syncSessionAndScheduleTokenRefresh (isScheduleRefresh: boolean = true) {
    if (this.kc?.authenticated) {
      this.syncSessionStorage()
      if (isScheduleRefresh) {
        this.scheduleRefreshTimer()
      }
      return this.kc.token
    } else {
      this.clearSession()
      return new Error('NOT_AUTHENTICATED')
    }
  }

  scheduleRefreshTimer (refreshEarlyTime = 0) {
    let refreshEarlyTimeinMilliseconds = Math.max(this.REFRESH_ATTEMPT_INTERVAL, refreshEarlyTime) * 1000
    this.scheduleRefreshToken(refreshEarlyTimeinMilliseconds)
  }

  private scheduleRefreshToken (refreshEarlyTimeinMilliseconds: number) {
    let refreshTokenExpiresIn = -1
    // check if refresh token is still valid . Or else clear all timers and throw errors
    if (this.kc && this.kc.timeSkew !== undefined && this.kc.refreshTokenParsed) {
      refreshTokenExpiresIn = this.kc.refreshTokenParsed['exp']! - Math.ceil(new Date().getTime() / 1000) + this.kc.timeSkew
    }
    if (refreshTokenExpiresIn < 0) {
      throw new Error('Refresh Token Expired. No more token refreshes')
    }
    let expiresIn = -1
    if (this.kc && this.kc.tokenParsed && this.kc.tokenParsed['exp'] && this.kc.timeSkew !== undefined) {
      expiresIn = this.kc.tokenParsed['exp'] - Math.ceil(new Date().getTime() / 1000) + this.kc.timeSkew
    }
    if (expiresIn < 0) {
      throw new Error('Refresh Token Expired. No more token refreshes')
    }
    let refreshInMilliSeconds = (expiresIn * 1000) - refreshEarlyTimeinMilliseconds // in milliseconds
    console.info('[TokenServices] Token Refresh Scheduled in %s Seconds', (refreshInMilliSeconds / 1000))
    this.timerId = setTimeout(() => {
      console.log('[TokenServices] Refreshing Token Attempt: %s ', ++this.counter)
      this.kc!.updateToken(-1)
        .then(refreshed => {
          if (refreshed) {
            console.log('Token successfully refreshed')
            this.syncSessionStorage()
            this.scheduleRefreshToken(refreshEarlyTimeinMilliseconds)
          }
        })
        .catch(() => {
          clearTimeout(this.timerId)
        })
    }, refreshInMilliSeconds)
  }

  private syncSessionStorage () {
    if (this.kc) {
      if (this.kc.token) {
        ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, this.kc.token)
      }
      if (this.kc.refreshToken) {
        ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, this.kc.refreshToken)
      }
      if (this.kc.idToken) {
        ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, this.kc.idToken)
      }
      ConfigHelper.addToSession(SessionStorageKeys.SessionSynced, true)
    } else {
      ConfigHelper.addToSession(SessionStorageKeys.SessionSynced, false)
    }
  }

  private async clearSession () {
    if (this.store) {
      const authModule = getModule(AuthModule, this.store)
      authModule.clearSession()
    }
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakToken)
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakIdToken)
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakRefreshToken)
  }
}

export default KeyCloakService.getInstance()
