<template>
  <div class="d-flex">
    <header class="app-header" id="appHeader">
      <v-container class="justify-space-between">
        <a @click="goToHome()" class="brand">
          <picture>
            <source media="(min-width: 601px)"
              srcset="../assets/img/gov_bc_logo_horiz.png">
            <source media="(max-width: 600px)"
              srcset="../assets/img/gov_bc_logo_vert.png">
            <img class="brand__image"
              src="../assets/img/gov_bc_logo_vert.png"
              alt="Government of British Columbia Logo"
              title="Government of British Columbia">
          </picture>
          <span class="brand__title">BC Registries <span class="brand__title--wrap">and Online Services</span></span>
        </a>
        <div v-if="showActions" class="app-header__actions">

          <!-- Product Selector -->
          <sbc-product-selector v-if="showProductSelector" />

          <!-- What's New -->
          <v-btn
            text
            dark
            large
            width="150"
            aria-label="whatsnew"
            attach="#appHeader"
            @click.stop="notificationPanel=true"
            v-if="!isAuthenticated && notificationCount > 0 && isWhatsNewOpen"
          >
            <v-badge
              dot
              overlap
              offset-y="-5"
              offset-x="10"
              :color="notificationUnreadPriorityCount > 0 ? 'error' : 'blue'"
              v-if="notificationUnreadCount > 0"
            >
            </v-badge>
            What's New
          </v-btn>

          <!-- Login Menu -->
          <v-menu
            fixed
            bottom
            left
            width="330"
            transition="slide-y-transition"
            attach="#appHeader"
            v-if="!isAuthenticated && showLoginMenu"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                large
                text
                dark
                class="mx-1 pr-2 pl-3"
                aria-label="log in"
                id="loginBtn"
                v-on="on">
                <span>Log in</span>
                <v-icon class="ml-1">mdi-menu-down</v-icon>
              </v-btn>
            </template>
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
          </v-menu>

          <!-- Notifications -->
          <v-menu
            fixed
            bottom
            left
            transition="slide-y-transition"
            attach="#appHeader"
            v-if="isAuthenticated"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                text
                dark
                large
                class="mobile-icon-only mx-1 px-2"
                aria-label="notifications"
                v-on="on"
              >
                <v-icon>
                  mdi-bell-outline
                </v-icon>
                <v-badge
                  dot
                  overlap
                  offset-y="-5"
                  offset-x="10"
                  color="error"
                  v-if="pendingApprovalCount > 0"
                >
                </v-badge>
                <span>
                  Notifications
                </span>
                <v-icon class="ml-1">
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <div class="menu-header">
                <v-card-title class="body-1">
                  Notifications
                </v-card-title>
                <v-divider></v-divider>
              </div>
              <v-list
                tile
                dense
              >
                <!-- No Items -->
                <v-list-item v-if="pendingApprovalCount === 0">
                  <v-list-item-title class="text-center">No notifications</v-list-item-title>
                </v-list-item>

                <v-list-item two-line v-if="pendingApprovalCount > 0" @click="goToTeamMembers()">
                  <v-list-item-content>
                    <v-list-item-title>You have {{ pendingApprovalCount }} pending approvals</v-list-item-title>
                    <v-list-item-subtitle>{{ pendingApprovalCount }} <span>{{pendingApprovalCount == '1' ? 'team member' : 'team members'}}</span> require approval to access this account</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <!-- Account -->
          <v-menu
            bottom
            left
            transition="slide-y-transition"
            attach="#appHeader"
            v-if="isAuthenticated"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                large
                text
                class="user-account-btn"
                aria-label="my account"
                v-on="on"
              >
                <v-avatar
                  tile
                  left
                  color="#4d7094"
                  size="32"
                  class="user-avatar">
                  {{ username.slice(0,1) }}
                </v-avatar>
                <div class="user-info">
                  <div class="user-name" data-test="user-name">{{ username }}</div>
                  <div class="account-name" data-test="account-name">{{ accountName }}</div>
                </div>
                <v-icon class="ml-1">
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>

            <v-card>
              <!-- User Profile -->
              <v-list
                tile
                dense
              >
                <v-list-item two-line>
                  <v-list-item-avatar
                    tile
                    left
                    color="#4d7094"
                    size="36"
                    class="user-avatar white--text">
                    {{ username.slice(0,1) }}
                  </v-list-item-avatar>
                  <v-list-item-content class="user-info">
                    <v-list-item-title class="user-name" data-test="menu-user-name">{{ username }}</v-list-item-title>
                    <v-list-item-subtitle class="account-name" data-test="menu-account-name">{{ accountName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <!-- BEGIN: Hide if authentication is IDIR -->
                <v-list-item @click="goToUserProfile()" v-if="isBcscOrBceid">
                  <v-list-item-icon left>
                    <v-icon>mdi-account-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit Profile</v-list-item-title>
                </v-list-item>
                <!-- END -->
                <v-list-item @click="logout()">
                  <v-list-item-icon left>
                    <v-icon>mdi-logout-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Log out</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <!-- Account Settings -->
              <v-list
                tile
                dense
                v-if="currentAccount"
              >
                <v-subheader>ACCOUNT SETTINGS</v-subheader>
                <v-list-item @click="goToAccountInfo(currentAccount)">
                  <v-list-item-icon left>
                    <v-icon>mdi-information-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Account Info</v-list-item-title>
                </v-list-item>
                <v-list-item @click="goToTeamMembers()">
                  <v-list-item-icon left>
                    <v-icon>mdi-account-group-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Team Members</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="showTransactions"
                  @click="goToTransactions()">
                  <v-list-item-icon left>
                    <v-icon>mdi-file-document-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Transactions</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <!-- Switch Account -->
              <div v-if="!isStaff ">
                <v-subheader v-if="switchableAccounts.length > 1">SWITCH ACCOUNT</v-subheader>
                <v-list
                  tile
                  dense
                  v-if="switchableAccounts.length > 1"
                  class="switch-account"
                >

                  <v-list-item
                    color="primary"
                    :class="{'v-list-item--active' : settings.id === currentAccount.id}"
                    v-for="(settings, id) in switchableAccounts"
                    :key="id"
                    @click="switchAccount(settings, inAuth)"
                    :two-line="!!settings.additionalLabel"
                  >

                    <v-list-item-icon left>
                      <v-icon v-show="settings.id === currentAccount.id">mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                    <v-list-item-title>{{ settings.label }}</v-list-item-title>
                    <v-list-item-subtitle
                    class="font-italic"
                    :class="{'primary--text' : settings.id === currentAccount.id}"
                    v-if="settings.additionalLabel">{{ `- ${settings.additionalLabel}` }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-list>

                <v-divider></v-divider>

                <!-- Create a New Account -->
                <v-list
                  tile
                  dense
                  v-if="canCreateAccount">
                  <v-list-item @click="goToCreateBCSCAccount()">
                    <v-list-item-icon left>
                      <v-icon>mdi-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                    >
                      Create account
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-menu>

          <v-btn
            text
            dark
            large
            @click="goToCreateAccount()"
            v-if="!isAuthenticated"
          >
            Create Account
          </v-btn>
        </div>
      </v-container>
    </header>
    <div id="warning-bar">
      <browser-version-alert />
    </div>
    <div id="warning-modal">
      <mobile-device-alert />
    </div>
    <div class="position: relative">
      <notification-panel :showNotifications="notificationPanel" @closeNotifications="closeNotificationPanel()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { initialize, LDClient } from 'launchdarkly-js-client-sdk'
import { ALLOWED_URIS_FOR_PENDING_ORGS, Account, IdpHint, LoginSource, Pages, Role } from '../util/constants'
import ConfigHelper from '../util/config-helper'
import { mapState, mapActions, mapGetters } from 'vuex'
import { UserSettings } from '../models/userSettings'
import Vue from 'vue'
import NavigationMixin from '../mixins/navigation-mixin'
import { getModule } from 'vuex-module-decorators'
import AccountModule from '../store/modules/account'
import AuthModule from '../store/modules/auth'
import { KCUserProfile } from '../models/KCUserProfile'
import keycloakService from '../services/keycloak.services'
import LaunchDarklyService from '../services/launchdarkly.services'
import BrowserVersionAlert from './BrowserVersionAlert.vue'
import MobileDeviceAlert from './MobileDeviceAlert.vue'
import SbcProductSelector from './SbcProductSelector.vue'
import NotificationPanel from './NotificationPanel.vue'
import { AccountStatus, LDFlags } from '../util/enums'
import NotificationModule from '../store/modules/notification'
import { appendAccountId, trimTrailingSlashURL } from '../util/common-util'

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
    if (!this.$store.isModuleRegistered(['notification'])) {
      this.$store.registerModule('notification', NotificationModule)
    }
    this.$options.computed = {
      ...(this.$options.computed || {}),
      ...mapState('account', ['currentAccount', 'pendingApprovalCount', 'currentUser']),
      ...mapState('notification', ['notificationCount', 'notificationUnreadPriorityCount', 'notificationUnreadCount']),
      ...mapGetters('account', ['accountName', 'switchableAccounts', 'username']),
      ...mapGetters('auth', ['isAuthenticated', 'currentLoginSource'])
    }
    this.$options.methods = {
      ...(this.$options.methods || {}),
      ...mapActions('account', ['loadUserInfo', 'syncAccount', 'syncCurrentAccount', 'syncUserProfile']),
      ...mapActions('auth', ['syncWithSessionStorage']),
      ...mapActions('notification', ['markAsRead',
        'fetchNotificationCount',
        'fetchNotificationUnreadPriorityCount',
        'fetchNotificationUnreadCount',
        'syncNotifications'])
    }
  },
  components: {
    SbcProductSelector,
    BrowserVersionAlert,
    MobileDeviceAlert,
    NotificationPanel
  }
})
export default class SbcHeader extends Mixins(NavigationMixin) {
  private ldClient!: LDClient
  private readonly currentAccount!: UserSettings | null
  private readonly pendingApprovalCount!: number
  private readonly username!: string
  private readonly accountName!: string
  private readonly currentLoginSource!: string
  private readonly isAuthenticated!: boolean
  private readonly switchableAccounts!: UserSettings[]
  private readonly loadUserInfo!: () => KCUserProfile
  private readonly syncAccount!: () => Promise<void>
  private readonly syncCurrentAccount!: (userSettings: UserSettings) => Promise<UserSettings>
  private readonly syncUserProfile!: () => Promise<void>
  private readonly syncWithSessionStorage!: () => void
  private readonly currentUser!: any
  private notificationPanel = false
  private readonly notificationUnreadPriorityCount!: number
  private readonly notificationUnreadCount!: number
  private readonly fetchNotificationUnreadPriorityCount!: () => Promise<void>
  private readonly fetchNotificationUnreadCount!: () => Promise<void>
  private readonly markAsRead!: () => Promise<void>
  private readonly notificationCount!: number
  private readonly fetchNotificationCount!: () => Promise<void>
  private readonly syncNotifications!: () => Promise<void>

