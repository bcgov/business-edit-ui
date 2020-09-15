<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <name-request-invalid-error-dialog
      attach="#app"
      :dialog="nameRequestInvalidErrorDialog"
      :type="nameRequestInvalidType"
      @okay="nameRequestInvalidErrorDialog = false"
      @redirect="goToDashboard(true)"
    />

    <file-and-pay-invalid-name-request-dialog
      attach="#app"
      :dialog="fileAndPayInvalidNameRequestDialog"
      @okay="goToManageBusinessDashboard()"
    />

    <account-authorization-dialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard(true)"
      @retry="initApp()"
    />

    <invalid-incorporation-application-dialog
      attach="#app"
      :dialog="invalidIncorporationApplicationDialog"
      @exit="goToDashboard(true)"
    />

    <fetch-error-dialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard(true)"
      @retry="initApp()"
    />

    <payment-error-dialog
      attach="#app"
      :dialog="paymentErrorDialog"
      @exit="goToDashboard(true)"
    />

    <bcol-error-dialog
      attach="#app"
      :bcolObject="bcolObj"
      filingType="Incorporation Application"
      @exit="goToDashboard(true)"
    />

    <save-error-dialog
      attach="#app"
      :dialog="saveErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
      @okay="saveErrorDialog = false"
    />

    <name-request-error-dialog
      attach="#app"
      :type="nameRequestErrorType"
      :dialog="nameRequestErrorDialog"
      @close="nameRequestErrorDialog = false"
    />

    <confirm-dialog
      ref="confirm"
      attach="#app"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container" v-show="!haveData">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading</div>
        </div>
      </div>
    </transition>

    <sbc-header />

    <div class="app-body">
      <main v-if="!isErrorDialog">
        <entity-info />

        <v-container class="view-container pa-0">
          <v-row>
            <v-col cols="12" lg="9">
              <router-view
                :appReady=appReady
                @profileReady="profileReady = true"
                @fetchError="fetchErrorDialog = true"
                @haveData="haveData = true"
                @filingData="filingData = $event"
                @haveChanges="showFeeSummary = $event"
              />
            </v-col>
            <v-col cols="12" lg="3" style="position: relative">
              <template v-if="showFeeSummary">
                <aside>
                  <affix
                    relative-element-selector=".col-lg-9"
                    :offset="{ top: 86, bottom: 12 }"
                  >
                    <sbc-fee-summary
                      :filingData="[...filingData]"
                      :payURL="payApiUrl"
                    />
                  </affix>
                </aside>
              </template>
            </v-col>
          </v-row>
        </v-container>

        <actions
          :key="$route.path"
          @goToDashboard="goToDashboard()"
        />
      </main>
    </div>

    <sbc-footer :aboutText=aboutText />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'
import { BAD_REQUEST, PAYMENT_REQUIRED, FORBIDDEN, UNPROCESSABLE_ENTITY } from 'http-status-codes'
import { getKeycloakRoles, updateLdUser } from '@/utils'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Actions } from '@/components/common'
import * as Views from '@/views'

// Dialogs, mixins, interfaces, etc
import { AccountAuthorizationDialog, BcolErrorDialog, NameRequestInvalidErrorDialog, ConfirmDialog, FetchErrorDialog,
  InvalidIncorporationApplicationDialog, PaymentErrorDialog, SaveErrorDialog, FileAndPayInvalidNameRequestDialog,
  NameRequestErrorDialog
} from '@/components/dialogs'
import { BcolMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType } from '@/interfaces'

