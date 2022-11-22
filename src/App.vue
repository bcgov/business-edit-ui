<template>
  <v-app class="app-container" id="app">
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
      <div class="loading-container" v-show="!haveData && !isErrorDialog">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading</div>
        </div>
      </div>
    </transition>

    <SbcHeader />
    <PaySystemAlert />

    <div class="app-body">
      <main v-if="!isErrorDialog">
        <BreadcrumbShared :breadcrumbs="breadcrumbs" />
        <EntityInfo />

        <v-container class="view-container my-8 py-0">
          <v-row>
            <v-col cols="9" class="left-side">
              <router-view
                :appReady=appReady
                :isSummaryMode="isSummaryMode"
                @fetchError="fetchErrorDialog = true"
                @haveData="haveData = true"
              />
            </v-col>

            <v-col cols="3" class="right-side">
              <affix v-if="showFeeSummary"
                relative-element-selector=".left-side"
                :offset="{ top: 86, bottom: 12 }"
              >
                <!-- Corrections still use the basic Fee Summary component -->
                <aside v-if="isCorrectionFiling && correctionHasFilingData">
                  <SbcFeeSummary
                    :filingData="[...getFilingData]"
                    :payURL="payApiUrl"
                  />
                </aside>

                <!-- Alteration/Change/Conversion filings use the enhanced Fee Summary shared component -->
                <v-expand-transition>
                  <FeeSummaryShared
                    v-if="showFeesummaryShared"
                    :filingData="getFilingData"
                    :payApiUrl="payApiUrl"
                    :isLoading="isBusySaving"
                    :hasConflicts="isConflictingLegalType && getNameRequestNumber"
                    :confirmLabel="feeSummaryConfirmLabel"
                    :errorMessage="feeSummaryError"
                    :isSummaryMode="isSummaryMode"
                    @action="handleFeeSummaryActions($event)"
                  />
                </v-expand-transition>
              </affix>
            </v-col>
          </v-row>
        </v-container>

        <!-- Actions component is for Corrections only -->
        <Actions
          v-if="isCorrectionFiling"
          :key="$route.path"
        />
      </main>
    </div>

    <SbcFooter :aboutText=aboutText />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { StatusCodes } from 'http-status-codes'
import { GetKeycloakRoles, Navigate, UpdateLdUser, Sleep } from '@/utils/'
import PaySystemAlert from 'sbc-common-components/src/components/PaySystemAlert.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { FeeSummary as FeeSummaryShared } from '@bcrs-shared-components/fee-summary/'
import { Actions, EntityInfo } from '@/components/common/'
import { Breadcrumb as BreadcrumbShared } from '@bcrs-shared-components/breadcrumb/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import * as Views from '@/views/'
import * as Dialogs from '@/dialogs/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, DateMixin, FilingTemplateMixin } from '@/mixins/'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType, FlagsReviewCertifyIF, FlagsCompanyInfoIF,
  AlterationFilingIF, ChgRegistrationFilingIF, ConversionFilingIF, SpecialResolutionFilingIF }
  from '@/interfaces/'
import { BreadcrumbIF, CompletingPartyIF } from '@bcrs-shared-components/interfaces/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { ComponentsCompanyInfo, ComponentsReviewCertify, RouteNames } from '@/enums/'
import { FeeSummaryActions } from '@bcrs-shared-components/enums/'
import { getEntityDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb, getRegistryDashboardBreadcrumb,
  getStaffDashboardBreadcrumb } from '@/resources/BreadCrumbResources'

