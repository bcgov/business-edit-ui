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

        <v-container class="view-container pt-4">
          <v-row>
            <v-col cols="12" lg="9">
              <router-view />
            </v-col>
            <v-col cols="12" lg="3" style="position: relative">
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
import { State, Action, Getter } from 'vuex-class'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'
import { BAD_REQUEST, PAYMENT_REQUIRED, FORBIDDEN, UNPROCESSABLE_ENTITY } from 'http-status-codes'
import { getKeycloakRoles } from '@/utils'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Actions } from '@/components/common'
import * as Views from '@/views'

// Dialogs, mixins, interfaces, etc
import { AccountAuthorizationDialog, BcolErrorDialog, NameRequestInvalidErrorDialog, ConfirmDialog, FetchErrorDialog,
  InvalidIncorporationApplicationDialog, PaymentErrorDialog, SaveErrorDialog, FileAndPayInvalidNameRequestDialog
} from '@/components/dialogs'
import { BcolMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType } from '@/interfaces'

// Enums and Constants
import { EntityTypes, FilingCodes, RouteNames } from '@/enums'
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

  // Global state
  @State(state => state.stateModel.entityType)
  readonly entityType!: string

  @State(state => state.stateModel.incorporationDateTime.isFutureEffective)
  readonly isFutureEffective!: boolean

  // Global getters
  @Getter haveChanges!: boolean
  @Getter getBusinessId!: string

  // Global actions
  @Action setBusinessId!: ActionBindingIF
  @Action setCurrentStep!: ActionBindingIF
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
  private haveData: boolean = false
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []
  private fileAndPayInvalidNameRequestDialog: boolean = false

  // Template Enums
  readonly RouteNames = RouteNames

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

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The About text. */
  private get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  /** Called when component is created. */
  private created (): void {
    // do nothing until user has signed in
    if (!this.isAuthenticated) return

    // decode and store keycloak roles from JWT
    try {
      this.setKeycloakRoles(getKeycloakRoles())
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // before unloading this page, if there are changes then prompt user
    window.onbeforeunload = (event) => {
      if (this.haveChanges) {
        event.preventDefault()
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

    // listen for name request invalid error events
    this.$root.$on('name-request-invalid-error', async error => {
      console.log('NR error during File and Pay =', error) // eslint-disable-line no-console
      this.fileAndPayInvalidNameRequestDialog = true
    })

    // listen for name request retrieve error events
    this.$root.$on('name-request-retrieve-error', async () => {
      console.log('Error while retrieving NR during File and Pay') // eslint-disable-line no-console
      this.nameRequestInvalidErrorDialog = true
    })
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop listening for save error event
    this.$root.$off('save-error-event')
    this.$root.$off('name-request-invalid-errort')
    this.$root.$off('name-request-retrieve-error')
  }

  /** Initializes application. */
  private async initApp (routeChanged: boolean = false): Promise<void> {
    // if route has changed and we already have data, don't re-init
    if (routeChanged && this.haveData) return

    try {
      // reset errors in case this method is invoked more than once (ie, retry)
      this.resetFlags()

      // get business ID query param
      const businessId = this.$route?.query?.businessId as string
      if (!businessId) {
        this.fetchErrorDialog = true
        if (!businessId) throw new Error('Invalid business identifier')
      }
      this.setBusinessId(businessId)

      // ensure user is authorized or is staff to access this business
      await this.checkAuth(businessId).catch(error => {
        this.accountAuthorizationDialog = true
        throw new Error(`Auth error: ${error}`)
      })

      // fetch IA filing to alter or correct
      const { filing } = await this.fetchFiling(this.INCORPORATION_APPLICATION) // TEMP FOR TESTING
      // const { filing } = await this.fetchFiling(this.ALTERATION) // FUTURE STATE

      // parse filing into store
      this.parseIncorpFiling(filing)

      // initialize Fee Summary data
      this.initEntityFees()

      // store today's date
      this.setCurrentDate(this.dateToUsableString(new Date()))

      this.haveData = true
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
      // stop init and fall through to finally
      this.haveData = true
    } finally {
      // wait for things to stabilize, then reset flag
      Vue.nextTick(() => this.setHaveChanges(false))
    }
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

  /** Starts token service to refresh KC token periodically. */
  private async startTokenService (): Promise<void> {
    // only initialize once
    // don't start during Jest tests as it messes up the test JWT
    if (this.tokenService || this.isJestRunning) return
    try {
      console.info('Starting token refresh service...') // eslint-disable-line no-console
      await KeycloakService.initializeToken()
      this.tokenService = true
    } catch (error) {
      // Happens when the refresh token has expired in session storage
      // reload to get new tokens

      // eslint-disable-next-line no-console
      console.log('Could not initialize token refresher: ', error)
      this.clearKeycloakSession()
      location.reload()
    }
  }

  /** Clears Keycloak token information from session storage. */
  private clearKeycloakSession (): void {
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakRefreshToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakIdToken)
    sessionStorage.removeItem(SessionStorageKeys.CurrentAccount)
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.haveData = false
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

  /** Gets authorizations from Auth API, verifies roles, and stores them. */
  private async checkAuth (businessIdentifier: string): Promise<any> {
    // NB: will throw if API error
    const response = await this.getAuthorizations(businessIdentifier)
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    const authRoles = response?.data?.roles
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Gets account information (e.g. Premium account) and loads it into the state model. */
  private loadAccountInformation (): void {
    if (sessionStorage.getItem(SessionStorageKeys.CurrentAccount)) {
      const accountInfo = JSON.parse(sessionStorage.getItem(SessionStorageKeys.CurrentAccount))
      this.setAccountInformation(accountInfo)
    }
  }

  /** Initializes the Fee Summary based on the filing type. */
  private initEntityFees (): void {
    switch (this.$route.name) {
      case RouteNames.CORRECTION:
        this.filingData = [{
          filingTypeCode: FilingCodes.CORRECTION,
          entityType: EntityTypes.BCOMP
        }]
        break
      case RouteNames.ALTERATION:
        this.filingData = [{
          filingTypeCode: FilingCodes.ALTERATION,
          entityType: EntityTypes.BCOMP
        }]
        break
      default:
        this.filingData = []
    }
  }

  /** Called when $route property changes. Used to init app. */
  @Watch('$route', { immediate: true })
  private async onRouteChanged (): Promise<void> {
    const isSigninRoute = (this.$route.name === 'signin')
    const isSignoutRoute = (this.$route.name === 'signout')

    // don't init if we are still on signin or signout route
    if (!isSigninRoute && !isSignoutRoute) {
      await this.startTokenService()
      await this.initApp(true)

      // Allow user settings account information to load into session storage before checking
      // There can be a timing issue when a session is first established where account information
      // is not available right away in session storage
      await Vue.nextTick()
      this.loadAccountInformation()
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