  @Prop({ default: '' }) redirectOnLoginSuccess!: string;
  @Prop({ default: '' }) redirectOnLoginFail!: string;
  @Prop({ default: '' }) redirectOnLogout!: string;
  @Prop({ default: false }) inAuth!: boolean;
  @Prop({ default: false }) showProductSelector!: boolean;
  @Prop({ default: true }) showActions!: boolean;
  @Prop({ default: true }) showLoginMenu!: boolean;
  @Prop({ default: '' }) dashboardReturnUrl !: string;

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

  get showTransactions (): boolean {
    return [Account.PREMIUM, Account.SBC_STAFF, Account.STAFF].includes(this.currentAccount?.accountType as Account)
  }

  // only for internal staff who belongs to bcreg
  get isStaff (): boolean {
    return this.currentUser && this.currentUser.roles.includes(Role.Staff)
  }

  // only for GOVN type users
  get isGovmUser (): boolean {
    return this.currentUser && this.currentUser.roles.includes(Role.GOVMAccountUser)
  }

  get isBceid (): boolean {
    return this.currentLoginSource === LoginSource.BCEID
  }

  get canCreateAccount (): boolean {
    // bcros  and idir can't create extra accounts themselves
    const disabledLogins:any = [LoginSource.BCROS.valueOf(), LoginSource.IDIR.valueOf()]
    if (this.disableBCEIDMultipleAccount) {
      disabledLogins.push(LoginSource.BCEID.valueOf())
    }
    return disabledLogins.indexOf(this.currentLoginSource) < 0
  }

