<template>
  <section class="pb-10" id="change-view">
    <!-- Business Information page-->
    <v-slide-x-transition hide-on-leave>
      <div v-if="!isSummaryMode">
        <header>
          <h1>Business Information</h1>
        </header>

        <section class="mt-6">
          You must promptly file updates to your business information. Necessary fees will be applied as updates are
          made.
        </section>

        <YourCompany class="mt-10" />
      </div>
    </v-slide-x-transition>

    <!-- Review and Certify page -->
    <v-slide-x-reverse-transition hide-on-leave>
      <div v-if="isSummaryMode && showFeeSummary">
        <header>
          <h1>Review and Confirm</h1>
        </header>

        <section class="mt-6">
          <p id="intro-text">
            Changes were made to your business information that require a filing. Review and certify the changes you are
            about the make to your business.
          </p>
        </section>

        <ChangeSummary
          class="mt-10"
          :validate="getAppValidate"
        />

        <CertifySection
          class="mt-10"
          :sectionNumber="showTransactionalFolioNumber ? '3.' : '2.'"
          :validate="getAppValidate"
        />

      </div>
    </v-slide-x-reverse-transition>

    <!-- Done-->
    <v-fade-transition>
      <div v-if="isSummaryMode && !showFeeSummary">
        <header>
          <h1>Review and Certify</h1>
        </header>

        <section class="mt-6">
          You have deleted all fee-based changes and your company information has reverted to its
          original state. If you made any non-fee changes such as updates to your Registered
          Office Contact Information, please note that these changes have already been saved.
        </section>

        <v-btn
          large
          color="primary"
          id="done-button"
          class="mt-8"
          @click="$root.$emit('go-to-dashboard')"
        >
          <span>Done</span>
        </v-btn>
      </div>
    </v-fade-transition>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import {
  ChangeSummary,
  DocumentsDelivery,
  TransactionalFolioNumber
} from '@/components/Edit'
import {
  CertifySection,
  StaffPayment,
  YourCompany
} from '@/components/common'
import {
  AuthApiMixin,
  CommonMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  PayApiMixin
} from '@/mixins'
import {
  ActionBindingIF,
  EffectiveDateTimeIF,
  EntitySnapshotIF,
  FilingDataIF,
  FeesIF,
  EmptyFees,
  StaffPaymentIF
} from '@/interfaces'
import { CorpTypeCd, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { cloneDeep } from 'lodash'
import { ChangeFirmResources } from '@/resources'

@Component({
  components: {
    CertifySection,
    ChangeSummary,
    DocumentsDelivery,
    StaffPayment,
    TransactionalFolioNumber,
    YourCompany
  }
})
export default class Change extends Mixins(
  AuthApiMixin,
  CommonMixin,
  LegalApiMixin,
  FilingTemplateMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getEntityType!: CorpTypeCd
  @Getter isSummaryMode!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getFilingData!: FilingDataIF
  @Getter getAppValidate!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean
  @Getter showFeeSummary!: boolean
  @Getter getFeePrices!: FeesIF

  // Global actions
  @Action setFileNumber!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setValidCourtOrder!: ActionBindingIF
  @Action setCurrentFees!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** Whether to show the Transactional Folio Number section. */
  private get showTransactionalFolioNumber (): boolean {
    return (this.isPremiumAccount && !this.isRoleStaff)
  }

  /** The id of the change filing being edited. */
  private get changeId (): number {
    return +this.$route.query['change-id'] || 0
  }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  private get filingFeesPrice (): string {
    if (this.getFeePrices.filingFees !== null) {
      return `$${this.getFeePrices.filingFees.toFixed(2)}`
    }
    return ''
  }

  /** The entity specific resource file for a change filing. */
  private get changeFirmResources (): any {
    return ChangeFirmResources.find(x => x.entityType === this.getEntityType)
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    // bypass this when Jest is running as FF are not fetched
    if (!this.isJestRunning && !getFeatureFlag('change-ui-enabled')) {
      window.alert('Change filings are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard')
      return
    }

    // try to fetch data
    try {
      const firmSnapshot = await this.fetchFirmSnapshot()

      if (this.changeId) {
        // store the filing ID
        this.setFilingId(this.changeId)

        // fetch draft change filing to resume
        const changeFiling = await this.fetchFilingById(this.changeId)

        // do not proceed if this isn't a Change filing
        if (!changeFiling.changeOfRegistration) {
          throw new Error('Invalid Change filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (changeFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid Change status')
        }

        // parse change filing and original business snapshot into store
        await this.parseChangeFirm(changeFiling, firmSnapshot)
      } else {
        // parse business data into store
        await this.parseEntitySnapshot(firmSnapshot)
      }

      if (this.changeFirmResources) {
        // Set the resources
        this.setResource(this.changeFirmResources)

        // initialize Fee Summary data
        this.setFilingData(this.changeFirmResources.filingData)
      } else {
        // go to catch()
        throw new Error(`Invalid Change resources entity type = ${this.getEntityType}`)
      }

      // update the current fees for the Filing
      this.setCurrentFees(
        await this.fetchFilingFees(
          FilingCodes.CHANGE_OF_REGISTRATION, this.getEntityType
        ).catch(() => cloneDeep(EmptyFees))
      )

      // fetches the fee prices to display in the text
      this.setFeePrices(
        await this.fetchFilingFees(FilingCodes.CHANGE_OF_REGISTRATION, this.getEntityType
        ).catch(() => cloneDeep(EmptyFees))
      )

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the business snapshot. */
  private async fetchFirmSnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      this.fetchBusinessInfo(),
      this.fetchAuthInfo(),
      this.fetchAddresses(),
      this.fetchOrgPersons()
    ])

    if (items.length !== 4) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      businessAddress: items[2],
      orgPersons: items[3]
    }
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: boolean = true): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#done-button {
  width: 10rem;
}
</style>
