<template>
  <section>
    <header>
      <h1>Correction - Incorporation Application</h1>
    </header>

    <section id="original-filing-date" class="mt-6">
      <p>
        <span id="original-filing-date-label">Original Filing Date:</span>
        {{ filingDateLocal }}
      </p>
    </section>

    <section id="benefit-company-statement" class="mt-6" v-if="isTypeBcomp">
      <p>
        <span id="benefit-company-statement-label">{{ BenefitCompanyStatementResource.title }}:</span>
        {{ BenefitCompanyStatementResource.description }}
      </p>
    </section>

    <your-company class="mt-10" />

    <people-and-roles class="mt-10" />

    <share-structure class="mt-10" />

    <agreement-type class="mt-10" />

    <completing-party class="mt-10" />

    <detail class="mt-10" />

    <certify-section class="mt-10" />

    <staff-payment class="mt-10" />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import { YourCompany } from '@/components/YourCompany'
import { PeopleAndRoles } from '@/components/PeopleAndRoles'
import { AgreementType } from '@/components/IncorporationAgreement'
import { CertifySection, CompletingParty, Detail, StaffPayment } from '@/components/common'
import { ShareStructure } from '@/components/ShareStructure'

// Mixins, Interfaces and Enums
import { CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BenefitCompanyStatementResource, CertifyStatementResource } from '@/resources'

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
export default class Correction extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Declaration for template
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource
  readonly CertifyStatementResource = CertifyStatementResource

  // Global getters
  @Getter getBusinessId!: string
  @Getter getFilingDate!: string
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getEntityType!: EntityTypes

  // Global setters
  @Action setCorrectedFilingId!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setOriginalIA!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  /** The id of the correction being edited. */
  private get correctionId (): number {
    return +this.$route.query['correction-id']
  }

  /** The filing date, in local timezone. */
  private get filingDateLocal (): string {
    return this.convertUtcTimeToLocalTime(this.getFilingDate)?.slice(0, 10)
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
    if (!this.isJestRunning && !getFeatureFlag('correction-ui-enabled')) {
      window.alert('Corrections are under contruction. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can correct an Incorporation Application.')
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
        filingTypeCode: FilingCodes.CORRECTION,
        entityType: EntityTypes.BENEFIT_COMPANY,
        priority: false
      })

      if (this.correctionId) {
        // store the filing ID
        this.setFilingId(this.correctionId)

        // fetch draft correction to resume
        const correctionFiling = await this.fetchFilingById(this.correctionId)

        // do not proceed if this isn't a CORRECTION filing
        if (!correctionFiling.correction) {
          throw new Error('Invalid Correction filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (correctionFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid Correction status')
        }

        // get and store ID of filing that is being corrected (ie, original IA)
        const correctedFilingId: number = +correctionFiling.correction?.correctedFilingId
        this.setCorrectedFilingId(correctedFilingId)

        // fetch and store original IA
        const originalIa = await this.fetchFilingById(correctedFilingId)
        this.setOriginalIA(originalIa)

        // parse correction filing into store
        this.parseCorrection(correctionFiling)
      } else {
        // as we don't have the necessary query params, do not proceed
        throw new Error('Invalid correction filing ID')
      }

      // Set the resources
      this.setCertifyStatementResource(
        CertifyStatementResource.find(x => x.entityType === this.getEntityType)
      )

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
#original-filing-date-label,
#benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
}
</style>
