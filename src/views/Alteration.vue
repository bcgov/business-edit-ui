<template>
  <section>
    <header>
      <h1>Company Information</h1>
    </header>
    <section class="mt-6">
      <p>You are legally obligated to keep your company information up to date. Necessary fees will be applied as
        updates are made.</p>
    </section>

    <your-company class="mt-10" />

    <people-and-roles class="mt-10" />

    <share-structure class="mt-10" />

    <agreement-type class="mt-10" />

    <detail class="mt-10" />

    <certify-section class="mt-10" />

    <staff-payment class="mt-10" />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import { YourCompany } from '@/components/YourCompany'
import { AgreementType } from '@/components/IncorporationAgreement'
import { PeopleAndRoles } from '@/components/PeopleAndRoles'
import { CertifySection, CompletingParty, Detail, StaffPayment } from '@/components/common'
import { ShareStructure } from '@/components/ShareStructure'

// Mixins, Interfaces and Enums
import { CommonMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, BusinessSnapshotIF } from '@/interfaces'
import { BusinessDataTypes, EntityTypes, FilingCodes } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    AgreementType,
    CertifySection,
    CompletingParty,
    Detail,
    PeopleAndRoles,
    ShareStructure,
    StaffPayment,
    YourCompany
  }
})
export default class Alteration extends Mixins(CommonMixin, LegalApiMixin, FilingTemplateMixin) {
  // Global setters
  @Action setHaveChanges!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  /** The id of the alteration being edited. */
  private get alterationId (): number {
    return +this.$route.query['alteration-id']
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
      window.alert('Alterations are under contruction. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // try to fetch data
    try {
      // set current entity type
      this.setEntityType(EntityTypes.BENEFIT_COMPANY)

      // initialize Fee Summary data
      // TODO: Set/Clear Data according to filing type / entity type
      this.setFilingData({
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: EntityTypes.BENEFIT_COMPANY,
        priority: false
      })

      // TODO: Handle Returning from a DRAFT alteration filing
      // if (this.alterationId) {
      // store the filing ID
      // this.setFilingId(this.alterationId)

      // fetch draft alteration to resume
      // const alterationFiling = await this.fetchFilingById(this.alterationId)

      // // do not proceed if this isn't an ALTERATION filing
      // if (!alterationFiling.alteration) {
      //   throw new Error('Invalid Alteration filing')
      // }
      //
      // // do not proceed if this isn't a DRAFT filing
      // if (alterationFiling.header.status !== FilingStatus.DRAFT) {
      //   throw new Error('Invalid Alteration status')
      // }
      //
      // // parse alteration filing into store
      // this.parseAlteration(alterationFiling)
      // } else {
      //   // as we don't have the necessary query params, do not proceed
      //   throw new Error('Invalid alteration filing ID')
      // }

      const businessSnapshot = await this.fetchBusinessSnapshot()
      await this.parseBusinessSnapshot(businessSnapshot)

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
