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
      <!-- TODO: recognition date and time (as part of SummaryDefineCompany) -->
      <!-- TODO: folio number (as part of SummaryDefineCompany) -->
      <ListPeopleAndRoles :personList="getOrgPeople" :isSummary="true" />
      <ListShareClass :shareClasses="getShareClasses" :isSummary="true" />
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
import { Action, Getter } from 'vuex-class'
import { featureFlags } from '@/utils'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, GetterIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes } from '@/enums'
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
  // Resources for template
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource

  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getFilingDate!: string
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]

  /** The IA filing to correct. */
  private correctedFiling: any = null

  /** The id of the IA filing being corrected. */
  private get correctedId (): number {
    return +this.$route.query['corrected-id']
  }

  /** The id of the correction being edited. */
  private get correctionId (): number {
    return +this.$route.query['correction-id']
  }

  /** The filing date, in local timezone. */
  private get filingDateLocal (): string {
    return this.convertUtcTimeToLocalTime(this.getFilingDate)?.slice(0, 10)
  }

  /** Whether the user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Called when this component is mounted. */
  private async mounted (): Promise<void> {
    // do not proceed if FF is disabled
    if (!featureFlags.getFlag('correction-ui-enabled')) {
      alert('Corrections are under contruction. Please check again later.')
      return
    }

    // do not proceed if we are not anthenticated
    // (this component will be re-mounted after authentication)
    if (!this.isAuthenticated) return

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      alert('Only staff can correct an Incorporation Application.')
      // redirect to the Manage Businesses dashboard
      const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
      window.location.assign(manageBusinessUrl)
      return
    }

    // do not proceed if we don't have the necessary query params
    if (isNaN(this.correctedId) && isNaN(this.correctionId)) return

    if (this.correctionId) {
      // fetch draft correction to resume
      const correctionFiling = await this.fetchFilingById(this.correctionId)

      // fetch original IA to correct
      this.correctedFiling = await this.fetchFilingById(correctionFiling.correctedFilingId)

      // parse IA filing into store
      // this is the initial state of the correction filing
      this.parseIncorpApp(this.correctedFiling)

      // parse correction filing into store
      // this applies the diffs (corrections)
      this.parseCorrection(correctionFiling)
    }

    if (this.correctedId) {
      // fetch original IA to correct
      this.correctedFiling = await this.fetchFilingById(this.correctedId)
      console.log('*** corrected filing =', this.correctedFiling)

      // parse IA filing into store
      // this is the initial state of the correction filing
      this.parseIncorpApp(this.correctedFiling)
    }

    // TODO: move this here from App.vue?
    // initialize Fee Summary data
    // this.filingData = [{
    //   filingTypeCode: FilingCodes.CORRECTION,
    //   entityType: EntityTypes.BCOMP
    // }]
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
