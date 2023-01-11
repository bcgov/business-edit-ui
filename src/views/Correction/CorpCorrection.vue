<template>
  <section id="ben-correction-view">
    <header>
      <h1>{{ entityTitle }}</h1>
    </header>

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

    <Articles class="mt-10" />

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
import { Articles } from '@/components/Alteration/'
import { CertifySection, Detail, PeopleAndRoles, ShareStructures, StaffPayment, YourCompany, CompletingParty }
  from '@/components/common/'
import { CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { AuthServices, LegalServices } from '@/services/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { ActionBindingIF, CorrectionFilingIF, EntitySnapshotIF, ResourceIF } from '@/interfaces/'
import { BcCorrectionResource, BenCorrectionResource, CccCorrectionResource, UlcCorrectionResource }
  from '@/resources/Correction/'

/** Correction sub-component for corp class "BC" entities. */
@Component({
  components: {
    CertifySection,
    Detail,
    PeopleAndRoles,
    ShareStructures,
    StaffPayment,
    YourCompany,
    Articles,
    CompletingParty
  }
})
export default class CorpCorrection extends Mixins(CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin) {
  // Global getters
  @Getter isBcCompany!: boolean
  @Getter isBenefitCompany!: boolean
  @Getter isBcCcc!: boolean
  @Getter isBcUlcCompany!: boolean

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** The draft correction filing to process. */
  @Prop({ default: () => null }) readonly correctionFiling!: CorrectionFilingIF

  /** The original filing date, in Pacific time. */
  get originalFilingDate (): string {
    return this.apiToPacificDateLong(this.getCorrectedFilingDate)
  }

  /** The resource object for a correction filing. */
  get correctionResource (): ResourceIF {
    switch (true) {
      case this.isBcCompany: return BcCorrectionResource
      case this.isBenefitCompany: return BenCorrectionResource
      case this.isBcCcc: return CccCorrectionResource
      case this.isBcUlcCompany: return UlcCorrectionResource
    }
    return null
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

      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      // parse draft correction filing and entity snapshot into store
      this.parseCorrectionFiling(this.correctionFiling, entitySnapshot)

      if (!this.correctionResource) {
        throw new Error(`Invalid correction resource entity type = ${this.getEntityType}`)
      }

      // set the resources
      this.setResource(this.correctionResource)

      // initialize Fee Summary data
      this.setFilingData([this.correctionResource.filingData])

      // pre-select No Fee option
      this.setStaffPayment({ option: StaffPaymentOptions.NO_FEE })

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    this.$nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the entity snapshot. */
  private async fetchEntitySnapshot (): Promise<EntitySnapshotIF> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitHaveData (haveData = true): void {}
}
</script>

<style lang="scss" scoped>
#original-filing-date-label,
#benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: bold;
}
</style>
