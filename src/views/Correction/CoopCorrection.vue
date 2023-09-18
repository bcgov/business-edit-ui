<template>
  <section
    v-if="isDataLoaded"
    id="coop-correction-view"
  >
    <header>
      <h1>REGISTER CORRECTION</h1>
    </header>

    <section
      id="original-filing-date"
      class="mt-6"
    >
      <p>
        <strong>
          <span id="original-filing-date-label">Original Filing Date:</span>
        </strong>
        {{ originalFilingDate }}
      </p>
    </section>

    <YourCompanyWrapper class="mt-10">
      <div>
        <EntityName />
      </div>
      <AssociationType />
      <RecognitionDateTime />
      <OfficeAddresses />
      <BusinessContactInfo />
    </YourCompanyWrapper>

    <Rules class="mt-10" />

    <Memorandum class="mt-10" />

    <Resolution class="mt-10" />

    <CompletingParty
      v-if="isClientErrorCorrection"
      class="mt-10"
      sectionNumber="1."
      validate="true"
    />

    <Detail
      class="mt-10"
      :sectionNumber="isClientErrorCorrection ? '2.' : '1.'"
      validate="true"
      rowCount="5"
    />

    <CertifySection
      v-if="isClientErrorCorrection"
      class="mt-10"
      :sectionNumber="isClientErrorCorrection ? '3.' : '2.'"
      validate="true"
    />

    <CourtOrderPoa
      class="mt-10"
      :sectionNumber="isClientErrorCorrection ? '4.' : '2.'"
      autoValidation="true"
    />

    <StaffPayment
      class="mt-10"
      sectionNumber="3."
      @haveChanges="onStaffPaymentChanges()"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { SpecialResolutionSummary, Resolution } from '@/components/SpecialResolution'
import { AssociationType, BusinessContactInfo, BusinessType, CertifySection, CompletingParty, CourtOrderPoa,
  CurrentDirectors, Detail, DocumentsDelivery, EntityName, FolioInformation, OfficeAddresses, RecognitionDateTime,
  StaffPayment, TransactionalFolioNumber, YourCompanyWrapper } from '@/components/common/'
import { CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import Rules from '@/components/SpecialResolution/Rules.vue'
import Memorandum from '@/components/SpecialResolution/Memorandum.vue'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CorrectionFilingIF, ResourceIF, EntitySnapshotIF } from '@/interfaces'
import { CpCorrectionResource } from '@/resources/Correction'
import { LegalServices, AuthServices } from '@/services'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'
import { CorrectionErrorTypes } from '@/enums'
import { FilingDataIF } from '@bcrs-shared-components/interfaces'

@Component({
  components: {
    AssociationType,
    BusinessContactInfo,
    BusinessType,
    CertifySection,
    CompletingParty,
    CourtOrderPoa,
    Detail,
    Resolution,
    CurrentDirectors,
    DocumentsDelivery,
    EntityName,
    FolioInformation,
    OfficeAddresses,
    RecognitionDateTime,
    SpecialResolutionSummary,
    StaffPayment,
    TransactionalFolioNumber,
    Rules,
    Memorandum,
    ViewWrapper,
    YourCompanyWrapper
  }
})
export default class CoopCorrection extends Mixins(CommonMixin, DateMixin, FeeMixin, FilingTemplateMixin) {
  // Global getters
  @Getter(useStore) isPartnership!: boolean
  @Getter(useStore) isSoleProp!: boolean

  // Global actions
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void

  /** The draft correction filing to process. */
  @Prop({ default: () => null }) readonly correctionFiling!: CorrectionFilingIF

  isDataLoaded = false

  /** The original filing date, in Pacific time. */
  get originalFilingDate (): string {
    return this.apiToPacificDateLong(this.getCorrectedFilingDate)
  }

  /** The resource object for a firm correction filing. */
  get correctionResource (): ResourceIF {
    return CpCorrectionResource
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

      // set the resources
      this.setResource(this.correctionResource)

      // initialize Fee Summary data
      const filingData = [this.correctionResource.filingData]
      if (this.correctionFiling.correction.type === CorrectionErrorTypes.STAFF) {
        (filingData[0] as FilingDataIF).waiveFees = true
      }
      this.setFilingData(filingData)

      // pre-select No Fee option
      this.setStaffPayment({ option: StaffPaymentOptions.NO_FEE })

      // tell App that we're finished loading
      this.emitHaveData()
      this.isDataLoaded = true
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
      LegalServices.fetchBusinessDocuments(this.getBusinessId),
      LegalServices.fetchResolutions(this.getBusinessId, true),
      LegalServices.fetchParties(this.getBusinessId),
      LegalServices.fetchAddresses(this.getBusinessId)
    ])

    if (items.length !== 6) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      businessDocuments: items[2],
      resolutions: items[3],
      orgPersons: items[4],
      addresses: items[5]
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
