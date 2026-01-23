<template>
  <v-app
    id="app"
    class="app-container"
  >
    <!-- Dialogs -->
    <ConfirmDialogShared
      ref="confirm"
      attach="#app"
    />

    <FileAndPayInvalidNameRequestDialog
      attach="#app"
      :dialog="fileAndPayInvalidNameRequestDialog"
      @okay="goToManageBusinessDashboard()"
    />

    <AccountAuthorizationDialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard()"
      @retry="reload()"
    />

    <FetchErrorDialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard()"
      @retry="reload()"
    />

    <!-- FUTURE: pass actual filing name -->
    <PaymentErrorDialog
      attach="#app"
      filingName="Application"
      :dialog="paymentErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard()"
      @okay="paymentErrorDialog = false"
    />

    <!-- FUTURE: pass actual filing name -->
    <StaffPaymentErrorDialog
      attach="#app"
      filingName="Application"
      :dialog="staffPaymentErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @close="staffPaymentErrorDialog = false"
    />

    <!-- FUTURE: pass actual filing name -->
    <SaveErrorDialog
      attach="#app"
      filingName="Filing"
      :dialog="saveErrorDialog || updateErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard()"
      @okay="saveErrorDialog = false; updateErrorDialog = false"
    />

    <NameRequestErrorDialog
      attach="#app"
      :type="nameRequestErrorType"
      :dialog="nameRequestErrorDialog"
      @close="nameRequestErrorDialog = false"
    />

    <ConfirmDeleteAllDialog
      attach="#app"
      :dialog="confirmDeleteAllDialog"
      @confirm="doDeleteAll()"
      @cancel="confirmDeleteAllDialog = false"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div
        v-show="!haveData && !isErrorDialog"
        class="loading-container"
      >
        <div class="loading__content">
          <v-progress-circular
            color="primary"
            size="50"
            indeterminate
          />
          <div class="loading-msg">
            Loading
          </div>
        </div>
      </div>
    </transition>

    <SbcHeader />

    <!-- Alert banner -->
    <v-alert
      v-if="bannerText"
      tile
      dense
      class="mb-0"
      color="warning"
    >
      <div
        class="mb-0 text-center colour-dk-text"
        v-html="bannerText"
      />
    </v-alert>

    <div class="app-body">
      <main v-if="!isErrorDialog">
        <BreadcrumbShared :breadcrumbs="breadcrumbs" />
        <EntityInfo />
        <router-view
          :appReady="appReady"
          :isSummaryMode="isSummaryMode"
          @fetchError="fetchErrorDialog = true"
          @haveData="haveData = true"
        />
      </main>
    </div>

    <SbcFooter :aboutText="aboutText" />
  </v-app>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { GetFeatureFlag, GetKeycloakRoles, IsAuthorized, Navigate, UpdateLdUser, Sleep } from '@/utils/'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import { Actions, EntityInfo } from '@/components/common/'
import { Breadcrumb as BreadcrumbShared } from '@bcrs-shared-components/breadcrumb/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import * as Views from '@/views/'
import * as Dialogs from '@/dialogs/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FilingTemplateMixin } from '@/mixins/'
import { AccountInformationIF, ConfirmDialogType } from '@/interfaces/'
import { BreadcrumbIF, CompletingPartyIF } from '@bcrs-shared-components/interfaces/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { AuthorizationRoles, AuthorizedActions, FilingTypes, RouteNames } from '@/enums/'
import { getBusinessDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb, getRegistryDashboardBreadcrumb,
  getStaffDashboardBreadcrumb } from '@/resources/BreadCrumbResources'
import DateUtilities from '@/services/date-utilities'
import { useStore } from '@/store/store'

