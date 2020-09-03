<template>
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

    <your-company
      :isSummary="true"
      @haveChanges="yourCompanyChanges = $event"
    />

    <list-people-and-roles
      :isSummary="true"
      :personList="getOrgPeople"
      @haveChanges="peopleRolesChanges = $event"
    />

    <list-share-class
      :isSummary="true"
      :shareClasses="getShareClasses"
      @haveChanges="shareStructChanges = $event"
    />

    <agreement-type
      :isSummary="true"
      @haveChanges="incorpAgrmtChanges = $event"
    />

    <completing-party class="mt-6" />

    <detail
      class="mt-6"
      @emitValid="detailValid = $event"
    />

    <certify
      class="mt-6"
      @emitValid="certifyValid = $event"
    />

    <staff-payment
      class="mt-6"
      @emitValid="staffPaymntValid = $event"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { featureFlags } from '@/utils'

// Components
import { YourCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'
import { Certify, CompletingParty, Detail, StaffPayment } from '@/components/common'

// Mixins, Interfaces and Enums
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, GetterIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
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
    ListPeopleAndRoles,
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
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean

  // Global setters
  @Action setEntityType!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  private appReady: boolean

  /** The IA filing to correct. */
  private correctedFiling: any = null

  // whether components have changes
  private incorpAgrmtChanges = false
  private peopleRolesChanges = false
  private shareStructChanges = false
  private yourCompanyChanges = false

  // whether components are valid
  // TODO: use these to enable Save and File buttons
  //       (need to refactor Actions.vue)
  private certifyValid = false
  private detailValid = false
  private incorpAgrmtValid = false
  private peopleRolesValid = false
  private shareStructValid = false
  private staffPaymntValid = false
  private yourCompanyValid = false

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

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    if (!featureFlags.getFlag('correction-ui-enabled')) {
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
      if (this.correctionId) {
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

        // fetch original IA to correct
        this.correctedFiling = await this.fetchFilingById(correctionFiling.correctedFilingId)

        // parse IA filing into store
        // this is the initial state of the correction filing
        this.parseIncorpApp(this.correctedFiling)

        // parse correction filing into store
        // this applies the diffs (corrections)
        this.parseCorrection(correctionFiling)
      } else if (this.correctedId) {
        // fetch original IA to correct
        this.correctedFiling = await this.fetchFilingById(this.correctedId)

        // do not proceed if this isn't an IA filing
        if (!this.correctedFiling.incorporationApplication) {
          console.log('Invalid IA filing')
          throw new Error('Invalid IA filing')
        }

        // do not proceed if this isn't a COMPLETED filing
        if (this.correctedFiling.header.status !== FilingStatus.COMPLETED) {
          console.log('Invalid IA status')
          throw new Error('Invalid IA status')
        }

        // parse IA filing into store
        // this is the initial state of the correction filing
        this.parseIncorpApp(this.correctedFiling)
      } else {
        // as we don't have the necessary query params, do not proceed
        throw new Error('Invalid corrected or correction filing ID')
      }

      // set current entity type
      this.setEntityType(EntityTypes.BCOMP)

      // initialize Fee Summary data
      this.emitFilingData([{
        filingTypeCode: FilingCodes.CORRECTION,
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

  // watchers for component change flags
  @Watch('incorpAgrmtChanges') private onIncorpAgrmtChanges ():void { this.emitHaveChanges() }
  @Watch('peopleRolesChanges') private onPeopleRolesChanges ():void { this.emitHaveChanges() }
  @Watch('shareStructChanges') private onShareStructChanges ():void { this.emitHaveChanges() }
  @Watch('yourCompanyChanges') private onYourCompanyChanges ():void { this.emitHaveChanges() }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}

  /** Emits new Filing Data. */
  @Emit('filingData')
  private emitFilingData (filingData: FilingDataIF[]): void {}

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return (
      this.incorpAgrmtChanges ||
      this.peopleRolesChanges ||
      this.shareStructChanges ||
      this.yourCompanyChanges
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
