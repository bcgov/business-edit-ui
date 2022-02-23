<template>
  <section id="correction-view">
    <header>
      <h1>Correction - Incorporation Application</h1>
    </header>

    <section id="original-filing-date" class="mt-6">
      <p>
        <span id="original-filing-date-label">Original Filing Date:</span>
        {{ originalFilingDate }}
      </p>
    </section>

    <section id="benefit-company-statement" class="mt-6" v-if="isTypeBcomp">
      <p>
        <span id="benefit-company-statement-label">{{ BenefitCompanyStatementResource.title }}:</span>
        {{ BenefitCompanyStatementResource.description }}
      </p>
    </section>

    <YourCompany class="mt-10" />

    <PeopleAndRoles class="mt-10" />

    <ShareStructures class="mt-10" />

    <AgreementType class="mt-10" />

    <CompletingParty class="mt-10" />

    <Detail class="mt-10" />

    <CertifySection class="mt-10" />

    <StaffPayment
      class="mt-10"
      @haveChanges="onStaffPaymentChanges()"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'
import { AgreementType } from '@/components/Correction'
import {
  CertifySection,
  CompletingParty,
  Detail,
  PeopleAndRoles,
  ShareStructures,
  StaffPayment,
  YourCompany
} from '@/components/common'
import { CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, StaffPaymentIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, FilingStatus, StaffPaymentOptions } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BenefitCompanyStatementResource, CorrectionResources } from '@/resources'

@Component({
  components: {
    AgreementType,
    CertifySection,
    CompletingParty,
    Detail,
    PeopleAndRoles,
    ShareStructures,
    StaffPayment,
    YourCompany
  }
})
export default class Correction extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Declarations for template
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource

  // Global getters
  @Getter getBusinessId!: string
  @Getter getOriginalFilingDateTime!: string
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getEntityType!: CorpTypeCd
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getFilingData!: FilingDataIF

  // Global actions
  @Action setCorrectedFilingId!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setOriginalIA!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** The id of the correction being edited. */
  private get correctionId (): number {
    return +this.$route.query['correction-id'] || 0
  }

  /** The original filing datetime, in Pacific time. */
  get originalFilingDate (): string {
    return this.apiToPacificDateTime(this.getOriginalFilingDateTime)?.slice(0, 10)
  }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  private get correctionResources (): any {
    const resources = CorrectionResources.find(x => x.entityType === this.getEntityType)
    if (!resources) {
      // go to catch()
      throw new Error(`Invalid Correction resources entity type = ${this.getEntityType}`)
    }
    return resources
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    // bypass this when Jest is running as FF are not fetched
    if (!this.isJestRunning && !getFeatureFlag('correction-ui-enabled')) {
      window.alert('Corrections are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard')
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can correct an Incorporation Application.')
      this.$root.$emit('go-to-dashboard')
      return
    }

    // try to fetch data
    try {
      // set current entity type
      this.setEntityType(CorpTypeCd.BENEFIT_COMPANY)

      // initialize Fee Summary data
      // TODO: Set/Clear Data according to filing type / entity type
      this.setFilingData({
        filingTypeCode: FilingCodes.CORRECTION,
        entityType: CorpTypeCd.BENEFIT_COMPANY,
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
      this.setResource(this.correctionResources)

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveUnsavedChanges(false))
  }

  onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    this.setFilingData({
      ...this.getFilingData,
      priority: this.getStaffPayment.isPriority,
      waiveFees: (this.getStaffPayment.option === StaffPaymentOptions.NO_FEE)
    })
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}
}
</script>

<style lang="scss" scoped>
#original-filing-date-label,
#benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: bold;
}
</style>
