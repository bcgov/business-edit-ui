<template>
  <div>
    <section class="mt-10">
      <header>
        <h1>Alteration</h1>
      </header>
      <!-- The Summary Components Below are just for a visual representation. Future Components TBD -->
      <SummaryDefineCompany/>
      <ListPeopleAndRoles :personList="getOrgPeople" :isSummary="true" />
      <ListShareClass :shareClasses="getShareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { featureFlags } from '@/utils'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes } from '@/enums'
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
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]

  // Global setters
  @Action setIgnoreChanges!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF

  /** The id of the IA filing to alter. */
  // private get filingId (): number {
  //   return +this.$route.query['filing-id']
  // }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Called when this component is mounted. */
  private async mounted (): Promise<void> {
    // do not proceed if we are not anthenticated
    // (this component will be re-mounted after authentication)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    if (!featureFlags.getFlag('alteration-ui-enabled')) {
      alert('Alterations are under contruction. Please check again later.')
      // redirect to the Manage Businesses dashboard
      const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
      window.location.assign(manageBusinessUrl)
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      alert('Only staff can alter a business.')
      // redirect to the Manage Businesses dashboard
      const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
      window.location.assign(manageBusinessUrl)
      return
    }

    // do not proceed if we don't have the necessary query params
    // if (isNaN(this.filingId)) {
    //   const err = 'Invalid filing ID'
    //   console.log(err) // eslint-disable-line no-console
    //   this.emitFetchError(err)
    //   return
    // }

    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // try to fetch data
    try {
      // fetch IA to alter
      const { filing } = await this.fetchFilingByType(this.INCORPORATION_APPLICATION)

      // parse IA filing into store
      this.parseIncorpApp(filing)

      // set current entity type
      this.setEntityType(EntityTypes.BCOMP)

      // initialize Fee Summary data
      this.emitFilingData([{
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: EntityTypes.BCOMP
      }])
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // resume tracking data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Emits Fetch Error event for App to handle. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void {}

  /** Emits new Filing Data to parent. */
  @Emit('filingData')
  private emitFilingData (filingData: FilingDataIF[]): void {}
}
</script>

<style lang="scss" scoped>
</style>
