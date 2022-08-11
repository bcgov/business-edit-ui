<template>
  <section id="ben-correction-view">
    <header>
      <h1>{{ entityTitle }}</h1>
    </header>

    <!-- *** FUTURE: delete this when BEN corrections are not IA-centric -->
    <section id="original-filing-date" class="mt-6">
      <p>
        <span id="original-filing-date-label">Original Filing Date:</span>
        {{ originalFilingDate }}
      </p>
    </section>

    <section id="benefit-company-statement" class="mt-6">
      <p>
        <span id="benefit-company-statement-label">{{ correctionResource.title }}:</span>
        {{ correctionResource.description }}
      </p>
    </section>

    <YourCompany class="mt-10" />

    <PeopleAndRoles class="mt-10" />

    <ShareStructures class="mt-10" />

    <CompletingParty class="mt-10" sectionNumber="1." />

    <Detail class="mt-10" sectionNumber="2." validate="true" />

    <CertifySection class="mt-10" sectionNumber="3." validate="true" />

    <StaffPayment
      class="mt-10"
      sectionNumber="4."
      @haveChanges="onStaffPaymentChanges()"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CompletingParty } from '@/components/Correction/'
import { CertifySection, Detail, PeopleAndRoles, ShareStructures, StaffPayment, YourCompany }
  from '@/components/common/'
import { CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { AuthServices, LegalServices } from '@/services/'
import { ActionBindingIF, CorrectionFilingIF, EntitySnapshotIF, FilingDataIF } from '@/interfaces/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { BenefitCompanyStatementResource } from '@/resources/Correction/'

@Component({
  components: {
    CertifySection,
    CompletingParty,
    Detail,
    PeopleAndRoles,
    ShareStructures,
    StaffPayment,
    YourCompany
  }
})
export default class BenCorrection extends Mixins(CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin) {
  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** The draft correction filing to process. */
  @Prop({ default: () => null })
  readonly correctionFiling: CorrectionFilingIF

  /** The original filing date, in Pacific time. */
  get originalFilingDate (): string {
    return this.apiToPacificDateLong(this.getCorrectedFilingDate)
  }

  /** The resource object for a correction filing. */
  get correctionResource (): any {
    return BenefitCompanyStatementResource
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
      if (!this.correctionFiling) throw (new Error('Missing correction filing. Try reloading the page.'))

      // fetch business snapshot
      const businessSnapshot = await this.fetchBusinessSnapshot()

      // parse draft correction filing and business snapshot into store
      this.parseCorrectionFiling(this.correctionFiling, businessSnapshot)

      // set the resources
      this.setResource(this.correctionResource)

      // initialize Fee Summary data
      this.setFilingData([this.correctionResource.filingData])

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
      LegalServices.fetchParties(this.getBusinessId),
      LegalServices.fetchShareStructure(this.getBusinessId),
      LegalServices.fetchNameTranslations(this.getBusinessId),
      LegalServices.fetchResolutions(this.getBusinessId)
    ])
    if (items.length !== 7) throw new Error('Failed to fetch entity snapshot')
    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      orgPersons: items[3],
      shareStructure: items[4],
      nameTranslations: items[5],
      nameResolutions: items[6]
    } as EntitySnapshotIF
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
#original-filing-date-label,
#benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: bold;
}
</style>