@Component({
  components: {
    Actions,
    BreadcrumbShared,
    ConfirmDialogShared,
    EntityInfo,
    FeeSummaryShared,
    PaySystemAlert,
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    ...Dialogs,
    ...Views
  }
})
export default class App extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global getters
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserRoles!: string
  @Getter getUserUsername!: string
  @Getter getOrgInfo!: any
  @Getter getFilingData!: FilingDataIF[]
  @Getter haveUnsavedChanges!: boolean
  @Getter isBusySaving!: boolean
  @Getter isCorrectionEditing!: boolean
  @Getter isSummaryMode!: boolean
  @Getter showFeeSummary!: boolean
  @Getter getCurrentJsDate!: Date
  @Getter getFilingId!: number

  // Alteration flag getters
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter getAppValidate!: boolean
  @Getter getComponentValidate!: boolean
  @Getter isConflictingLegalType!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isSbcStaff!: boolean

  // Global actions
  @Action setAccountInformation!: ActionBindingIF
  @Action setAppValidate!: ActionBindingIF
  @Action setAuthRoles!: ActionBindingIF
  @Action setBusinessId!: ActionBindingIF
  @Action setComponentValidate!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCurrentJsDate!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setIsSaving!: ActionBindingIF
  @Action setKeycloakRoles!: ActionBindingIF
  @Action setUserInfo!: ActionBindingIF
  @Action setOrgInfo!: ActionBindingIF
  @Action setCompletingParty!: ActionBindingIF
  @Action setSummaryMode!: ActionBindingIF
  @Action setFilingType!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF

  // Local properties
  protected accountAuthorizationDialog = false
  protected fetchErrorDialog = false
  protected paymentErrorDialog = false
  protected staffPaymentErrorDialog = false
  protected saveErrorDialog = false
  protected nameRequestErrorDialog = false
  protected nameRequestErrorType = ''
  protected saveErrors: Array<object> = []
  protected saveWarnings: Array<object> = []
  protected fileAndPayInvalidNameRequestDialog = false
  protected confirmDeleteAllDialog = false

  // FUTURE: change appReady/haveData to a state machine?
  /** Whether the app is ready and the views can now load their data. */
  protected appReady = false

  /** Whether the views have loaded their data and the spinner can be hidden. */
  protected haveData = false

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

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

  /** The URL of the Pay API. */
  get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
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

  /** Whether user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The fee summary confirm button label. */
  get feeSummaryConfirmLabel (): string {
    const isNoFee = this.isFirmChangeFiling || this.isFirmConversionFiling
    if (this.isSummaryMode) {
      return (isNoFee && !this.getFilingData.some(fd => fd.priority)) ? 'File Now (No Fee)' : 'File and Pay'
    } else {
      return isNoFee ? 'Review and Confirm' : 'Review and Certify'
    }
  }

  /** Error text to display in the Fee Summary component. */
  get feeSummaryError (): string {
    if (this.isSummaryMode) {
      return this.hasInvalidReviewSections ? '&lt; Please complete required information' : ''
    } else {
      return this.hasInvalidSections ? '&lt; You have unfinished changes' : ''
    }
  }

  /** True is there are any invalid component sections. */
  get hasInvalidSections (): boolean {
    return (
      this.getComponentValidate &&
      Object.values(this.getFlagsCompanyInfo).some(val => val === false)
    )
  }

  /** True if there are any invalid review sections. */
  get hasInvalidReviewSections (): boolean {
    return (
      this.getAppValidate &&
      Object.values(this.getFlagsReviewCertify).some(val => val === false)
    )
  }
  /** Show fee summary only allowed filing types */
  get showFeesummaryShared (): boolean {
    return (
      this.isSpecialResolutionFiling ||
      this.isAlterationFiling ||
      this.isFirmChangeFiling ||
      this.isFirmConversionFiling
    )
  }

  /** True if there is filing data for corrections - corrections has a single filing schedule. */
  get correctionHasFilingData () : boolean {
    return Boolean(
      this.getFilingData?.length > 0 &&
      this.getFilingData[0].filingTypeCode &&
      this.getFilingData[0].entityType
    )
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
    const jsDate = await this.getServerDate()
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
    this.setCurrentDate(this.dateToYyyyMmDd(this.getCurrentJsDate))

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
    console.log('isRoleStaff', this.isRoleStaff)
    console.log('getOrgInfo', this.getOrgInfo)
    this.setCompletingParty({
      firstName: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getUserFirstName,
      lastName: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getUserLastName,
      mailingAddress: {
        addressCity: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.city,
        addressCountry: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.country,
        addressRegion: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.region,
        postalCode: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.postalCode,
        streetAddress: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.street,
        streetAddressAdditional: (this.isRoleStaff || this.isSbcStaff) ? '' : this.getOrgInfo?.mailingAddress.streetAdditional
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

  /**
   * Handles actions from the fee summary component.
   * NOTE: This is only implemented for Alteration filings atm.
   * @param action the emitted action
   */
  protected async handleFeeSummaryActions (action: FeeSummaryActions): Promise<void> {
    switch (action) {
      case FeeSummaryActions.BACK:
        this.setSummaryMode(false)
        await this.scrollToTop(document.getElementById('app'))
        break
      case FeeSummaryActions.SAVE_RESUME_LATER:
        // Save filing and return to dashboard.
        await this.onClickSave()
        this.goToDashboard()
        break
      case FeeSummaryActions.CANCEL:
        this.goToDashboard()
        break
      case FeeSummaryActions.CONFIRM:
        if (this.isSummaryMode) {
          // Check validity, and if OK then save and file.
          await this.validateReviewCertifyPage()
        } else {
          // Check validity, and if OK then go to summary page.
          await this.validateCompanyInfoPage()
        }
        break
    }
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
  private async goToDashboard (force = false): Promise<void> {
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

  /** Perform high level component validations before proceeding to summary page. */
  private async validateCompanyInfoPage (): Promise<void> {
    this.setComponentValidate(true)

    // Evaluate valid flags. Scroll to invalid components or continue to review.
    if (await this.validateAndScroll(this.getFlagsCompanyInfo, ComponentsCompanyInfo)) {
      // show summary page
      this.setSummaryMode(true)

      // reset validate flag
      this.setAppValidate(false)

      // Reset global flag
      this.setComponentValidate(false)

      // We don't change views, just interchange components, so scroll to top for better UX.
      await this.scrollToTop(document.getElementById('app'))
    }
  }

  /** Perform high level component validations before proceeding to filing and paying. */
  private async validateReviewCertifyPage (): Promise<void> {
    // Prompt app validations.
    this.setAppValidate(true)

    // Wait to allow app validation.
    await Vue.nextTick()

    // Evaluate valid flags. Scroll to invalid components or file alteration.
    if (await this.validateAndScroll(this.getFlagsReviewCertify, ComponentsReviewCertify)) {
      await this.onClickSave(false)
    }
  }

  /**
   * Will create/update a draft alteration or file and pay.
   * @returns a promise (ie, this is an async method).
   */
  private async onClickSave (isDraft = true): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSaving(true)

    let filingComplete: any
    try {
      let filing: AlterationFilingIF | ChgRegistrationFilingIF | ConversionFilingIF | SpecialResolutionFilingIF
      if (this.isAlterationFiling) filing = this.buildAlterationFiling(isDraft)
      if (this.isFirmChangeFiling) filing = this.buildChangeRegFiling(isDraft)
      if (this.isFirmConversionFiling) filing = this.buildConversionFiling(isDraft)
      if (this.isSpecialResolutionFiling) filing = this.buildSpecialResolutionFiling(isDraft)

      // update the filing if we have a filingId, otherwise create a draft
      filingComplete = this.getFilingId
        ? await LegalServices.updateFiling(this.getBusinessId, this.getFilingId, filing, isDraft)
        : await LegalServices.createFiling(this.getBusinessId, filing, isDraft)

      // clear flag
      this.setHaveUnsavedChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSaving(false)
      return
    }

    // if filing is not a draft, proceed with payment
    if (!isDraft && filingComplete) {
      // If Saving or Filing is successful then setIsFilingPaying should't be reset to false,
      // this prevent buttons from being re-enabled if the page is slow to redirect.
      this.setIsFilingPaying(true)
      const paymentToken = filingComplete.header?.paymentToken
      const filingId = filingComplete.header?.filingId

      if (paymentToken && filingId) {
        const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
        const returnUrl = sessionStorage.getItem('DASHBOARD_URL') + this.getBusinessId +
          `?filing_id=${filingId}`

        // if payment action is required, navigate to Pay URL
        if (isPaymentActionRequired) {
          const authUrl = sessionStorage.getItem('AUTH_WEB_URL')
          const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + encodeURIComponent(returnUrl)
          // assume Pay URL is always reachable
          // otherwise user will have to retry payment later
          Navigate(payUrl)
        } else {
          // otherwise go straight to dashboard
          Navigate(returnUrl)
        }
      } else {
        const error = new Error('Missing Payment Token or Filing ID')
        this.$root.$emit('save-error-event', error)
      }
    }
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
