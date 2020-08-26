<template>
  <div>
    <section>
      <header class="mt-4">
        <h1>Correction - Incorporation Application</h1>
      </header>

      <div class="original-filing-date mt-6" v-if="isTypeBcomp">
        <p>
          <span class="original-filing-date-label">Original Filing Date:</span>
          {{ filingDateLocal }}
        </p>
      </div>

      <div class="benefit-company-statement mt-6" v-if="isTypeBcomp">
        <p>
          <span class="benefit-company-statement-label">{{ BenefitCompanyStatementResource.title }}:</span>
          {{ BenefitCompanyStatementResource.description }}
        </p>
      </div>

      <SummaryDefineCompany :isSummary="true" />
      <!-- TODO: recognition date and time (as part of Your Company) -->
      <!-- TODO: folio number (as part of Your Company) -->
      <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" />
      <ListShareClass :shareClasses="shareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
      <!-- TODO: original completing party -->
      <!-- TODO: 1. detail -->
      <!-- TODO: 2. certify -->
      <!-- TODO: 3. staff payment -->
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
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { GetterIF, OrgPersonIF, ShareClassIF, StateModelIF } from '@/interfaces'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

// Resources
import { BenefitCompanyStatementResource } from '@/resources'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Correction extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Resources
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource

  // Getter definition for static type checking.
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getFilingDate!: string

  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  private get filingDateLocal (): string {
    return this.convertUtcTimeToLocalTime(this.getFilingDate)?.slice(0, 10)
  }

  private mounted (): void {
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
.original-filing-date-label,
.benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
}
</style>
