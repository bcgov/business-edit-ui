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
    />

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
      :dialog="saveErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard()"
      @okay="saveErrorDialog = false"
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
      type="warning"
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
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { GetFeatureFlag, GetKeycloakRoles, Navigate, UpdateLdUser, Sleep } from '@/utils/'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import { Actions, EntityInfo } from '@/components/common/'
import { Breadcrumb as BreadcrumbShared } from '@bcrs-shared-components/breadcrumb/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import * as Views from '@/views/'
import * as Dialogs from '@/dialogs/'
import { AuthServices } from '@/services/'
import { CommonMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, ConfirmDialogType } from '@/interfaces/'
import { BreadcrumbIF, CompletingPartyIF } from '@bcrs-shared-components/interfaces/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { RouteNames } from '@/enums/'
import { getEntityDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb, getRegistryDashboardBreadcrumb,
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
  },
  mixins: [
    CommonMixin,
    FilingTemplateMixin
  ]
})
export default class App extends Vue {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCurrentJsDate!: Date
  @Getter(useStore) getFilingId!: number
  @Getter(useStore) getOrgInfo!: any
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) getUserPhone!: string
  @Getter(useStore) getUserRoles!: string
  @Getter(useStore) getUserUsername!: string
  @Getter(useStore) haveUnsavedChanges!: boolean
  @Getter(useStore) isBusySaving!: boolean
  @Getter(useStore) isCorrectionEditing!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSbcStaff!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Global actions
  @Action(useStore) setAccountInformation!: ActionBindingIF
  @Action(useStore) setAppValidate!: ActionBindingIF
  @Action(useStore) setAuthRoles!: ActionBindingIF
  @Action(useStore) setBusinessId!: ActionBindingIF
  @Action(useStore) setComponentValidate!: ActionBindingIF
  @Action(useStore) setCurrentDate!: ActionBindingIF
  @Action(useStore) setCurrentJsDate!: ActionBindingIF
  @Action(useStore) setHaveUnsavedChanges!: ActionBindingIF
  @Action(useStore) setIsFilingPaying!: ActionBindingIF
  @Action(useStore) setIsSaving!: ActionBindingIF
  @Action(useStore) setKeycloakRoles!: ActionBindingIF
  @Action(useStore) setUserInfo!: ActionBindingIF
  @Action(useStore) setOrgInfo!: ActionBindingIF
  @Action(useStore) setCompletingParty!: ActionBindingIF
  @Action(useStore) setSummaryMode!: ActionBindingIF
  @Action(useStore) setFilingType!: ActionBindingIF
  @Action(useStore) setFilingId!: ActionBindingIF

  // Local properties
  protected accountAuthorizationDialog = false
  protected confirmDeleteAllDialog = false
  protected fetchErrorDialog = false
  protected fileAndPayInvalidNameRequestDialog = false
  protected nameRequestErrorDialog = false
  protected nameRequestErrorType = ''
  protected paymentErrorDialog = false
  protected saveErrorDialog = false
  protected saveErrors: Array<object> = []
  protected saveWarnings: Array<object> = []
  protected staffPaymentErrorDialog = false

  // FUTURE: change appReady/haveData to a state machine?
  /** Whether the app is ready and the views can now load their data. */
  protected appReady = false

  /** Whether the views have loaded their data and the spinner can be hidden. */
  protected haveData = false

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

  /** The entity title. */
  get entityTitle (): string {
    switch (this.$route.name) {
      case RouteNames.ALTERATION: return 'Company Information'
      case RouteNames.CHANGE: return 'Business Information'
      case RouteNames.CONVERSION: return 'Record Conversion'
      case RouteNames.CORRECTION: return 'Register Correction'
      case RouteNames.RESTORATION_EXTENSION: return 'Limited Restoration Extension'
      case RouteNames.RESTORATION_CONVERSION: return 'Conversion to Full Restoration'
      case RouteNames.SPECIAL_RESOLUTION: return 'Special Resolution'
    }
    return 'Unknown Filing' // should never happen
  }

  /** The route breadcrumbs list. */
  get breadcrumbs (): Array<BreadcrumbIF> {
    const crumbs: Array<BreadcrumbIF> = [
      getEntityDashboardBreadcrumb(),
      {
        text: this.entityTitle,
        to: { name: this.$route.name }
      }
    ]

    // Set base crumbs based on user role
    // Staff don't want the home landing page and they can't access the Manage Business Dashboard
    if (this.isRoleStaff) {
      // If staff, set StaffDashboard as home crumb
      crumbs.unshift(getStaffDashboardBreadcrumb())
    } else {
      // For non-staff, set Home and Dashboard crumbs
      crumbs.unshift(getRegistryDashboardBreadcrumb(), getMyBusinessRegistryBreadcrumb())
    }

    return crumbs
  }

  /** True if an error dialog is displayed. */
  get isErrorDialog (): boolean {
    // NB: ignore nameRequestErrorDialog (to leave underlying components rendered)
    // NB: ignore confirmDeleteAllDialog (to leave underlying components rendered)
    // NB: ignore staffPaymentErrorDialog (to leave underlying components rendered)
    return (
      this.accountAuthorizationDialog ||
      this.fetchErrorDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** The About text. */
  get aboutText (): string {
    return process.env.ABOUT_TEXT
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

  /** Helper to check is the current route matches */
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
        if (!this.isRoleStaff) {
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
      this.saveErrorDialog = true
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
  protected reload (): void {
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

    // get and store keycloak roles
    try {
      const keycloakRoles = GetKeycloakRoles()
      this.setKeycloakRoles(keycloakRoles)
    } catch (error) {
      console.log('Keycloak error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // load account information
    try {
      await this.loadAccountInformation()
    } catch (error) {
      console.log('Account info error =', error) // eslint-disable-line no-console
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

    // load user info
    try {
      await this.loadUserInfo()
    } catch (error) {
      console.log('User info error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // now that we have user info and org info, populate the completing party
    // NB: these are all empty for staff
    const isStaff = this.isRoleStaff || this.isSbcStaff
    this.setCompletingParty({
      firstName: isStaff ? '' : this.getUserFirstName,
      lastName: isStaff ? '' : this.getUserLastName,
      mailingAddress: {
        addressCity: isStaff ? '' : this.getOrgInfo?.mailingAddress.city,
        addressCountry: isStaff ? '' : this.getOrgInfo?.mailingAddress.country,
        addressRegion: isStaff ? '' : this.getOrgInfo?.mailingAddress.region,
        postalCode: isStaff ? '' : this.getOrgInfo?.mailingAddress.postalCode,
        streetAddress: isStaff ? '' : this.getOrgInfo?.mailingAddress.street,
        streetAddressAdditional: isStaff ? '' : this.getOrgInfo?.mailingAddress.streetAdditional
      }
    } as CompletingPartyIF)

    // update Launch Darkly
    try {
      await this.updateLaunchDarkly()
    } catch (error) {
      // just log the error -- no need to halt app
      console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
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
  protected goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    this.setHaveUnsavedChanges(false)
    // FUTURE: Manage Businesses URL should come from config
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    Navigate(manageBusinessUrl)
  }

  /** Called to navigate to dashboard. */
  protected async goToDashboard (force = false): Promise<void> {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL') + this.getBusinessId

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

  protected async doDeleteAll (): Promise<void> {
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
    this.nameRequestErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.confirmDeleteAllDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Gets account and org information and stores it. */
  private async loadAccountInformation (): Promise<void> {
    // NB: staff don't have current account (but SBC Staff do)
    if (!this.isRoleStaff) {
      const currentAccount = await this.getCurrentAccount().catch(() => null)
      if (currentAccount) {
        this.setAccountInformation(currentAccount)
      } else {
        throw new Error('Invalid current account')
      }

      const orgInfo = await AuthServices.fetchOrgInfo(currentAccount?.id).catch(() => null)
      if (orgInfo) {
        this.setOrgInfo(orgInfo)
      } else {
        throw new Error('Invalid org info')
      }
    }
  }

  /** Fetches authorizations and verifies and stores roles. */
  private async loadAuth (): Promise<any> {
    // NB: will throw if API error
    const response = await AuthServices.fetchAuthorizations(this.getBusinessId)
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    const authRoles = response?.data?.roles
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Fetches current user info and stores it. */
  private async loadUserInfo (): Promise<any> {
    // NB: will throw if API error
    const response = await AuthServices.fetchUserInfo()
    const userInfo = response?.data
    if (userInfo) {
      this.setUserInfo(userInfo)
    } else {
      throw new Error('Invalid user info')
    }
  }

  /**
   * Gets current account from object in session storage.
   * Waits up to 10 sec for current account to be synced (typically by SbcHeader).
   */
  private async getCurrentAccount (): Promise<any> {
    let account: any
    for (let i = 0; i < 100; i++) {
      const currentAccount = sessionStorage.getItem(SessionStorageKeys.CurrentAccount) // may be null
      account = JSON.parse(currentAccount) // may be null
      if (account) break
      await Sleep(100)
    }
    return account
  }

  /** Updates Launch Darkly with user info. */
  private async updateLaunchDarkly (): Promise<any> {
    // since username is unique, use it as the user key
    const key = this.getUserUsername
    const email = this.getUserEmail
    const firstName = this.getUserFirstName
    const lastName = this.getUserLastName
    // remove leading { and trailing } and tokenize string
    const custom: any = { roles: this.getUserRoles?.slice(1, -1).split(',') }

    await UpdateLdUser(key, email, firstName, lastName, custom)
  }
}
</script>

<style lang="scss" scoped>
// place app header on top of dialogs (and therefore still usable)
.app-header {
  z-index: 1000;
}

.right-side {
  position: relative;
}
</style>
