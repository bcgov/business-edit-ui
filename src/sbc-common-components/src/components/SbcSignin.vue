<template>
  <loading-screen :is-loading="isLoading"></loading-screen>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Role, LoginSource, Pages } from '../util/constants'
import KeyCloakService from '../services/keycloak.services'
import LoadingScreen from './LoadingScreen.vue'
import TokenService from '../services/token.services'
import { getModule } from 'vuex-module-decorators'
import AccountModule from '../store/modules/account'
import AuthModule from '../store/modules/auth'
import { mapActions, mapState } from 'vuex'
import { KCUserProfile } from '../models/KCUserProfile'
import NavigationMixin from '../mixins/navigation-mixin'

@Component({
  components: {
    LoadingScreen
  },
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
    this.$options.methods = {
      ...(this.$options.methods || {}),
      ...mapActions('account', [
        'loadUserInfo',
        'syncAccount',
        'getCurrentUserProfile',
        'updateUserProfile'
      ])
    }
  }
})
export default class SbcSignin extends NavigationMixin {
  private isLoading = true
  @Prop({ default: 'bcsc' }) idpHint!: string
  @Prop({ default: '' }) redirectUrlLoginFail!: string
  @Prop({ default: false }) inAuth!: boolean;
  private readonly loadUserInfo!: () => KCUserProfile
  private readonly syncAccount!: () => Promise<void>
  private readonly getCurrentUserProfile!: (isAuth: boolean) => Promise<any>
  private readonly updateUserProfile!: () => Promise<void>

  private async mounted () {
    getModule(AccountModule, this.$store)
    // Initialize keycloak session
    const kcInit = KeyCloakService.initializeKeyCloak(this.idpHint, this.$store)
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

        this.$emit('sync-user-profile-ready')
      }
    }).catch(() => {
      if (this.redirectUrlLoginFail) {
        window.location.assign(decodeURIComponent(this.redirectUrlLoginFail))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
