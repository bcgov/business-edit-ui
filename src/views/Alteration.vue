<template>
  <section>
    <header>
      <h1>Alteration</h1>
    </header>

    <!-- The Summary Components Below are just for a visual representation. Future Components TBD -->
    <summary-define-company
       class="mt-10"
    />
    <list-people-and-roles
      class="mt-10"
      :personList="getPeopleAndRoles"
      :isSummary="true"
    />

    <share-structure class="mt-10" />

    <agreement-type
      class="mt-10"
      :isSummary="true"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import { SummaryDefineCompany } from '@/components/YourCompany'
import { ListPeopleAndRoles } from '@/components/PeopleAndRoles'
import { AgreementType } from '@/components/IncorporationAgreement'
import { ShareStructure } from '@/components/ShareStructure'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    AgreementType,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    ShareStructure
  }
})
export default class Alteration extends Mixins(LegalApiMixin, FilingTemplateMixin) {
  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter getPeopleAndRoles!: OrgPersonIF[]

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

    // try to fetch data
    try {
      // set current entity type
      this.setEntityType(EntityTypes.BCOMP)

      // initialize Fee Summary data
      // TODO: Set/Clear Data according to filing type / entity type
      this.setFilingData({
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: EntityTypes.BCOMP,
        priority: false
      })

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

        // parse alteration filing into store
        this.parseAlteration(alterationFiling)
      } else {
        // as we don't have the necessary query params, do not proceed
        throw new Error('Invalid alteration filing ID')
      }

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
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void { }
}
</script>

<style lang="scss" scoped>
</style>
