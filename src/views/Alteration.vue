<template>
  <div>
    <section class="mt-10">
      <header>
        <h1>Alteration</h1>
      </header>
      <!-- The Summary Components Below are just for a visual representation. Future Components TBD -->
      <SummaryDefineCompany/>
      <ListPeopleAndRoles :personList="getPeopleAndRoles" :isSummary="true" />
      <ListShareClass :shareClasses="getShareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/PeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Alteration extends Mixins(LegalApiMixin, FilingTemplateMixin) {
  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]

  // Global setters
  @Action setHaveChanges!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  /** The id of the IA filing to alter. */
  // private get filingId (): number {
  //   return +this.$route.query['filing-id']
  // }

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
    if (!getFeatureFlag('alteration-ui-enabled')) {
      alert('Alterations are under contruction. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      alert('Only staff can alter a business.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if we don't have the necessary query params
    // if (isNaN(this.filingId)) {
    //   const err = 'Invalid filing ID'
    //   console.log(err) // eslint-disable-line no-console
    //   this.emitFetchError(err)
    //   return
    // }

    // try to fetch data
    try {
      // fetch IA to alter
      const { filing } = await this.fetchFilingByType(this.INCORPORATION_APPLICATION)

      // do not proceed if this isn't an IA filing
      if (!filing.incorporationApplication) {
        throw new Error('Invalid IA filing')
      }

      // do not proceed if this isn't a COMPLETED filing
      if (filing.header.status !== FilingStatus.COMPLETED) {
        throw new Error('Invalid IA status')
      }

      // parse IA filing into store
      this.parseAlteration(filing)

      // set current entity type
      this.setEntityType(EntityTypes.BCOMP)

      // initialize Fee Summary data
      this.emitFilingData([{
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: EntityTypes.BCOMP
      }])

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveChanges(false))
  }

  /** Redirects browser to Entity Dashboard. */
  private redirectEntityDashboard (): void {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.getBusinessId)
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}

  /** Emits new Filing Data. */
  @Emit('filingData')
  private emitFilingData (filingData: FilingDataIF[]): void {}
}
</script>

<style lang="scss" scoped>
</style>