// Enums and Constants
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    EntityInfo,
    Actions,
    NameRequestInvalidErrorDialog,
    AccountAuthorizationDialog,
    FetchErrorDialog,
    InvalidIncorporationApplicationDialog,
    NameRequestErrorDialog,
    PaymentErrorDialog,
    SaveErrorDialog,
    ConfirmDialog,
    BcolErrorDialog,
    FileAndPayInvalidNameRequestDialog,
    ...Views
  }
})
export default class App extends Mixins(BcolMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  readonly ALTERATION = 'alteration'
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global getters
  @Getter haveChanges!: boolean
  @Getter getBusinessId!: string

  // Global setters
  @Action setBusinessId!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setUserEmail: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF
  @Action setCreateShareStructureStepValidity!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setAccountInformation!: ActionBindingIF
  @Action setKeycloakRoles!: ActionBindingIF

  // Local Properties
  private filing: any
  private filingData: Array<FilingDataIF> = []
  private accountAuthorizationDialog: boolean = false
  private fetchErrorDialog: boolean = false
  private invalidIncorporationApplicationDialog: boolean = false
  private paymentErrorDialog: boolean = false
  private bcolObj: object = null
  private saveErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private nameRequestErrorDialog: boolean = false
  private nameRequestErrorType: string = ''
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []
  private fileAndPayInvalidNameRequestDialog: boolean = false
  private showFeeSummary: boolean = false

  // FUTURE: change profileReady/appReady/haveData to a state machine?

  /** Whether the user profile is ready (ie, auth is loaded) and we can init the app. */
  private profileReady: boolean = false

  /** Whether the app is ready and the views can now load their data. */
  private appReady: boolean = false

  /** Whether the views have loaded their data and the spinner can be hidden. */
  private haveData: boolean = false

  /** Whether the token refresh service is initialized. */
  private tokenService: boolean = false

  /** The URL of the Pay API. */
  private get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    return (
      this.accountAuthorizationDialog ||
      this.bcolObj != null ||
      this.nameRequestInvalidErrorDialog ||
      this.fetchErrorDialog ||
      this.invalidIncorporationApplicationDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** True if Jest is running the code. */
  private get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** The About text. */
  private get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  /** Whether user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /**
   * Called when component is created.
   * NB: User may not be authed yet.
   */
  private created (): void {
    // before unloading this page, if there are changes then prompt user
    window.onbeforeunload = (event) => {
      if (this.haveChanges) {
        // cancel closing the page
        event.preventDefault()
        // pop up confirmation dialog
        // NB: custom text is not supported in all browsers
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // listen for save error events
    this.$root.$on('save-error-event', async error => {
      console.log('Save error =', error) // eslint-disable-line no-console
      // process errors/warnings
      switch (error?.response?.status) {
        case PAYMENT_REQUIRED:
          // Changes were saved if a 402 is received. haveChanges flag is cleared.
          this.haveChanges = false
          const errObj = await this.getErrorObj(this.getErrorCode(error))
          if (errObj) {
            this.bcolObj = errObj
          } else {
            this.paymentErrorDialog = true
          }
          break
        case BAD_REQUEST:
        case FORBIDDEN:
        case UNPROCESSABLE_ENTITY:
          this.saveErrors = error?.response?.data?.errors || []
          this.saveWarnings = error?.response?.data?.warnings || []
          this.saveErrorDialog = true
          break
        default:
          this.saveErrorDialog = true
      }
    })

    // listen for invalid name requests
    this.$root.$on('invalid-name-request', async error => {
      console.log('Name request error =', error) // eslint-disable-line no-console
      this.nameRequestErrorType = error
      this.nameRequestErrorDialog = true
    })

    // if we are already authenticated then go right to init
    // (since we won't get the event from Signin component)
    if (this.isAuthenticated) this.onProfileReady(true)
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop listening for custom events
    this.$root.$off('save-error-event')
    this.$root.$off('invalid-name-request')
  }

  /** Called when profile is ready -- we can now init app. */
  @Watch('profileReady')
  private async onProfileReady (val: boolean): Promise<void> {
    //
    // do the one-time things here
    //

    if (val) {
      // start KC token service
      await this.startTokenService()

      // get and store business ID
      const businessId = sessionStorage.getItem('BUSINESS_ID')
      this.setBusinessId(businessId)

      // load account information
      this.loadAccountInformation()

      // fetch current user and update Launch Darkly
      await this.loadCurrentUserLd()

      // initialize app
      await this.initApp()
    }
  }

  /** Initializes application. Also called for retry. */
  private async initApp (): Promise<void> {
    //
    // do the repeatable things here
    //

    // reset errors in case of retry
    this.resetFlags()

    // get and store keycloak roles
    try {
      const keycloakRoles = getKeycloakRoles()
      this.setKeycloakRoles(keycloakRoles)
    } catch (error) {
      console.log('Keycloak error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // ensure user is authorized to access this business
    try {
      await this.loadAuth()
    } catch (error) {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // store today's date
    // NB: keep this here to reload date on retry
    this.setCurrentDate(this.dateToUsableString(new Date()))

    // finally, let router views know they can load their data
    this.appReady = true
  }

  /** Redirects to Manage Businesses dashboard. */
  private goToManageBusinessDashboard () : void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
    this.setHaveChanges(false)
    window.location.assign(manageBusinessUrl)
  }

  /** Redirects to entity dashboard. */
  private goToDashboard (force: boolean = false): void {
    // check if there are no data changes
    if (!this.haveChanges || force) {
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      window.location.assign(dashboardUrl + this.getBusinessId)
      return
    }

    // open confirmation dialog and wait for response
    this.$refs.confirm.open(
      'Unsaved Changes',
      'You have unsaved changes in your Incorporation Application. Do you want to exit?',
      {
        width: '45rem',
        persistent: true,
        yes: 'Return to my application',
        no: null,
        cancel: 'Exit without saving'
      }
    ).then(() => {
      // if we get here, Yes was clicked
      // nothing to do
    }).catch(() => {
      // if we get here, Cancel was clicked
      // ignore changes
      this.setHaveChanges(false)
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      window.location.assign(dashboardUrl + this.getBusinessId)
    })
  }

  /** Starts token service that refreshes KC token periodically. */
  private async startTokenService (): Promise<void> {
    // only initialize once
    // don't start during Jest tests as it messes up the test JWT
    if (this.tokenService || this.isJestRunning) return

    try {
      console.info('Starting token refresh service...') // eslint-disable-line no-console
      await KeycloakService.initializeToken()
      this.tokenService = true
    } catch (e) {
      // this happens when the refresh token has expired
      // 1. clear flags and keycloak data
      this.tokenService = false
      this.profileReady = false
      sessionStorage.removeItem(SessionStorageKeys.KeyCloakToken)
      sessionStorage.removeItem(SessionStorageKeys.KeyCloakRefreshToken)
      sessionStorage.removeItem(SessionStorageKeys.KeyCloakIdToken)
      sessionStorage.removeItem(SessionStorageKeys.CurrentAccount)
      // 2. reload app to get new tokens
      location.reload()
    }
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.appReady = false
    this.haveData = false
    this.showFeeSummary = false
    this.bcolObj = null
    this.nameRequestInvalidErrorDialog = false
    this.invalidIncorporationApplicationDialog = false
    this.accountAuthorizationDialog = false
    this.fetchErrorDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Fetches authorizations and verifies and stores roles. */
  private async loadAuth (): Promise<any> {
    // NB: will throw if API error
    const response = await this.getAuthorizations(this.getBusinessId)
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    const authRoles = response?.data?.roles
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Gets account information (e.g. Premium account) and stores it. */
  private loadAccountInformation (): void {
    const currentAccount = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
    if (currentAccount) {
      const accountInfo = JSON.parse(currentAccount)
      this.setAccountInformation(accountInfo)
    }
  }

  /** Fetches current user and updates Launch Darkly accordingly. */
  private async loadCurrentUserLd (): Promise<any> {
    try {
      const response = await this.getCurrentUser()
      const currentUser = response?.data
      if (!currentUser) throw new Error('Invalid data')

      // since username is unique, use it as the user key
      const key: string = currentUser.username
      const email: string = currentUser.email
      const firstName: string = currentUser.firstname
      const lastName: string = currentUser.lastname
      // remove leading { and trailing } and tokenize string
      const custom: any = { roles: currentUser.roles?.slice(1, -1).split(',') }

      await updateLdUser(key, email, firstName, lastName, custom)
    } catch (error) {
      // just log the error -- no need to halt app
      console.log('Load current user error =', error) // eslint-disable-line no-console
    }
  }
}
</script>

<style lang="scss" scoped>
// place app header on top of dialogs (and therefore still usable)
.app-header {
  z-index: 1000;
}
</style>
