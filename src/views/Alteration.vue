<template>
  <section>
    <!-- Profile View -->
    <template v-if="!isSummaryMode">
      <header>
        <h1>Company Information</h1>
      </header>

      <section class="mt-6">
        <p>You are legally obligated to keep your company information up to date. Necessary fees will be applied as
          updates are made.</p>
      </section>

      <your-company class="mt-10" />

      <current-directors class="mt-10" />

      <share-structure class="mt-10" />

      <agreement-type class="mt-10" />

      <detail class="mt-10" />

      <certify-section class="mt-10" />

      <staff-payment class="mt-10" />
    </template>

    <!-- Summary View -->
    <template v-else>
      <header>
        <h1>Review and Certify</h1>
      </header>
      <section class="mt-6">
        <p>Review and certify the changes you are about to make to your company. Certain changes require an Alteration
          Notice which will incur a $100.00 Fee.</p>
      </section>

      <!-- FUTURE: set `pleaseValidate` when user clicks File and Pay -->
      <alteration-summary class="mt-10" :pleaseValidate="true" />

      <no-fee-summary class="mt-10" />
    </template>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import { AlterationSummary, NoFeeSummary } from '@/components/Summary'
import { YourCompany } from '@/components/YourCompany'
import { AgreementType } from '@/components/IncorporationAgreement'
import { CurrentDirectors } from '@/components/PeopleAndRoles'
import { CertifySection, CompletingParty, Detail, StaffPayment } from '@/components/common'
import { ShareStructure } from '@/components/ShareStructure'

// Mixins, Interfaces and Enums
import { CommonMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, BusinessSnapshotIF } from '@/interfaces'
import { BusinessDataTypes, EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    AgreementType,
    AlterationSummary,
    CertifySection,
    CompletingParty,
    Detail,
    NoFeeSummary,
    CurrentDirectors,
    ShareStructure,
    StaffPayment,
    YourCompany
  }
})
export default class Alteration extends Mixins(CommonMixin, LegalApiMixin, FilingTemplateMixin) {
  // Global getters
  @Getter getEntityType!: EntityTypes
  @Getter isSummaryMode!: boolean

  // Alteration Flag Getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean

  // Global setters
  @Action setHaveChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setSummaryMode!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  /** The id of the alteration being edited. */
  private get alterationId (): number {
    return +this.$route.query['alteration-id'] || 0
  }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    // bypass this when Jest is running as FF are not fetched
    if (!this.isJestRunning && !getFeatureFlag('alteration-ui-enabled')) {
      window.alert('Alterations are not available at the moment. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // try to fetch data
    try {
      const businessSnapshot: BusinessSnapshotIF[] = await this.fetchBusinessSnapshot()

      if (this.alterationId) {
        // store the filing ID
        this.setFilingId(this.alterationId)

        // fetch draft alteration to resume
        const alterationFiling = await this.fetchFilingById(this.alterationId)

        // do not proceed if this isn't an ALTERATION filing
        if (!alterationFiling.alteration) {
          throw new Error('Invalid Alteration filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (alterationFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid Alteration status')
        }

        // parse alteration filing and original business snapshot into store
        await this.parseAlteration(alterationFiling, businessSnapshot)
      } else {
        // parse business data into store
        await this.parseBusinessSnapshot(businessSnapshot)
      }

      // initialize Fee Summary data
      this.setFilingData({
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: this.getEntityType,
        priority: false
      })

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveChanges(false))
  }

  /** Fetch Business Snapshot */
  private async fetchBusinessSnapshot (): Promise<BusinessSnapshotIF[]> {
    return Promise.all([
      this.getBusinessData(),
      this.getBusinessData(BusinessDataTypes.TRANSLATIONS),
      this.getBusinessData(BusinessDataTypes.ADDRESSES),
      this.getBusinessData(BusinessDataTypes.DIRECTORS),
      this.getBusinessData(BusinessDataTypes.SHARE_CLASSSES),
      this.getContactInfo()
    ])
  }

  /** Redirects browser to Entity Dashboard. */
  private redirectEntityDashboard (): void {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.getBusinessId)
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void { }
}
</script>

<style lang="scss" scoped>
</style>
