<template>
  <div>
    <section class="mt-10">
      <header>
        <h1>Correction - Incorporation Application</h1>
      </header>
      <!-- The Summary Components Below are just for a visual representation. Future Components TBD -->
      <SummaryDefineCompany/>
      <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" />
      <ListShareClass :shareClasses="shareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { OrgPersonIF, ShareClassIF, StateModelIF } from '@/interfaces'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Correction extends Mixins(LegalApiMixin, FilingTemplateMixin) {
  // Getter definition for static type checking.
  @Getter isRoleStaff!: boolean

  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  private mounted (): void {
    console.log('*** Correction view is mounted') // eslint-disable-line no-console
    if (!this.isAuthenticated) return

    // If a user (not staff) tries this url directly, return them to the Manage Businesses dashboard.
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
      window.location.assign(manageBusinessUrl)
    }
  }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }
}
</script>

<style lang="scss" scoped>
</style>
