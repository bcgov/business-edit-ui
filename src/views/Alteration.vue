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
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { featureFlags } from '@/utils'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes } from '@/enums'
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
    // do not proceed if FF is disabled
    if (!featureFlags.getFlag('alteration-ui-enabled')) {
      alert('Alterations are under contruction. Please check again later.')
      return
    }

    // do not proceed if we are not anthenticated
    // (this component will be re-mounted after authentication)
    if (!this.isAuthenticated) return

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
    // if (isNaN(this.filingId)) return

    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // fetch IA to alter
    const { filing } = await this.fetchFilingByType(this.INCORPORATION_APPLICATION)

    // parse IA filing into store
    this.parseIncorpApp(filing)

    // TODO: move this here from App.vue?
    // initialize Fee Summary data
    // this.filingData = [{
    //   filingTypeCode: FilingCodes.CORRECTION,
    //   entityType: EntityTypes.BCOMP
    // }]

    // resume tracking data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
