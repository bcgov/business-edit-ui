<template>
  <section id="firm-correction-view">
    <header>
      <h1>Correction - {{ originalFilingName }}</h1>
    </header>

    <section id="original-filing-date" class="mt-6">
      <p>
        <span id="original-filing-date-label">Original Filing Date:</span>
        {{ originalFilingDate }}
      </p>
    </section>

    <YourCompany class="mt-10" />

    <PeopleAndRoles class="mt-10" />

    <template v-if="isClientErrorCorrection">
      <CompletingParty class="mt-10" sectionNumber="1." validate="true" />
    </template>

    <Detail
      class="mt-10"
      :sectionNumber="isClientErrorCorrection ? '2.' : '1.'"
      validate="true"
    />

    <template v-if="isClientErrorCorrection">
      <CertifySection
        class="mt-10"
        :sectionNumber="isClientErrorCorrection ? '3.' : '2.'"
        validate="true"
      />
    </template>

    <StaffPayment
      class="mt-10"
      :sectionNumber="isClientErrorCorrection ? '4.' : '2.'"
      @haveChanges="onStaffPaymentChanges()"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CertifySection, CompletingParty, Detail, PeopleAndRoles, StaffPayment, YourCompany }
  from '@/components/common/'
import { CommonMixin, DateMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, CorrectionFilingIF, EntitySnapshotIF, FilingDataIF } from '@/interfaces/'
import { AuthServices, LegalServices } from '@/services/'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { GeneralPartnershipResource, SoleProprietorshipResource } from '@/resources/Correction/'

@Component({
  components: {
    CertifySection,
    CompletingParty,
    Detail,
    PeopleAndRoles,
    StaffPayment,
    YourCompany
  }
})
export default class FmCorrection extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin) {
  // Global getters
  @Getter getFilingData!: FilingDataIF

  // Global actions
  @Action setCorrectedFilingId!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setCorrectedFiling!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** The draft correction filing to process. */
  @Prop({ default: () => null })
  readonly correctionFiling: CorrectionFilingIF

  readonly getCorpTypeDescription = GetCorpFullDescription

  /** Whether this is a client error correction (vs. a staff error correction). */
  get isClientErrorCorrection (): boolean {
    return true // FUTURE: implement this according to schema changes
  }

  /** The original filing name. */
  get originalFilingName (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)} Registration`
  }

  /** The original filing date, in Pacific time. */
  get originalFilingDate (): string {
    return this.apiToPacificDateLong(this.getOriginalFilingDateTime)
  }

  /** The resource file for a correction filing. */
  get correctionResource (): any {
    if (this.isEntityTypeSP) return SoleProprietorshipResource
    if (this.isEntityTypeGP) return GeneralPartnershipResource
    throw new Error(`Invalid Correction Resource entity type = ${this.getEntityType}`)
  }

  /**
   * Called when correction filing is fetched and this component can continue loading.
   * Must be "immediate" because this component is only rendered when we have the data.
   */
  @Watch('correctionFiling', { immediate: true })
  private async onCorrectionFiling (): Promise<void> {
    // fetch the rest of the data
    try {
      // safety check
      if (!this.correctionFiling) throw (new Error('Missing correction filing'))

      // parse correction filing into store
      this.parseCorrectionFiling(this.correctionFiling)

      // get and store ID of filing that is being corrected
      // NB: we don't care about this but it's needed in the correction filing object
      const correctedFilingId: number = +this.correctionFiling.correction?.correctedFilingId
      this.setCorrectedFilingId(correctedFilingId)

      // fetch and store original IA
      // (needed to know what we're correcting)
      const correctedFiling = await LegalServices.fetchFilingById(this.getBusinessId, correctedFilingId)
      this.setCorrectedFiling(correctedFiling)

      // fetch and store business snapshot
      const businessSnapshot = await this.fetchBusinessSnapshot()
      await this.parseEntitySnapshot(businessSnapshot)

      // set the resources
      this.setResource(this.correctionResource)

      // initialize Fee Summary data
      this.setFilingData(this.correctionResource.filingData)

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    this.$nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the business snapshot. */
  private async fetchBusinessSnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      LegalServices.fetchBusinessInfo(this.getBusinessId),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      LegalServices.fetchAddresses(this.getBusinessId),
      LegalServices.fetchParties(this.getBusinessId)
    ])

    if (items.length !== 4) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      orgPersons: items[3]
    } as EntitySnapshotIF
  }

  protected onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    this.setFilingData({
      ...this.getFilingData,
      priority: this.getStaffPayment.isPriority,
      waiveFees: (this.getStaffPayment.option === StaffPaymentOptions.NO_FEE)
    })
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}
}
</script>

<style lang="scss" scoped>
#original-filing-date-label {
  letter-spacing: -0.04rem;
  font-weight: bold;
}
</style>
