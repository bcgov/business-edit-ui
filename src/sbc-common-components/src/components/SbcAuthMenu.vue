<template>
  <!-- Login Menu -->
  <v-card>
    <div>
      <v-card-title class="body-2 font-weight-bold">Select login method</v-card-title>
      <v-divider></v-divider>
    </div>
    <v-list
      tile
      dense
    >
      <v-list-item
        v-for="loginOption in loginOptions"
        :key="loginOption.idpHint"
        @click="login(loginOption.idpHint)"
        class="pr-6"
      >
        <v-list-item-icon left>
          <v-icon>{{loginOption.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{loginOption.option}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { LDClient } from 'launchdarkly-js-client-sdk'
import { Role, IdpHint, LoginSource, Pages } from '../util/constants'
import { mapState, mapActions, mapGetters } from 'vuex'
import { UserSettings } from '../models/userSettings'
import NavigationMixin from '../mixins/navigation-mixin'
import { getModule } from 'vuex-module-decorators'
import AccountModule from '../store/modules/account'
import AuthModule from '../store/modules/auth'
import { KCUserProfile } from '../models/KCUserProfile'
import KeyCloakService from '../services/keycloak.services'

declare module 'vuex' {
  interface Store<S> {
    isModuleRegistered(_: string[]): boolean
  }
}

@Component({
  beforeCreate () {
    this.$store.isModuleRegistered = function (aPath: string[]) {
      let m = (this as any)._modules.root
      return aPath.every((p) => {
        m = m._children[p]
        return m
      })
    }
    if (!this.$store.isModuleRegistered(['account'])) {
      this.$store.registerModule('account', AccountModule)
    }
    if (!this.$store.isModuleRegistered(['auth'])) {
      this.$store.registerModule('auth', AuthModule)
    }
    this.$options.computed = {
      ...(this.$options.computed || {}),
      ...mapGetters('auth', ['isAuthenticated', 'currentLoginSource'])
    }
    this.$options.methods = {
      ...(this.$options.methods || {}),
      ...mapActions('account', [
        'loadUserInfo',
        'syncAccount',
        'syncCurrentAccount',
        'syncUserProfile',
        'getCurrentUserProfile',
        'updateUserProfile']),
      ...mapActions('auth', ['syncWithSessionStorage'])
    }
  }
})
export default class SbcAuthMenu extends Mixins(NavigationMixin) {
  private ldClient!: LDClient
  private readonly currentAccount!: UserSettings | null
  private readonly accountName!: string
  private readonly currentLoginSource!: string
  private readonly isAuthenticated!: boolean
  private readonly loadUserInfo!: () => KCUserProfile
  private readonly syncAccount!: () => Promise<void>
  // private readonly syncCurrentAccount!: (userSettings: UserSettings) => Promise<UserSettings>
  private readonly syncUserProfile!: () => Promise<void>
  private readonly syncWithSessionStorage!: () => void
  private readonly getCurrentUserProfile!: (isAuth: boolean) => Promise<any>
  private readonly updateUserProfile!: () => Promise<void>

  @Prop({ default: '' }) redirectOnLoginSuccess!: string;
  @Prop({ default: '' }) redirectOnLoginFail!: string;
  @Prop({ default: false }) inAuth!: boolean;
  @Prop({ default: false }) fromLogin!: boolean;

  private readonly loginOptions = [
    {
      idpHint: IdpHint.BCSC,
      option: 'BC Services Card',
      icon: 'mdi-account-card-details-outline'
    },
    {
      idpHint: IdpHint.BCEID,
      option: 'BCeID',
      icon: 'mdi-two-factor-authentication'
    },
    {
      idpHint: IdpHint.IDIR,
      option: 'IDIR',
      icon: 'mdi-account-group-outline'
    }
  ]

  get isIDIR (): boolean {
    return this.currentLoginSource === LoginSource.IDIR
  }

  get isBceid (): boolean {
    return this.currentLoginSource === LoginSource.BCEID
  }

  get isBcscOrBceid (): boolean {
    return [LoginSource.BCSC.valueOf(), LoginSource.BCEID.valueOf()].indexOf(this.currentLoginSource) >= 0
  }

  private async mounted () {
    getModule(AccountModule, this.$store)
    getModule(AuthModule, this.$store)
    this.syncWithSessionStorage()
    if (this.isAuthenticated) {
      await this.loadUserInfo()
      await this.syncAccount()
      await this.updateProfile()
      // checking for account status
      await this.checkAccountStatus()
    }
  }

  @Watch('isAuthenticated')
  private async onisAuthenticated (isAuthenitcated: string, oldVal: string) {
    if (isAuthenitcated) {
      await this.updateProfile()
    }
  }

  private async updateProfile () {
    if (this.isBceid) {
      await this.syncUserProfile()
    }
  }

  private goToCreateBCSCAccount () {
    this.redirectToPath(this.inAuth, Pages.CREATE_ACCOUNT)
  }

  private checkAccountStatus () {
    // redirect if account status is suspended
    if (this.currentAccount?.accountStatus && this.currentAccount?.accountStatus === 'NSF_SUSPENDED') {
      this.redirectToPath(this.inAuth, `${Pages.ACCOUNT_FREEZ}`)
    } else if (this.currentAccount?.accountStatus === 'PENDING_AFFIDAVIT_REVIEW') {
      this.redirectToPath(this.inAuth, `${Pages.PENDING_APPROVAL}/${this.accountName}/true`)
    }
  }

  login (idpHint: string) {
    if (!this.fromLogin) {
      if (this.redirectOnLoginSuccess) {
        let url = encodeURIComponent(this.redirectOnLoginSuccess)
        url += this.redirectOnLoginFail ? `/${encodeURIComponent(this.redirectOnLoginFail)}` : ''
        window.location.assign(`${this.getContextPath()}signin/${idpHint}/${url}`)
      } else {
        window.location.assign(`${this.getContextPath()}signin/${idpHint}`)
      }
    } else {
      // Initialize keycloak session
      const kcInit = KeyCloakService.initializeKeyCloak(idpHint, this.$store)
      kcInit.then(async (authenticated: boolean) => {
        if (authenticated) {
          // eslint-disable-next-line no-console
          console.info('[SignIn.vue]Logged in User. Init Session and Starting refreshTimer')
          // Set values to session storage
          await KeyCloakService.initSession()
          // tell KeycloakServices to load the user info
          const userInfo = await this.loadUserInfo()

          // update user profile
          await this.updateUserProfile()

          // sync the account if there is one
          await this.syncAccount()

          // if not from the sbc-auth, do the checks and redirect to sbc-auth
          if (!this.inAuth) {
            console.log('[SignIn.vue]Not from sbc-auth. Checking account status')
            // redirect to create account page if the user has no 'account holder' role
            const isRedirectToCreateAccount = (userInfo.roles.includes(Role.PublicUser) && !userInfo.roles.includes(Role.AccountHolder))

            const currentUser = await this.getCurrentUserProfile(this.inAuth)

            if ((userInfo?.loginSource !== LoginSource.IDIR) && !(currentUser?.userTerms?.isTermsOfUseAccepted)) {
              console.log('[SignIn.vue]Redirecting. TOS not accepted')
              this.redirectToPath(this.inAuth, Pages.USER_PROFILE_TERMS)
            } else if (isRedirectToCreateAccount) {
              console.log('[SignIn.vue]Redirecting. No Valid Role')
              switch (userInfo.loginSource) {
                case LoginSource.BCSC:
                  this.redirectToPath(this.inAuth, Pages.CREATE_ACCOUNT)
                  break
                case LoginSource.BCEID:
                  this.redirectToPath(this.inAuth, Pages.CHOOSE_AUTH_METHOD)
                  break
              }
            }
          }
        }
      }).catch(() => {
        if (this.redirectOnLoginFail) {
          window.location.assign(decodeURIComponent(this.redirectOnLoginFail))
        }
      })
    }
  }

  private getContextPath (): string {
    let baseUrl = (this.$router && (this.$router as any)['history'] && (this.$router as any)['history'].base) || ''
    baseUrl += (baseUrl.length && baseUrl[baseUrl.length - 1] !== '/') ? '/' : ''
    return baseUrl
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

.v-list--dense .v-subheader,
.v-list-item {
  padding-right: 1.25rem;
  padding-left: 1.25rem;
}

.v-list--dense .v-subheader,
.v-list--dense .v-list-item__title,
.v-list--dense .v-list-item__subtitle {
  font-size: 0.875rem !important;
}
</style>
