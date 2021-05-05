<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <FileAndPayInvalidNameRequestDialog
      attach="#app"
      :dialog="fileAndPayInvalidNameRequestDialog"
      @okay="goToManageBusinessDashboard()"
    />

    <AccountAuthorizationDialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard()"
      @retry="initApp()"
    />

    <FetchErrorDialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard()"
      @retry="initApp()"
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

    <div class="app-body">
      <main v-if="!isErrorDialog">
        <EntityInfo />

        <v-container class="view-container my-8 py-0">
          <v-row>
            <v-col cols="9" class="left-side">
              <router-view
                :appReady=appReady
                :isSummaryMode="isSummaryMode"
                @profileReady="profileReady = true"
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
                <aside v-if="isCorrectionFiling">
                  <SbcFeeSummary
                    :filingData="[...getFilingData]"
                    :payURL="payApiUrl"
                  />
                </aside>

                <!-- Alterations use the enhanced Fee Summary shared component -->
                <v-expand-transition>
                  <FeeSummary v-if="isAlterationFiling"
                    :filingData="getFilingData"
                    :payApiUrl="payApiUrl"
                    :isLoading="isBusySaving"
                    :hasConflicts="isConflictingLegalType && hasNewNr"
                    :confirmLabel="feeSummaryConfirmLabel"
                    :errorMessage="feeSummaryError"
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
// Libraries
import { Component, Watch, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'
import { PAYMENT_REQUIRED } from 'http-status-codes'
import { getKeycloakRoles, updateLdUser } from '@/utils'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { FeeSummary } from '@bcrs-shared-components/fee-summary'
import { EntityInfo, Actions } from '@/components/common'
import * as Views from '@/views'
import * as Dialogs from '@/components/dialogs'

// Mixins, interfaces, etc
import { AuthApiMixin, CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ValidFlagsIF, ValidComponentsIF } from '@/interfaces'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { AlterationCompanyInfoFlags, AlterationReviewCertifyFlags, SummaryActions, RouteNames } from '@/enums'

@Component({
  components: {
    Actions,
    EntityInfo,
    FeeSummary,
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    ...Dialogs,
    ...Views
  }
})
export default class App extends Mixins(AuthApiMixin, CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Global getters
  @Getter getBusinessId!: string
  @Getter getUserEmail!: string
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserRoles!: string
  @Getter getUserUsername!: string
  @Getter getFilingData!: FilingDataIF
  @Getter haveUnsavedChanges!: boolean
  @Getter hasNewNr!: boolean
  @Getter isBusySaving!: boolean
  @Getter isEditing!: boolean
  @Getter isSummaryMode!: boolean
  @Getter getCurrentJsDate!: Date
  @Getter showFeeSummary!: boolean
  @Getter isCorrectionFiling!: boolean
  @Getter isAlterationFiling!: boolean

  // Alteration flag getters
  @Getter getAlterationValidFlags!: ValidFlagsIF
  @Getter getAppValidate!: boolean
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter getComponentValidate!: boolean
  @Getter isConflictingLegalType!: boolean
  @Getter getValidComponentFlags!: ValidComponentsIF

  // Global actions
  @Action setAccountInformation!: ActionBindingIF
  @Action setAppValidate!: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF
  @Action setBusinessId!: ActionBindingIF
  @Action setComponentValidate!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCurrentJsDate!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setIsSaving!: ActionBindingIF
  @Action setKeycloakRoles!: ActionBindingIF
  @Action setUserInfo: ActionBindingIF
  @Action setSummaryMode!: ActionBindingIF
  @Action setFilingType!: ActionBindingIF

  // Local properties
  private accountAuthorizationDialog = false
  private fetchErrorDialog = false
  private paymentErrorDialog = false
  private saveErrorDialog = false
  private nameRequestErrorDialog = false
  private nameRequestErrorType = ''
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []
  private fileAndPayInvalidNameRequestDialog = false
  private confirmDeleteAllDialog = false

  // FUTURE: change profileReady/appReady/haveData to a state machine?

  /** Whether the user profile is ready (ie, auth is loaded) and we can init the app. */
  private profileReady: boolean = false

  /** Whether the app is ready and the views can now load their data. */
  private appReady: boolean = false

  /** Whether the views have loaded their data and the spinner can be hidden. */
  private haveData: boolean = false

  /** Whether the token refresh service is initialized. */
  private tokenService: boolean = false

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

  /** The URL of the Pay API. */
  private get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    // NB: ignore nameRequestErrorDialog (to leave underlying components rendered)
    // NB: ignore confirmDeleteAllDialog (to leave underlying components rendered)
    return (
      this.accountAuthorizationDialog ||
      this.fetchErrorDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** The About text. */
  private get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  /** Whether user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The fee summary confirm button label. */
  private get feeSummaryConfirmLabel (): string {
    return (this.isSummaryMode ? 'File and Pay' : 'Review and Certify')
  }

  /** Error text to display in the Fee Summary component. */
  private get feeSummaryError (): string {
    let errorPrompt
    let errorMsg

    if (this.isSummaryMode) {
      errorPrompt = this.hasInvalidReviewSections
      errorMsg = '&lt; Please complete required information'
    } else {
      errorPrompt = this.hasInvalidSections
      errorMsg = '&lt; You have unfinished changes'
    }

    return errorPrompt ? errorMsg : ''
  }

  /** Check for any invalid component sections. */
  private get hasInvalidSections (): boolean {
    return this.getComponentValidate && Object.values(this.getValidComponentFlags).some(val => val === false)
  }

  /** Check for any invalid review sections. */
  private get hasInvalidReviewSections (): boolean {
    return this.getAppValidate && Object.values(this.getAlterationValidFlags).some(val => val === false)
  }

  /**
   * Called when component is created.
   * NB: User may not be authed yet.
   */
  private async created (): Promise<void> {
    // update Current Js Date now and every 1 minute thereafter
    await this.updateCurrentJsDate()
    this.updateCurrentJsDateId = setInterval(this.updateCurrentJsDate, 60000)

    // before unloading this page, if there are changes then prompt user
    window.onbeforeunload = (event: any) => {
      if (this.haveUnsavedChanges || this.isEditing) {
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

      if (error?.response?.status === PAYMENT_REQUIRED) {
        // changes were saved if a 402 is received, so clear flag
        this.setHaveUnsavedChanges(false)
        this.paymentErrorDialog = true
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
    this.$root.$on('go-to-dashboard', () => {
      this.goToDashboard()
    })

    // if we are already authenticated then go right to init
    // (since we won't get the event from Signin component)
    if (this.isAuthenticated) this.onProfileReady(true)
  }

  /** Fetches and stores the current JS date. */
  private async updateCurrentJsDate (): Promise<void> {
    const jsDate = await this.getServerDate()
    this.setCurrentJsDate(jsDate)
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop Update Current Js Date timer
    clearInterval(this.updateCurrentJsDateId)

    // stop listening for custom events
    this.$root.$off('save-error-event')
    this.$root.$off('update-error-event')
    this.$root.$off('invalid-name-request')
    this.$root.$off('delete-all')
    this.$root.$off('go-to-dashboard')
  }

  /** Called when profile is ready -- we can now init app. */
  @Watch('profileReady')
  private async onProfileReady (val: boolean): Promise<void> {
    //
    // do the one-time things here
    //

    if (val) {
      // store current filing type
      const filingType = this.$route.matched[0]?.meta.filingType
      filingType && this.setFilingType(filingType)

      // start KC token service
      await this.startTokenService()

      // get and store business ID
      const businessId = sessionStorage.getItem('BUSINESS_ID')
      this.setBusinessId(businessId)

      // load account information
      this.loadAccountInformation()

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

    // load user info
    try {
      await this.loadUserInfo()
    } catch (error) {
      console.log('User info error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      return
    }

    // update Launch Darkly
    try {
      await this.updateLaunchDarkly()
    } catch (error) {
      // just log the error -- no need to halt app
      console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
    }

    // fetch and store today's date
    // NB: keep this here to reload date on retry
    const currentDate = this.dateToDateString(this.getCurrentJsDate)
    this.setCurrentDate(currentDate)

    // finally, let router views know they can load their data
    this.appReady = true
  }

  /**
   * Handles actions from the fee summary component.
   * NOTE: This is only implemented for Alteration filings atm.
   * @param action the emitted action
   */
  private async handleFeeSummaryActions (action: SummaryActions): Promise<void> {
    switch (action) {
      case SummaryActions.SAVE_RESUME_LATER:
        // Save filing and return to dashboard.
        await this.onClickSave()
        this.goToDashboard()
        break
      case SummaryActions.DELETE_ALL:
        this.$root.$emit('delete-all')
        break
      case SummaryActions.CONFIRM:
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

  /** Redirects to Manage Businesses dashboard. */
  private goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    this.setHaveUnsavedChanges(false)
    // FUTURE: Manage Businesses URL should come from config
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
    window.location.assign(manageBusinessUrl)
  }

  /** Redirects to entity dashboard. */
  private goToDashboard (): void {
    // this.setHaveUnsavedChanges(false)
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.getBusinessId)
  }

  private async doDeleteAll (): Promise<void> {
    // Restore baseline data to original snapshot.
    this.parseBusinessSnapshot()
    this.setHaveUnsavedChanges(false)
    if (this.isSummaryMode) {
      // just close the Delete All dialog
      this.confirmDeleteAllDialog = false
    } else {
      // redirect to entity dashboard
      this.goToDashboard()
    }
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

  /** Fetches authorizations and verifies and stores roles. */
  private async loadAuth (): Promise<any> {
    // NB: will throw if API error
    const response = await this.fetchAuthorizations(this.getBusinessId)
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
    const response = await this.fetchCurrentUser()
    const userInfo = response?.data
    if (userInfo) {
      this.setUserInfo(userInfo)
    } else {
      throw new Error('Invalid user info')
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

  /** Updates Launch Darkly with user info. */
  private async updateLaunchDarkly (): Promise<any> {
    // since username is unique, use it as the user key
    const key: string = this.getUserUsername
    const email: string = this.getUserEmail
    const firstName: string = this.getUserFirstName
    const lastName: string = this.getUserLastName
    // remove leading { and trailing } and tokenize string
    const custom: any = { roles: this.getUserRoles?.slice(1, -1).split(',') }

    await updateLdUser(key, email, firstName, lastName, custom)
  }

  /** Perform high level component validations before proceeding to summary page. */
  private async validateCompanyInfoPage (): Promise<void> {
    this.setComponentValidate(true)

    // Evaluate valid flags. Scroll to invalid components or continue to review.
    if (await this.validateAndScroll(this.getValidComponentFlags, AlterationCompanyInfoFlags)) {
      this.setSummaryMode(true)

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

    // Evaluate valid flags. Scroll to invalid components or file alteration.
    if (await this.validateAndScroll(this.getAlterationValidFlags, AlterationReviewCertifyFlags)) {
      await this.onClickSave(false)
    }
  }

  /**
   * Will create/update a draft alteration or file and pay.
   * @returns a promise (ie, this is an async method).
   */
  private async onClickSave (isDraft: boolean = true): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSaving(true)

    let filingComplete: any
    try {
      const filing = await this.buildAlterationFiling(isDraft)

      // Update or file the alteration if we have a filingId or create a draft if not.
      filingComplete = this.getFilingId
        ? await this.updateFiling(filing, isDraft)
        : await this.createAlteration(filing, isDraft)

      // clear flag
      this.setHaveUnsavedChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSaving(false)
      return
    }

    // If filing is not a draft, proceed with payment
    if (!isDraft && filingComplete) {
      this.setIsFilingPaying(true)
      const paymentToken = filingComplete?.header?.paymentToken
      if (paymentToken) {
        const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
        const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')

        // if payment action is required, redirect to Pay URL
        if (isPaymentActionRequired) {
          const authUrl = sessionStorage.getItem('AUTH_URL')
          const returnUrl = encodeURIComponent(dashboardUrl + this.getBusinessId)
          const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + returnUrl
          // assume Pay URL is always reachable
          // otherwise user will have to retry payment later
          window.location.assign(payUrl)
        } else {
          // redirect to Dashboard URL
          window.location.assign(dashboardUrl + this.getBusinessId)
        }
      } else {
        const error = new Error('Missing Payment Token')
        this.$root.$emit('save-error-event', error)
      }
      this.setIsFilingPaying(false)
    }

    this.setIsSaving(false)
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
