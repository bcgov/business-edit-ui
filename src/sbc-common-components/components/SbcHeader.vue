<template>
  <div>
    <header
      id="appHeader"
      class="app-header"
    >
      <v-container class="container">
        <v-row
          justify="end"
          no-gutters
          style="align-items: center"
        >
          <v-col>
            <a
              class="brand"
              @click="goToHome()"
            >
              <picture>
                <source
                  media="(min-width: 601px)"
                  srcset="~sbc-common-components/src/assets/img/gov_bc_logo_horiz.png"
                >
                <source
                  media="(max-width: 600px)"
                  srcset="~sbc-common-components/src/assets/img/gov_bc_logo_vert.png"
                >
                <img
                  class="brand__image"
                  src="~sbc-common-components/src/assets/img/gov_bc_logo_vert.png"
                  alt="Government of British Columbia Logo"
                  title="Government of British Columbia"
                >
              </picture>
              <span class="brand__title">
                BC Registries <span class="brand__title--wrap">and Online Services</span>
              </span>
            </a>
          </v-col>
          <v-col
            align-self="end"
            cols="auto"
          >
            <v-row
              v-if="showActions"
              class="app-header__actions"
              no-gutters
              style="align-items: center"
            >
              <v-col cols="auto">
                <!-- Product Selector -->
                <sbc-product-selector v-if="showProductSelector" />
              </v-col>
              <v-col cols="auto">
                <!-- What's New -->
                <v-btn
                  v-if="!isAuthenticated && notificationCount > 0 && isWhatsNewOpen"
                  variant="text"
                  dark
                  size="large"
                  width="150"
                  aria-label="whatsnew"
                  attach="#appHeader"
                  @click.stop="notificationPanel=true"
                >
                  <v-badge
                    v-if="notificationUnreadCount > 0"
                    dot
                    overlap
                    offset-y="-5"
                    offset-x="10"
                    :color="notificationUnreadPriorityCount > 0 ? 'error' : 'blue'"
                  />
                  What's New
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <!-- Login Menu -->
                <v-menu
                  v-if="!isAuthenticated && showLoginMenu"
                  fixed
                  location="bottom left"
                  width="330"
                  transition="slide-y-transition"
                  attach="#appHeader"
                >
                  <template #activator="{ props }">
                    <v-btn
                      id="loginBtn"
                      size="large"
                      variant="text"
                      dark
                      class="mx-1 pr-2 pl-3"
                      aria-label="log in"
                      v-bind="props"
                    >
                      <span>Log in</span>
                      <v-icon class="ml-1">
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <div>
                      <v-card-title class="text-body-2 font-weight-bold">
                        Select login method
                      </v-card-title>
                      <v-divider />
                    </div>
                    <v-list density="compact">
                      <v-list-item
                        v-for="loginOption in loginOptions"
                        :key="loginOption.idpHint"
                        class="pr-6"
                        :prepend-icon="loginOption.icon"
                        :title="loginOption.option"
                        @click="login(loginOption.idpHint)"
                      />
                    </v-list>
                  </v-card>
                </v-menu>
              </v-col>
              <!-- Notifications -->
              <v-col cols="auto">
                <v-menu
                  v-if="isAuthenticated"
                  anchor="bottom"
                  transition="slide-y-transition"
                >
                  <template #activator="{ props }">
                    <v-btn
                      variant="text"
                      size="large"
                      class="mobile-icon-only mx-1 px-2"
                      aria-label="notifications"
                      v-bind="props"
                    >
                      <v-icon>mdi-bell-outline</v-icon>
                      <v-badge
                        v-if="pendingApprovalCount > 0"
                        dot
                        overlap
                        offset-y="-5"
                        offset-x="10"
                        color="error"
                      />
                      <span>Notifications</span>
                      <v-icon class="ml-1">
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <div class="menu-header">
                      <v-card-title class="text-body-1">
                        Notifications
                      </v-card-title>
                      <v-divider />
                    </div>
                    <v-list
                      tile
                      density="compact"
                    >
                      <v-list-item
                        v-if="pendingApprovalCount === 0"
                        :title="'No notifications'"
                      />
                      <v-list-item
                        v-else
                        :subtitle="`${pendingApprovalCount} ${pendingApprovalCount === 1 ?
                          'team member' : 'team members'} require approval to access this account`"
                        :title="`You have ${pendingApprovalCount} pending approvals`"
                        lines="two"
                        @click="goToTeamMembers()"
                      />
                    </v-list>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="auto">
                <!-- Account -->
                <v-menu
                  v-if="isAuthenticated"
                  location="bottom left"
                  transition="slide-y-transition"
                  attach="#appHeader"
                >
                  <template #activator="{ props }">
                    <v-btn
                      variant="text"
                      size="large"
                      class="user-account-btn"
                      aria-label="my account"
                      v-bind="props"
                    >
                      <v-avatar
                        tile
                        start
                        color="#4d7094"
                        size="32"
                        class="user-avatar white-text"
                      >
                        {{ username.slice(0,1) }}
                      </v-avatar>
                      <div class="user-info">
                        <div
                          class="user-name"
                          data-test="user-name"
                        >
                          {{ username }}
                        </div>
                        <div
                          class="account-name"
                          data-test="account-name"
                        >
                          {{ accountName }}
                        </div>
                      </div>
                      <v-icon class="ml-1">
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <!-- User Profile -->
                    <v-list
                      density="compact"
                      lines="two"
                    >
                      <v-list-item class="user-info">
                        <template #prepend>
                          <v-avatar
                            tile
                            color="#4d7094"
                            size="36"
                            class="user-avatar white-text"
                          >
                            {{ username.slice(0,1) }}
                          </v-avatar>
                        </template>
                        <v-list-item-title
                          class="user-name"
                          data-test="menu-user-name"
                        >
                          {{ username }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="account-name"
                          data-test="menu-account-name"
                        >
                          {{ accountName }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                    <v-list density="compact">
                      <!-- BEGIN: Hide if authentication is IDIR -->
                      <v-list-item
                        v-if="isBcscOrBceid"
                        prepend-icon="mdi-account-outline"
                        title="Edit Profile"
                        @click="goToUserProfile()"
                      />
                      <!-- END -->
                      <v-list-item
                        prepend-icon="mdi-logout-variant"
                        title="Log out"
                        @click="logout()"
                      />
                    </v-list>

                    <v-divider />

                    <!-- Account Settings -->
                    <v-list
                      v-if="currentAccount"
                      density="compact"
                    >
                      <v-list-subheader>ACCOUNT SETTINGS</v-list-subheader>
                      <v-list-item
                        prepend-icon="mdi-information-outline"
                        title="Account Info"
                        @click="goToAccountInfo(currentAccount)"
                      />
                      <v-list-item
                        prepend-icon="mdi-account-group-outline"
                        title="Team Members"
                        @click="goToTeamMembers()"
                      />
                      <v-list-item
                        v-if="showTransactions"
                        prepend-icon="mdi-file-document-outline"
                        title="Transactions"
                        @click="goToTransactions()"
                      />
                    </v-list>

                    <v-divider />

                    <!-- Switch Account -->
                    <div v-if="!isStaff ">
                      <v-list
                        v-if="switchableAccounts.length > 1"
                        class="switch-account"
                        density="compact"
                      >
                        <v-list-subheader>SWITCH ACCOUNT</v-list-subheader>
                        <v-list-item
                          v-for="(settings, id) in switchableAccounts"
                          :key="id"
                          :class="{ 'v-list-item--active': settings.id === currentAccount.id }"
                          color="primary"
                          :title="settings.label"
                          @click="switchAccount(settings, inAuth)"
                        >
                          <template #prepend>
                            <v-icon
                              v-if="settings.id === currentAccount.id"
                              :class="settings.additionalLabel ? 'mt-n4' : ''"
                              color="primary"
                            >
                              mdi-check
                            </v-icon>
                          </template>
                          <v-list-item-subtitle
                            v-if="settings.additionalLabel"
                            class="font-italic"
                            :class="{'primary--text' : settings.id === currentAccount.id}"
                          >
                            {{ `- ${settings.additionalLabel}` }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>

                      <v-divider />

                      <!-- Create a New Account -->
                      <v-list
                        v-if="canCreateAccount"
                        density="compact"
                      >
                        <v-list-item
                          prepend-icon="mdi-plus"
                          title="Create account"
                          @click="goToCreateBCSCAccount()"
                        />
                      </v-list>
                    </div>
                  </v-card>
                </v-menu>

                <v-btn
                  v-if="!isAuthenticated"
                  variant="text"
                  size="large"
                  @click="goToCreateAccount()"
                >
                  Create Account
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </header>
    <div id="warning-bar">
      <browser-version-alert />
    </div>
    <div id="warning-modal">
      <mobile-device-alert />
    </div>
    <div class="position: relative">
      <notification-panel
        :showNotifications="notificationPanel"
        @closeNotifications="closeNotificationPanel()"
      />
    </div>
  </div>
</template>

<script lang="ts">
// External
import { computed, defineComponent, nextTick, onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getModule } from 'vuex-module-decorators'
// BC Registry
// sbc modules
import AccountModule from '../modules/account'
import AuthModule from '../modules/auth'
import NotificationModule from 'sbc-common-components/src/store/modules/notification'
// sbc interfaces
import { UserSettings } from 'sbc-common-components/src/models/userSettings'
// sbc services
import LaunchDarklyService from 'sbc-common-components/src/services/launchdarkly.services'
// sbc utils
import {
  ALLOWED_URIS_FOR_PENDING_ORGS, Account, IdpHint, LoginSource, Pages, Role
} from 'sbc-common-components/src/util/constants'
import { AccountStatus, LDFlags } from 'sbc-common-components/src/util/enums'
import ConfigHelper from 'sbc-common-components/src/util/config-helper'
import {
  getAccountIdFromCurrentUrl, removeAccountIdFromUrl, appendAccountId
} from 'sbc-common-components/src/util/common-util'
// Local Components
import BrowserVersionAlert from './BrowserVersionAlert.vue'
import MobileDeviceAlert from './MobileDeviceAlert.vue'
import NotificationPanel from './NotificationPanel.vue'
import SbcProductSelector from './SbcProductSelector.vue'
import { useNavigation } from '@/sbc-common-components/composables'

export default defineComponent({
  name: 'SbcHeader',
  components: {
    SbcProductSelector,
    BrowserVersionAlert,
    MobileDeviceAlert,
    NotificationPanel
  },
  props: {
    redirectOnLoginSuccess: { default: '' },
    redirectOnLoginFail: { default: '' },
    redirectOnLogout: { default: '' },
    inAuth: { default: false },
    showActions: { default: true },
    showLoginMenu: { default: false },
    dashboardReturnUrl: { default: '' },
    showProductSelector: { default: false }
  },

  setup (props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // set modules
    if (!store.hasModule('account')) store.registerModule('account', AccountModule)
    if (!store.hasModule('auth')) store.registerModule('auth', AuthModule)
    if (!store.hasModule('notification')) store.registerModule('notification', NotificationModule)

    // module actions
    // account
    const loadUserInfo = async () => { await store.dispatch('account/loadUserInfo') }
    const syncAccount = async () => { await store.dispatch('account/syncAccount') }
    const syncCurrentAccount = async (settings: UserSettings) => {
      await store.dispatch('account/syncCurrentAccount', settings)
    }
    const syncUserProfile = async () => { await store.dispatch('account/syncUserProfile') }
    // auth
    const syncWithSessionStorage = () => { store.dispatch('auth/syncWithSessionStorage') }
    // notification
    const markAsRead = async () => { await store.dispatch('notification/markAsRead') }
    const fetchNotificationCount = async () => { await store.dispatch('notification/fetchNotificationCount') }
    const fetchNotificationUnreadPriorityCount = async () => {
      await store.dispatch('notification/fetchNotificationUnreadPriorityCount')
    }
    const fetchNotificationUnreadCount = async () => {
      await store.dispatch('notification/fetchNotificationUnreadCount')
    }
    const syncNotifications = async () => { await store.dispatch('notification/syncNotifications') }

    // navigation helpers
    const { getContextPath, redirectToPath } = useNavigation()

    // constants
    const loginOptions = [
      { idpHint: IdpHint.BCSC, option: 'BC Services Card', icon: 'mdi-account-card-details-outline' },
      { idpHint: IdpHint.BCEID, option: 'BCeID', icon: 'mdi-two-factor-authentication' },
      { idpHint: IdpHint.IDIR, option: 'IDIR', icon: 'mdi-account-group-outline' }
    ]
    const notificationPanel = ref(false)

    // Calculated Value
    const isAuthenticated = computed(() => { return store.getters['auth/isAuthenticated'] as boolean })
    const accountName = computed(() => store.getters['account/accountName'])
    const switchableAccounts = computed(() => store.getters['account/switchableAccounts'])
    const username = computed(() => store.getters['account/username'])
    const currentLoginSource = computed(() => store.getters['auth/currentLoginSource'] as string)
    const currentAccount = computed(() => store.state.account.currentAccount as UserSettings)
    const currentUser = computed(() => store.state.account.currentUser as any)
    const pendingApprovalCount = computed(() => store.state.account.pendingApprovalCount as number)
    const isBceid = computed(() => currentLoginSource.value === LoginSource.BCEID)
    const notificationUnreadCount = computed(() => store.state.notification.notificationUnreadCount as number)
    const notificationCount = computed(() => store.state.notification.notificationCount as number)
    const notificationUnreadPriorityCount = computed(() =>
        store.state.notification.notificationUnreadPriorityCount as number)
    const disableBCEIDMultipleAccount = computed(() =>
        LaunchDarklyService.getFlag(LDFlags.DisableBCEIDMultipleAccount) as boolean || false)
    const isWhatsNewOpen = computed(() => LaunchDarklyService.getFlag(LDFlags.WhatsNew) as boolean || false)
    const showTransactions = computed(() => {
      return [Account.PREMIUM, Account.SBC_STAFF, Account.STAFF].includes(currentAccount?.value?.accountType as Account)
    })
    const isStaff = computed(() => currentUser?.value?.roles?.includes(Role.Staff) as boolean || false)
    const isGovmUser = computed(() => currentUser?.value?.roles?.includes(Role.GOVMAccountUser) as boolean ||
     false)
    const isBcscOrBceid = computed(
      () => [LoginSource.BCSC.valueOf(), LoginSource.BCEID.valueOf()].indexOf(currentLoginSource.value) >= 0)
    const canCreateAccount = computed(() => {
      const disabledLogins:any = [LoginSource.BCROS.valueOf(), LoginSource.IDIR.valueOf()]
      if (disableBCEIDMultipleAccount.value) {
        disabledLogins.push(LoginSource.BCEID.valueOf())
      }
      return disabledLogins.indexOf(currentLoginSource.value) < 0
    })

    // mounted lifecycle
    onMounted(async () => {
      getModule(AccountModule, store)
      getModule(AuthModule, store)
      getModule(NotificationModule, store)
      syncWithSessionStorage()
      if (isAuthenticated?.value) {
        await loadUserInfo()
        await syncAccount()
        await updateProfile()
        // checking for account status
        await checkAccountStatus()
      }

      // fetching what's new information, need to wait the notifications load and get the counts
      await syncNotifications()
      await fetchNotificationCount()
      await fetchNotificationUnreadPriorityCount()
      await fetchNotificationUnreadCount()

      // remove id from URLsince its already stored in session
      if (getAccountIdFromCurrentUrl()) {
        await nextTick()
        window.history.replaceState({}, document.title, removeAccountIdFromUrl(window.location.href))
      }
    })

    // component functions
    const updateProfile = async (): Promise<void> => {
      if (isBceid?.value) {
        await syncUserProfile()
      }
    }
    const goToHome = () => {
      const url = props.inAuth ? Pages.HOME : appendAccountId(Pages.HOME)
      redirectToPath(props.inAuth, url)
    }
    const goToUserProfile = () => {
      const url = props.inAuth ? Pages.USER_PROFILE : appendAccountId(Pages.USER_PROFILE)
      redirectToPath(props.inAuth, url)
    }
    const goToCreateAccount = () => {
      redirectToPath(props.inAuth, Pages.CHOOSE_AUTH_METHOD)
    }
    const goToCreateBCSCAccount = () => {
      const redirectUrl: string = props.dashboardReturnUrl
        ? `${Pages.CREATE_ACCOUNT}?redirectToUrl=${encodeURIComponent(props.dashboardReturnUrl)}`
        : Pages.CREATE_ACCOUNT
      redirectToPath(props.inAuth, redirectUrl)
    }
    const goToAccountInfo = async (settings: UserSettings) => {
      if (!currentAccount?.value || !settings) {
        return
      }
      await syncCurrentAccount(settings)
      redirectToPath(props.inAuth, `${Pages.ACCOUNT}/${currentAccount?.value?.id}/${Pages.SETTINGS}/account-info`)
    }
    const goToTeamMembers = () => {
      if (!currentAccount?.value) {
        return
      }
      redirectToPath(props.inAuth, `${Pages.ACCOUNT}/${currentAccount?.value.id}/${Pages.SETTINGS}/team-members`)
    }
    const goToTransactions = () => {
      if (!currentAccount?.value) {
        return
      }
      redirectToPath(props.inAuth, `${Pages.ACCOUNT}/${currentAccount?.value.id}/${Pages.SETTINGS}/transactions`)
    }
    const checkAccountStatus = async () => {
      // redirect if accoutn status is suspended
      if ([AccountStatus.NSF_SUSPENDED, AccountStatus.SUSPENDED].some(
        status => status === currentAccount?.value?.accountStatus)
      ) {
        redirectToPath(props.inAuth, `${Pages.ACCOUNT_FREEZ}`)
      } else if (currentAccount?.value?.accountStatus === AccountStatus.PENDING_STAFF_REVIEW) {
        const targetPath = window.location.pathname
        const substringCheck = (element:string) => targetPath.indexOf(element) > -1
        // check if any of the url is the allowed uri
        const isAllowedUrl = ALLOWED_URIS_FOR_PENDING_ORGS.findIndex(substringCheck) > -1
        if (!isAllowedUrl) {
          const accountNme = encodeURIComponent(btoa(accountName?.value))
          redirectToPath(props.inAuth, `${Pages.PENDING_APPROVAL}/${accountNme}/true`)
        }
      }
    }
    const switchAccount = async (settings: UserSettings, inAuth?: boolean) => {
      emit('account-switch-started')
      if (route.params.orgId) {
        // If route includes a URL param for account, we need to refresh with the new account id
        router.push({ name: route.name, params: { orgId: settings.id } })
      }
      await syncCurrentAccount(settings)
      emit('account-switch-completed')

      if (!inAuth) {
        window.location.assign(appendAccountId(`${ConfigHelper.getAuthContextPath()}/${Pages.HOME}`))
      }
    }
    const logout = (): void => {
      if (props.redirectOnLogout) {
        const url = encodeURIComponent(props.redirectOnLogout)
        window.location.assign(`${getContextPath()}signout/${url}`)
      } else {
        window.location.assign(`${getContextPath()}signout`)
      }
    }
    const login = (idpHint: string): void => {
      if (props.redirectOnLoginSuccess) {
        let url = encodeURIComponent(props.redirectOnLoginSuccess)
        url += props.redirectOnLoginFail ? `/${encodeURIComponent(props.redirectOnLoginFail)}` : ''
        window.location.assign(`${getContextPath()}signin/${idpHint}/${url}`)
      } else {
        window.location.assign(`${getContextPath()}signin/${idpHint}`)
      }
    }
    const closeNotificationPanel = async (): Promise<void> => {
      notificationPanel.value = false
      if (notificationUnreadCount.value > 0) {
        await markAsRead()
      }
    }

    // component watchers
    watch(isAuthenticated, async (val) => {
      if (val) {
        await updateProfile()
      }
    })

    return {
      ...props,
      closeNotificationPanel,
      goToAccountInfo,
      goToCreateAccount,
      goToCreateBCSCAccount,
      goToHome,
      goToTeamMembers,
      goToTransactions,
      goToUserProfile,
      login,
      logout,
      loginOptions,
      store,
      switchAccount,
      syncWithSessionStorage,
      isAuthenticated,
      switchableAccounts,
      accountName,
      username,
      currentAccount,
      currentUser,
      pendingApprovalCount,
      notificationPanel,
      isBceid,
      notificationUnreadCount,
      notificationCount,
      notificationUnreadPriorityCount,
      isWhatsNewOpen,
      showTransactions,
      isStaff,
      isGovmUser,
      isBcscOrBceid,
      canCreateAccount
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~sbc-common-components/src/assets/scss/layout.scss";
@import "~sbc-common-components/src/assets/scss/theme.scss";

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

.white-text {
  color: white;
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

.v-list-subheader {
  color: $gray9 !important;
  font-weight: 700;
}

:deep(.v-list-subheader__text) {
  opacity: 1 !important;
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
