/* eslint-disable */
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import ConfigHelper from 'sbc-common-components/src/util/config-helper'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import KeycloakServices from '../services/keycloak.services'

@Module({
  name: 'auth',
  namespaced: true
})
export default class AuthModule extends VuexModule {
  token: string = ''
  idToken: string = ''
  refreshToken: string = ''
  kcGuid: string = ''
  loginSource: string = ''

  get isAuthenticated (): boolean {
    return !!this.token
  }

  get keycloakGuid (): string {
    return this.kcGuid || KeycloakServices.getUserInfo().keycloakGuid
  }

  get currentLoginSource (): string {
    return this.loginSource || KeycloakServices.getUserInfo().loginSource
  }

  @Mutation
  public setKCToken (token: string): void {
    this.token = token
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token)
  }

  @Mutation
  public setIDToken (idToken: string): void {
    this.idToken = idToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken)
  }

  @Mutation
  public setRefreshToken (refreshToken: string): void {
    this.refreshToken = refreshToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken)
  }

  @Mutation
  public setKCGuid (kcGuid: string): void {
    this.kcGuid = kcGuid
  }

  @Mutation
  public setLoginSource (loginSource: string): void {
    this.loginSource = loginSource
  }

  @Action({ rawError: true })
  public clearSession (): void {
    this.context.commit('setKCToken', '')
    this.context.commit('setIDToken', '')
    this.context.commit('setRefreshToken', '')
    this.context.commit('setKCGuid', '')
    this.context.commit('setLoginSource', '')
  }

  @Action({ rawError: true })
  public syncWithSessionStorage (): void {
    this.context.commit('setKCToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
    this.context.commit('setIDToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
    this.context.commit('setRefreshToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
  }
}