  get isBcscOrBceid (): boolean {
    return [LoginSource.BCSC.valueOf(), LoginSource.BCEID.valueOf()].indexOf(this.currentLoginSource) >= 0
  }

  private async mounted () {
    getModule(AccountModule, this.$store)
    getModule(AuthModule, this.$store)
    getModule(NotificationModule, this.$store)

    this.syncWithSessionStorage()
    if (this.isAuthenticated) {
      await this.loadUserInfo()
      await this.syncAccount()
      await this.updateProfile()
      // checking for account status
      await this.checkAccountStatus()
    }

    // fetching what's new information, need to wait the notifications load and get the counts
    await this.syncNotifications()
    await this.fetchNotificationCount()
    await this.fetchNotificationUnreadPriorityCount()
    await this.fetchNotificationUnreadCount()
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

  private goToHome () {
    // always bcros home page
    const url = appendAccountId(ConfigHelper.getRegistryHomeURL())
    // redirect to home page
    window.location.assign(url)
  }

  private goToUserProfile () {
    const url = this.inAuth ? Pages.USER_PROFILE : appendAccountId(Pages.USER_PROFILE)
    this.redirectToPath(this.inAuth, url)
  }

  private goToCreateAccount () {
    this.redirectToPath(this.inAuth, Pages.CHOOSE_AUTH_METHOD)
  }

  private goToCreateBCSCAccount () {
    const redirectUrl: string = this.dashboardReturnUrl ? `${Pages.CREATE_ACCOUNT}?redirectToUrl=${encodeURIComponent(this.dashboardReturnUrl)}` : Pages.CREATE_ACCOUNT
    this.redirectToPath(this.inAuth, redirectUrl)
  }

  private async goToAccountInfo (settings: UserSettings) {
    if (!this.currentAccount || !settings) {
      return
    }
    await this.syncCurrentAccount(settings)
    this.redirectToPath(this.inAuth, `${Pages.ACCOUNT}/${this.currentAccount.id}/${Pages.SETTINGS}/account-info`)
  }

  private goToTeamMembers () {
    if (!this.currentAccount) {
      return
    }
    this.redirectToPath(this.inAuth, `${Pages.ACCOUNT}/${this.currentAccount.id}/${Pages.SETTINGS}/team-members`)
  }

  private goToTransactions () {
    if (!this.currentAccount) {
      return
    }
    this.redirectToPath(this.inAuth, `${Pages.ACCOUNT}/${this.currentAccount.id}/${Pages.SETTINGS}/transactions`)
  }

  private checkAccountStatus () {
    // redirect if accoutn status is suspended
    if ([AccountStatus.NSF_SUSPENDED, AccountStatus.SUSPENDED].some(status => status === this.currentAccount?.accountStatus)) {
      this.redirectToPath(this.inAuth, `${Pages.ACCOUNT_FREEZ}`)
    } else if (this.currentAccount?.accountStatus === AccountStatus.PENDING_STAFF_REVIEW) {
      const targetPath = window.location.pathname
      const substringCheck = (element:string) => targetPath.indexOf(element) > -1
      // check if any of the url is the allowed uri
      const isAllowedUrl = ALLOWED_URIS_FOR_PENDING_ORGS.findIndex(substringCheck) > -1
      if (!isAllowedUrl) {
        const accountName = encodeURIComponent(btoa(this.accountName))
        this.redirectToPath(this.inAuth, `${Pages.PENDING_APPROVAL}/${accountName}/true`)
      }
    }
  }

  private async switchAccount (settings: UserSettings, inAuth?: boolean) {
    this.$emit('account-switch-started')
    if (this.$route.params.orgId) {
      // If route includes a URL param for account, we need to refresh with the new account id
      this.$router.push({ name: this.$route.name, params: { orgId: settings.id } })
    }
    await this.syncCurrentAccount(settings)
    this.$emit('account-switch-completed')

    // passing current URL as redirect back URL from account switch page
    // So it will check all account conditions and redirect accordingly
    const currentURL = trimTrailingSlashURL(`${window.location.origin}${window.location.pathname}`)

    // @Prop({ default: false }) skipAccountSwitchRedirect!: boolean;

    // skipAccountSwitchRedirect as prop and check here if need to avoid redirect to dashboard
    // handle all the condtion (like NFS/pending approval page) in own app when we are doing it

    if (!inAuth) {
      window.location.assign(appendAccountId(`${ConfigHelper.getAuthContextPath()}/${Pages.ACCOUNT_SWITCHING}?redirectToUrl=${currentURL}`))
    }
  }

  logout () {
    if (this.redirectOnLogout) {
      const url = encodeURIComponent(this.redirectOnLogout)
      window.location.assign(`${this.getContextPath()}signout/${url}`)
    } else {
      window.location.assign(`${this.getContextPath()}signout`)
    }
  }

  login (idpHint) {
    if (this.redirectOnLoginSuccess) {
      let url = encodeURIComponent(this.redirectOnLoginSuccess)
      url += this.redirectOnLoginFail ? `/${encodeURIComponent(this.redirectOnLoginFail)}` : ''
      window.location.assign(`${this.getContextPath()}signin/${idpHint}/${url}`)
    } else {
      window.location.assign(`${this.getContextPath()}signin/${idpHint}`)
    }
  }

  private getContextPath (): string {
    // [FAS] - Logout not redirecting to Login Screen#11120
    //  adeded default as /, if no base URL precent
    let baseUrl = (this.$router && (this.$router as any)['history'] && (this.$router as any)['history'].base) || '/'
    baseUrl += (baseUrl.length && baseUrl[baseUrl.length - 1] !== '/') ? '/' : ''
    return baseUrl
  }

  private async closeNotificationPanel () {
    this.notificationPanel = false
    if (this.notificationUnreadCount > 0) {
      await this.markAsRead()
    }
  }

  private get isWhatsNewOpen (): boolean {
    return LaunchDarklyService.getFlag(LDFlags.WhatsNew) || false
  }

  private get disableBCEIDMultipleAccount (): boolean {
    return LaunchDarklyService.getFlag(LDFlags.DisableBCEIDMultipleAccount) || false
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/layout.scss";
@import "../assets/scss/theme.scss";

$app-header-font-color: #ffffff;

.app-header {
  height: $app-header-height;
  color: $app-header-font-color;
  border-bottom: 2px solid $BCgovGold5;
  background-color: $BCgovBlue5;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.brand {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  text-decoration: none;
  color: inherit;
}

.brand__image {
  display: block;
  margin-right: 1.25rem;
  max-height: $app-header-height;
}

.brand__title {
  letter-spacing: -0.03rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: inherit;
}

.user-avatar {
  border-radius: 0.15rem;
  font-size: 1.1875rem;
  font-weight: 700;
}
.switch-account{
  height:42vh;
  overflow-y: scroll;

}
@media (max-width: 900px) {
  .brand__image {
    margin-right: 0.75rem;
    margin-left: -0.15rem;
  }

  .brand__title {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .brand__title--wrap {
    display: block;
  }
}

.v-btn.user-account-btn {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
  text-align: left;
  color: $app-header-font-color;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;

  .user-avatar {
    margin-right: 0.75rem;
  }

  .user-name {
    line-height: 1.125rem;
    font-size: 0.875rem;
  }

  .account-name {
    margin-bottom: 0.01rem;
    font-size: 0.7rem;
    opacity: 0.75;
    max-width: 15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.v-btn.notifications-btn {
  min-width: 3.142rem !important;
  color: $app-header-font-color;

  .v-badge {
    margin-right: 0.25rem;
  }
}

.v-list {
  border-radius: 0;

  .v-list-item__title,
  .v-list-item__subtitle {
    line-height: normal !important;
  }
}

.v-list .v-list-item__title.user-name,
.user-name {
  font-size: 0.875rem;
  font-weight: 400;
}

.v-list .v-list-item__subtitle.account-name,
.account-name {
  font-size: 0.75rem;
}

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

.v-subheader {
  color: $gray9 !important;
  font-weight: 700;
}

.menu-header {
  display: none;
}

@media (max-width: 1263px) {
  .v-btn.mobile-icon-only {
    min-width: 3rem !important;
    width: 3rem;

    .v-icon + span,
    span + .v-icon {
      display: none;
    }

    .v-icon {
      margin-right: 0;
    }
  }

  .v-btn.user-account-btn {
    min-width: auto !important;
    font-size: 0.8rem;

    .user-avatar {
      margin-right: 0;
    }

    .user-info,
    .v-icon {
      display: none;
    }
  }

  .v-btn.login-btn {
    .v-icon + span,
    span + .v-icon {
      display: none;
    }
  }

  .v-btn.whatsnew-btn {
    .v-icon + span,
    span + .v-icon {
      display: none;
    }
  }
  .menu-header {
    display: block;
  }
}

@media (min-width: 1360px) {
  .v-menu__content {
    max-width: 22rem;
  }
}
</style>