@Component({
  components: {
    Actions,
    BreadcrumbShared,
    ConfirmDialogShared,
    EntityInfo,
    SbcHeader,
    SbcFooter,
    ...Dialogs,
    ...Views
  }
})
export default class App extends Mixins(CommonMixin, FilingTemplateMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Store getters
  @Getter(useStore) getAuthRoles!: Array<AuthorizationRoles>
  @Getter(useStore) getCurrentAccount!: AccountInformationIF
  @Getter(useStore) getCurrentJsDate!: Date
  @Getter(useStore) getOrgInfo!: any
  @Getter(useStore) getUserInfo!: any
  @Getter(useStore) getUserFirstname!: string
  @Getter(useStore) getUserLastname!: string
  @Getter(useStore) haveUnsavedChanges!: boolean
  @Getter(useStore) isCorrectionEditing!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean
  @Getter(useStore) isSummaryMode!: boolean

  // Store actions
  @Action(useStore) setAuthRoles!: (x: Array<AuthorizationRoles>) => void
  @Action(useStore) setAppValidate!: (x: boolean) => void
  @Action(useStore) setAuthorizedActions!: (x: Array<AuthorizedActions>) => void
  @Action(useStore) setBusinessId!: (x: string) => void
  @Action(useStore) setCompletingParty!: (x: CompletingPartyIF) => void
  @Action(useStore) setComponentValidate!: (x: boolean) => void
  @Action(useStore) setCurrentAccount!: (x: AccountInformationIF) => void
  @Action(useStore) setCurrentDate!: (x: string) => void
  @Action(useStore) setCurrentJsDate!: (x: Date) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setFilingType!: (x: FilingTypes) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setOrgInfo!: (x: any) => void
  @Action(useStore) setUserInfo!: (x: any) => void

  // Local properties
  accountAuthorizationDialog = false
  confirmDeleteAllDialog = false
  fetchErrorDialog = false
  fileAndPayInvalidNameRequestDialog = false
  nameRequestErrorDialog = false
  nameRequestErrorType = ''
  paymentErrorDialog = false
  saveErrorDialog = false
  updateErrorDialog = false
  saveErrors: Array<object> = []
  saveWarnings: Array<object> = []
  staffPaymentErrorDialog = false

  // FUTURE: change appReady/haveData to a state machine?
  /** Whether the app is ready and the views can now load their data. */
  appReady = false

  /** Whether the views have loaded their data and the spinner can be hidden. */
  haveData = false

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = null as any // NodeJS.Timeout

  /** The route breadcrumbs list. */
  get breadcrumbs (): Array<BreadcrumbIF> {
    const crumbs: Array<BreadcrumbIF> = [
      getBusinessDashboardBreadcrumb(),
      {
        text: this.$route.meta?.title || 'Unknown Filing',
        to: { name: this.$route.name }
      }
    ]

    // Set breadcrumbs based on permissions
    if (IsAuthorized(AuthorizedActions.STAFF_BREADCRUMBS)) {
      // set StaffDashboard as home crumb
      crumbs.unshift(getStaffDashboardBreadcrumb())
    } else {
      // set Home and Dashboard crumbs
      crumbs.unshift(getRegistryDashboardBreadcrumb(), getMyBusinessRegistryBreadcrumb())
    }

    return crumbs
  }

  /** True if an error dialog is displayed. */
  get isErrorDialog (): boolean {
    // NB: ignore nameRequestErrorDialog (to leave underlying components rendered)
    // NB: ignore confirmDeleteAllDialog (to leave underlying components rendered)
    // NB: ignore staffPaymentErrorDialog (to leave underlying components rendered)
    // NB: ignore saveErrorDialog (to leave underlying components rendered)
    return (
      this.accountAuthorizationDialog ||
      this.fetchErrorDialog ||
      this.paymentErrorDialog ||
      this.updateErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** The About text. */
  get aboutText (): string {
    const aboutApp = import.meta.env.ABOUT_APP
    const aboutSbc = import.meta.env.ABOUT_SBC
    return `${aboutApp}<br>${aboutSbc}`
  }

  /** Get banner text. */
  get bannerText (): string {
    const bannerText: string = GetFeatureFlag('banner-text')
    // remove spaces so that " " becomes falsy
    return bannerText?.trim() || null
  }

  /** Whether user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Helper to check if the current route matches. */
  private isRouteName (routeName: RouteNames): boolean {
    return (this.$route.name === routeName)
  }

  /** Called when component is created. */
  async created (): Promise<void> {
    // update Current Js Date now and every 1 minute thereafter
    await this.updateCurrentJsDate()
    this.updateCurrentJsDateId = setInterval(this.updateCurrentJsDate, 60000)

    // add handler to prompt user if there are changes, before unloading this page
    window.onbeforeunload = (event: any) => {
      if (this.haveUnsavedChanges || this.isCorrectionEditing) {
        // cancel closing the page
        event.preventDefault()
        // pop up confirmation dialog
        // NB: custom text is not supported in all browsers
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // listen for save error events
    this.$root.$on('save-error-event', (error: any) => {
      // save errors/warnings
      this.saveErrors = error?.response?.data?.errors || []
      this.saveWarnings = error?.response?.data?.warnings || []

      if (error?.response?.status === StatusCodes.PAYMENT_REQUIRED) {
        if (!IsAuthorized(AuthorizedActions.STAFF_PAYMENT)) {
          // changes were saved if a 402 is received, so clear flag
          this.setHaveUnsavedChanges(false)
          this.paymentErrorDialog = true
        } else {
          if (error.response.data?.filing?.header?.filingId) {
            this.setFilingId(error.response.data?.filing?.header?.filingId)
          }
          this.staffPaymentErrorDialog = true
        }
      } else {
        console.log('Save error =', error) // eslint-disable-line no-console
        this.saveErrorDialog = true
      }
    })

    // listen for update error events
    this.$root.$on('update-error-event', (message: string) => {
      // save error
      this.saveErrors = [{ error: message }]

      console.log('Update error =', message) // eslint-disable-line no-console
      this.updateErrorDialog = true
    })

    // listen for invalid name request events
    this.$root.$on('invalid-name-request', (error: any) => {
      console.log('Name Request error =', error) // eslint-disable-line no-console
      this.nameRequestErrorType = error
      this.nameRequestErrorDialog = true
    })

    // listen for delete all events
    this.$root.$on('delete-all', () => {
      this.confirmDeleteAllDialog = true
    })

    // listen for go to dashboard events
    this.$root.$on('go-to-dashboard', (force = false) => {
      this.goToDashboard(force)
    })

    // init app
    this.onRouteChanged()
  }

  /** Fetches and stores the current JS date. */
  private async updateCurrentJsDate (): Promise<void> {
    const jsDate = await DateUtilities.getServerDate()
    this.setCurrentJsDate(jsDate)
  }

  /** Called before component is destroyed. */
  beforeDestroy (): void {
    // stop Update Current Js Date timer
    clearInterval(this.updateCurrentJsDateId)

    // stop listening for custom events
    this.$root.$off('save-error-event')
    this.$root.$off('update-error-event')
    this.$root.$off('invalid-name-request')
    this.$root.$off('delete-all')
    this.$root.$off('go-to-dashboard')
  }

  /** Navigates to current location, refreshing the page. */
  reload (): void {
    this.setHaveUnsavedChanges(false)
    this.$router.go(0)
  }

  /** Called when $route property changes. */
  @Watch('$route', { immediate: false })
  private async onRouteChanged (): Promise<void> {
    // init only if we are not on signin or signout route
    if (!this.isRouteName(RouteNames.SIGN_IN) && !this.isRouteName(RouteNames.SIGN_OUT)) {
      // store current filing type
      const filingType = this.$route.matched[0]?.meta.filingType
      filingType && this.setFilingType(filingType)

      // get and store Business ID
      const businessId = sessionStorage.getItem('BUSINESS_ID')
      this.setBusinessId(businessId)

      // initialize app
      await this.fetchData(true)
    }
  }

  /** Fetches app data. */
  private async fetchData (routeChanged = false): Promise<void> {
    // only fetch data on first route change
    if (routeChanged && this.haveData) return

    // reset errors in case of retry
    this.resetFlags()

    // set current date from "real time" date from server
    this.setCurrentDate(DateUtilities.dateToYyyyMmDd(this.getCurrentJsDate))

    // load user info
    try {
      await this.loadUserInfo()
    } catch (error) {
      console.log('User info error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // load account info
    // NOTE: this waits for CURRENT_ACCOUNT to be set
    try {
      await this.loadAccountInfo()
    } catch (error) {
      console.log('Account info error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // load auth roles
    try {
      this.loadAuthRoles()
    } catch (error) {
      console.log('Auth roles error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // update Launch Darkly with user info, account info and auth roles
    // NOTE: this allows targeted feature flags
    try {
      await this.updateLaunchDarkly()
    } catch (error) {
      // just log the error -- no need to halt app
      console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
    }

    // load org info
    try {
      await this.loadOrgInfo()
    } catch (error) {
      console.log('Org info error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // load authorized actions (aka permissions)
    // must be called after we have current account info
    try {
      await this.loadAuthorizedActions()
    } catch (error) {
      console.log('Authorized actions error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // now that we have org info and user info, load completing party
    // must be called after we have LD info since it checks a FF
    try {
      this.loadCompletingParty()
    } catch (error) {
      this.accountAuthorizationDialog = true
      console.log('Completing party error =', error) // eslint-disable-line no-console
      return
    }

    // since corrections are a single page, enable component validation right away
    // FUTURE: remove this when correction filings becomes 2 pages like the others
    if (this.isCorrectionFiling) {
      this.setComponentValidate(true)
      this.setAppValidate(true)
    }

    // finally, let router views know they can load their data
    this.appReady = true
  }

  /** Navigates to Manage Businesses dashboard. */
  goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    this.setHaveUnsavedChanges(false)
    // FUTURE: Manage Businesses URL should come from config
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    Navigate(manageBusinessUrl)
  }

  /** Called to navigate to Business Dashboard. */
  async goToDashboard (force = false): Promise<void> {
    const businessId = this.getBusinessId || sessionStorage.getItem('BUSINESS_ID')
    const dashboardUrl = sessionStorage.getItem('BUSINESS_DASH_URL') + businessId

    // check if there are no data changes
    if (!this.haveUnsavedChanges || force) {
      // navigate to dashboard
      this.setHaveUnsavedChanges(false)
      Navigate(dashboardUrl)
      return
    }

    // Prompt confirm dialog
    const hasConfirmed = await this.showConfirmDialog(
      this.$refs.confirm,
      'Unsaved Changes',
      'You have unsaved changes. Do you want to exit?',
      'Return to my Filing',
      'Exit Without Saving'
    )

    if (!hasConfirmed) {
      // if we get here, Cancel was clicked
      // ignore changes
      this.setHaveUnsavedChanges(false)
      // navigate to dashboard
      Navigate(dashboardUrl)
    }
  }

  async doDeleteAll (): Promise<void> {
    // Restore baseline data to original snapshot.
    this.parseEntitySnapshot()
    this.setHaveUnsavedChanges(false)
    if (this.isSummaryMode) {
      // just close the Delete All dialog
      this.confirmDeleteAllDialog = false
    } else {
      // redirect to entity dashboard
      this.goToDashboard()
    }
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.appReady = false
    this.haveData = false
    this.accountAuthorizationDialog = false
    this.fetchErrorDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.updateErrorDialog = false
    this.nameRequestErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.confirmDeleteAllDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Fetches and stores account info. */
  private async loadAccountInfo (): Promise<any> {
    const routeAccountId = +this.$route.query.accountid || 0
    const currentAccount = await loadCurrentAccount()

    if (!currentAccount) {
      throw new Error('Failed to load current account info')
    }

    this.setCurrentAccount(currentAccount)

    /**
     * Loads current account from object in session storage.
     * Waits up to 5 sec for current account to be synced (typically by SbcHeader).
     */
    async function loadCurrentAccount (): Promise<AccountInformationIF> {
      let account = null
      for (let i = 0; i < 50; i++) {
        const currentAccountJson = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
        account = JSON.parse(currentAccountJson)
        // if there's no route account id, check for account to be set
        if (!routeAccountId && account) break
        // check for current account id to match route account id
        if (account?.id === routeAccountId) break
        await Sleep(100)
      }
      return account
    }
  }

  /** Fetches and stores authorized actions (aka permissions). */
  private async loadAuthorizedActions (): Promise<void> {
    const authorizedActions = await LegalServices.fetchAuthorizedActions().catch(() => null)

    // verify we have _some_ authorized actions
    if (!Array.isArray(authorizedActions) || authorizedActions.length < 1) {
      throw new Error('Invalid or missing authorized actions')
    }

    this.setAuthorizedActions(authorizedActions)
  }

  /** Populates completing party object with user name and org mailing address. */
  private loadCompletingParty (): void {
    // set property as empty if authorized to leave blank
    if (IsAuthorized(AuthorizedActions.BLANK_COMPLETING_PARTY)) {
      this.setCompletingParty({
        firstName: '',
        lastName: '',
        mailingAddress: {
          addressCity: '',
          addressCountry: '',
          addressRegion: '',
          deliveryInstructions: '',
          postalCode: '',
          streetAddress: '',
          streetAddressAdditional: ''
        }
      })
      return
    }

    const mailingAddress = this.getOrgInfo.mailingAddress
    if (!mailingAddress && !GetFeatureFlag('allow-empty-account-mailing-address')) {
      throw new Error('Invalid mailing address')
    }

    this.setCompletingParty({
      firstName: this.getUserFirstname,
      lastName: this.getUserLastname,
      mailingAddress: {
        addressCity: (this.getOrgInfo.mailingAddress?.city ?? ''),
        addressCountry: (this.getOrgInfo.mailingAddress?.country ?? ''),
        addressRegion: (this.getOrgInfo.mailingAddress?.region ?? ''),
        deliveryInstructions: (this.getOrgInfo.mailingAddress?.deliveryInstructions ?? ''),
        postalCode: (this.getOrgInfo.mailingAddress?.postalCode ?? ''),
        streetAddress: (this.getOrgInfo.mailingAddress?.street ?? ''),
        streetAddressAdditional: (this.getOrgInfo.mailingAddress?.streetAdditional ?? '')
      }
    })
  }

  /** Loads auth roles. */
  private loadAuthRoles (): void {
    // get roles from KC token
    const authRoles = GetKeycloakRoles()

    // safety check
    if (!Array.isArray(authRoles)) {
      throw new Error('Invalid roles')
    }

    this.setAuthRoles(authRoles)
  }

  /**
   * Fetches and stores org info.
   * (We only need org info for mailing address currently.)
   */
  private async loadOrgInfo (): Promise<void> {
    const orgId = this.getCurrentAccount.id
    const orgInfo = await AuthServices.fetchOrgInfo(orgId).catch(() => null)

    if (!orgInfo) {
      throw new Error('Invalid org info')
    }

    this.setOrgInfo(orgInfo)
  }

  /**
   * Fetches and stores user info.
   * FUTURE: could maybe get this from KC token instead.
   */
  private async loadUserInfo (): Promise<any> {
    const userInfo = await AuthServices.fetchUserInfo().catch(() => null)

    if (!userInfo) {
      throw new Error('Invalid user info')
    }

    this.setUserInfo(userInfo)
  }

  /** Updates Launch Darkly with user and org info. */
  private async updateLaunchDarkly (): Promise<any> {
    // don't run when Vitest is running the code
    if (import.meta.env.VITEST) return

    const userContext = this.getUserInfo.keycloakGuid && {
      kind: 'user',
      key: this.getUserInfo.keycloakGuid,
      roles: this.getAuthRoles,
      appSource: import.meta.env.APP_NAME,
      loginSource: this.getUserInfo.loginSource,
      lastName: this.getUserLastname,
      firstName: this.getUserFirstname,
      // get email from contacts[0] if it exists (ie, for BCSC users)
      // else get email from root object
      email: this.getUserInfo.contacts[0]?.email || this.getUserInfo.email
    }

    const orgContext = this.getCurrentAccount.id && {
      kind: 'org',
      key: this.getCurrentAccount.id.toString(),
      type: this.getCurrentAccount.type,
      accountStatus: this.getCurrentAccount.accountStatus,
      accountType: this.getCurrentAccount.accountType,
      appSource: import.meta.env.APP_NAME,
      label: this.getCurrentAccount.label
    }

    await UpdateLdUser(userContext, orgContext)
  }
}
</script>

<style lang="scss" scoped>
// place app header on top of dialogs (and therefore still usable)
.app-header {
  z-index: 1000;
}
</style>
