<template>
  <section>
    <header>
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

    <!-- TODO: replace haveChanges event with global state -->
    <your-company
      class="mt-10"
      :isSummary="true"
      @haveChanges="yourCompanyChanges = $event"
    />

    <people-and-roles
      class="mt-10"
    />

    <!-- TODO: replace haveChanges event with global state -->
    <list-share-class
      class="mt-10"
      :isSummary="true"
      :shareClasses="getShareClasses"
      @haveChanges="shareStructChanges = $event"
    />

    <!-- TODO: replace haveChanges event with global state -->
    <agreement-type
      class="mt-10"
      :isSummary="true"
      @haveChanges="incorpAgrmtChanges = $event"
    />

    <completing-party
      class="mt-10"
    />

    <!-- TODO: replace emitValid event with global state -->
    <detail
      class="mt-10"
      @emitValid="detailValid = $event"
    />

    <!-- TODO: replace emitValid event with global state -->
    <certify
      class="mt-10"
      @emitValid="certifyValid = $event"
    />

    <!-- TODO: replace emitValid event with global state -->
    <!-- TODO: replace haveChanges event with global state -->
    <staff-payment
      class="mt-10"
      @emitValid="staffPaymntValid = $event"
      @haveChanges="staffPaymentChanges = $event"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
import { getFeatureFlag } from '@/utils'

// Components
import { YourCompany } from '@/components/DefineCompany'
import { PeopleAndRoles } from '@/components/PeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'
import { Certify, CompletingParty, Detail, StaffPayment } from '@/components/common'

// Mixins, Interfaces and Enums
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

// Resources
import { BenefitCompanyStatementResource } from '@/resources'

@Component({
  components: {
    AgreementType,
    Certify,
    CompletingParty,
    Detail,
    PeopleAndRoles,
    ListShareClass,
    StaffPayment,
    YourCompany
  }
})
export default class Correction extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Resources for template
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource

  // Global getters
  @Getter getBusinessId!: string
  @Getter getFilingDate!: string
  @Getter getShareClasses!: ShareClassIF[]
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean

  // Global setters
  @Action setCorrectedFilingId!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setOriginalIA!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  // whether components have changes
  // TODO: delete these and use store instead
  private incorpAgrmtChanges = false
  private shareStructChanges = false
  private yourCompanyChanges = false
  private staffPaymentChanges = false

  // whether components are valid
  // TODO: delete these and use store instead
  private certifyValid = false
  private detailValid = false
  private staffPaymntValid = false

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

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    if (!getFeatureFlag('correction-ui-enabled')) {
      alert('Corrections are under contruction. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      alert('Only staff can correct an Incorporation Application.')
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
        filingTypeCode: FilingCodes.CORRECTION,
        entityType: EntityTypes.BCOMP,
        priority: false
      })

      if (this.correctionId) { // Resuming a DRAFT incorporation Correction
        // Set the filing Id to store
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
        const correctedFilingId = correctionFiling.correction?.correctedFilingId
        this.setCorrectedFilingId(correctedFilingId)

        // fetch and store original IA
        const originalIa = await this.fetchFilingById(correctedFilingId)
        this.setOriginalIA(originalIa)

        // parse correction filing into store
        this.parseCorrection(correctionFiling)
      } else {
        // as we don't have the necessary query params, do not proceed
        throw new Error('Invalid corrected or correction filing ID')
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

  // watchers for component change flags
  // TODO: delete these and use store instead
  @Watch('incorpAgrmtChanges') private onIncorpAgrmtChanges (): void { this.emitHaveChanges() }
  @Watch('shareStructChanges') private onShareStructChanges (): void { this.emitHaveChanges() }
  @Watch('yourCompanyChanges') private onYourCompanyChanges (): void { this.emitHaveChanges() }
  @Watch('staffPaymentChanges') private onStaffPaymentChanges (): void { this.emitHaveChanges() }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void { }

  /** Emits Have Changes event. */
  // TODO: delete this and use store instead
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return (
      this.incorpAgrmtChanges ||
      this.shareStructChanges ||
      this.yourCompanyChanges ||
      this.staffPaymentChanges
    )
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
