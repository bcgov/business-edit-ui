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
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

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
  @Action setEntityType!: ActionBindingIF

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Called when this component is created. */
  private created (): void {
    this.setEntityType(EntityTypes.BCOMP)
  }

  /** Called when this component is mounted. */
  private mounted (): void {
    if (!this.isAuthenticated) return

    // If a user (not staff) tries this url directly, return them to the Manage Businesses dashboard.
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
      window.location.assign(manageBusinessUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
