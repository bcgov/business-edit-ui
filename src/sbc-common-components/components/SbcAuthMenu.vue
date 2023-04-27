<template>
  <!-- Login Menu -->
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
</template>

<script setup lang="ts">
// External
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { getModule } from 'vuex-module-decorators'
// BC Registries
import { KCUserProfile } from 'sbc-common-components/src/models/KCUserProfile'
import { UserSettings } from 'sbc-common-components/src/models/userSettings'
import { Role, IdpHint, LoginSource, Pages } from 'sbc-common-components/src/util/constants'
// Local
import AccountModule from '../modules/account'
import AuthModule from '../modules/auth'
import { useNavigation } from '../composables'
import KeyCloakService from '../services/keycloak.services'

const props = defineProps({
  fromLogin: { default: false },
  inAuth: { default: false },
  redirectOnLoginSuccess: { default: '' },
  redirectOnLoginFail: { default: '' }
})

const store = useStore()
// set modules
if (!store.hasModule('account')) store.registerModule('account', AccountModule)
if (!store.hasModule('auth')) store.registerModule('auth', AuthModule)
// module getters
const isAuthenticated = computed(() => { return store.getters['auth/isAuthenticated'] as boolean })
const currentLoginSource = computed(() => { return store.getters['auth/currentLoginSource'] })
const accountName = computed(() => { return store.getters['auth/accountName'] })
// module actions
// account
const getCurrentUserProfile = async (inAuth: boolean): Promise<any> => {
  return await store.dispatch('account/getCurrentUserProfile', inAuth)
}
const loadUserInfo = async (): Promise<KCUserProfile> => {
  return await store.dispatch('account/loadUserInfo')
}
const syncAccount = async () => { await store.dispatch('account/syncAccount') }
const syncUserProfile = async () => { await store.dispatch('account/syncUserProfile') }
const updateUserProfile = async () => { await store.dispatch('account/updateUserProfile') }
// auth
const syncWithSessionStorage = () => { store.dispatch('auth/syncWithSessionStorage') }

// composables
const { getContextPath, redirectToPath } = useNavigation()

// constants
const loginOptions = [
  { idpHint: IdpHint.BCSC, option: 'BC Services Card', icon: 'mdi-card-account-details-outline' },
  { idpHint: IdpHint.BCEID, option: 'BCeID', icon: 'mdi-two-factor-authentication' },
  { idpHint: IdpHint.IDIR, option: 'IDIR', icon: 'mdi-account-group-outline' }
]

// local variables
const currentAccount = computed(() => store.state.account.currentAccount as UserSettings)
const isBceid = computed(() => currentLoginSource?.value === LoginSource.BCEID)

onMounted(async () => {
  getModule(AccountModule, store)
  getModule(AuthModule, store)
  syncWithSessionStorage()
  if (isAuthenticated?.value) {
    await loadUserInfo()
    await syncAccount()
    await updateProfile()
    // checking for account status
    await checkAccountStatus()
  }
})

// component functions
const updateProfile = async (): Promise<void> => {
  if (isBceid?.value) {
    await syncUserProfile()
  }
}
watch(isAuthenticated, async (val: boolean) => {
  if (val) { await updateProfile() }
})

const checkAccountStatus = async () => {
  // redirect if account status is suspended
  if (currentAccount?.value?.accountStatus && currentAccount?.value?.accountStatus === 'NSF_SUSPENDED') {
    redirectToPath(props.inAuth, `${Pages.ACCOUNT_FREEZ}`)
  } else if (currentAccount?.value?.accountStatus === 'PENDING_AFFIDAVIT_REVIEW') {
    redirectToPath(props.inAuth, `${Pages.PENDING_APPROVAL}/${accountName.value}/true`)
  }
}

const login = (idpHint: string) => {
  if (!props.fromLogin) {
    if (props.redirectOnLoginSuccess) {
      let url = encodeURIComponent(props.redirectOnLoginSuccess)
      url += props.redirectOnLoginFail ? `/${encodeURIComponent(props.redirectOnLoginFail)}` : ''
      window.location.assign(`${getContextPath()}signin/${idpHint}/${url}`)
    } else {
      window.location.assign(`${getContextPath()}signin/${idpHint}`)
    }
  } else {
    // Initialize keycloak session
    const kcInit = KeyCloakService.initializeKeyCloak(idpHint, store)
    kcInit.then(async (authenticated: boolean) => {
      if (authenticated) {
        // eslint-disable-next-line no-console
        console.info('[SignIn.vue]Logged in User. Init Session and Starting refreshTimer')
        // Set values to session storage
        await KeyCloakService.initSession()
        // tell KeycloakServices to load the user info
        const userInfo = await loadUserInfo()

        // update user profile
        await updateUserProfile()

        // sync the account if there is one
        await syncAccount()

        // if not from the sbc-auth, do the checks and redirect to sbc-auth
        if (!props.inAuth) {
          console.log('[SignIn.vue]Not from sbc-auth. Checking account status')
          // redirect to create account page if the user has no 'account holder' role
          const isRedirectToCreateAccount = (
            userInfo.roles.includes(Role.PublicUser) && !userInfo.roles.includes(Role.AccountHolder))

          const currentUser = await getCurrentUserProfile(props.inAuth)

          if ((userInfo?.loginSource !== LoginSource.IDIR) && !(currentUser?.userTerms?.isTermsOfUseAccepted)) {
            console.log('[SignIn.vue]Redirecting. TOS not accepted')
            redirectToPath(props.inAuth, Pages.USER_PROFILE_TERMS)
          } else if (isRedirectToCreateAccount) {
            console.log('[SignIn.vue]Redirecting. No Valid Role')
            switch (userInfo.loginSource) {
              case LoginSource.BCSC:
                redirectToPath(props.inAuth, Pages.CREATE_ACCOUNT)
                break
              case LoginSource.BCEID:
                redirectToPath(props.inAuth, Pages.CHOOSE_AUTH_METHOD)
                break
            }
          }
        }
      }
    }).catch(() => {
      if (props.redirectOnLoginFail) {
        window.location.assign(decodeURIComponent(props.redirectOnLoginFail))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~sbc-common-components/src/assets/scss/theme.scss";
.v-list--dense .v-subheader,
.v-list-item {
  height: 40px !important;
  min-height: 0px !important;
  padding: 0 1.25rem !important;
}

.v-list-item-title {
  font-size: .875rem!important;
  font-weight: 500;
  line-height: 1rem;
  align-self: center;
}

.v-list-item-avatar {
  margin:8px 32px 8px 0px;
}

.v-card-title.body-2 {
  font-size: 0.875rem !important;
  font-family: "BCSans"!important;
  font-size: .875rem!important;
  letter-spacing: .0178571429em!important;
  line-height: 1.25rem;
  padding: 16px;
}
</style>
