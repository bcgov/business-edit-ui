<template>
  <ViewWrapper>
    <section
      id="alteration-view"
      class="pb-10"
    >
      <!-- Company Information page-->
      <v-slide-x-transition hide-on-leave>
        <div v-if="!isSummaryMode">
          <header>
            <h1>Company Information</h1>
          </header>

          <section class="mt-6">
            You are legally obligated to keep your company information up to date. Necessary fees will be
            applied as updates are made.
          </section>

          <YourCompanyWrapper class="mt-10">
            <div>
              <EntityName />
              <BusinessType />
              <NameTranslation />
            </div>
            <RecognitionDateTime />
            <OfficeAddresses />
            <BusinessContactInfo />
            <FolioInformation />
          </YourCompanyWrapper>

          <CurrentDirectors class="mt-10" />

          <CurrentOfficers
            v-if="showOfficers"
            :disable-links="showFeeSummary"
            class="mt-10"
          />

          <ShareStructures class="mt-10" />

          <Articles class="mt-10" />
        </div>
      </v-slide-x-transition>

      <!-- Review and Certify page -->
      <v-slide-x-reverse-transition hide-on-leave>
        <div v-if="isSummaryMode && showFeeSummary">
          <header>
            <h1>Review and Certify</h1>
          </header>

          <section class="mt-6">
            <p id="intro-text">
              Review and certify the changes you are about to make to your company. Certain changes require
              an Alteration Notice which will incur a {{ filingFeesPrice }} fee. Choosing an alteration date
              and time in the future will incur an additional {{ futureEffectiveFeesPrice }} fee.
            </p>
          </section>

          <AlterationSummary
            class="mt-10"
            :validate="getAppValidate"
            @haveChanges="onAlterationSummaryChanges()"
          />

          <DocumentsDelivery
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
            @valid="setDocumentOptionalEmailValidity($event)"
          />

          <!-- Transactional Folio Number is mutually exclusive with Staff Payment -->
          <TransactionalFolioNumber
            v-if="showTransactionalFolioNumber"
            class="mt-10"
            sectionNumber="2."
            :validate="getAppValidate"
          />

          <CertifySection
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '3.' : '2.'"
            :validate="getAppValidate"
            :disableEdit="false"
          />

          <CourtOrderPoa
            v-if="IsAuthorized(AuthorizedActions.COURT_ORDER_POA)"
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '4.' : '3.'"
            :autoValidation="getAppValidate"
          />

          <!-- Staff Payment is mutually exclusive with Transactional Folio Number -->
          <StaffPayment
            v-if="IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
            class="mt-10"
            :sectionNumber="IsAuthorized(AuthorizedActions.COURT_ORDER_POA) ? '4.' : '3.'"
            @haveChanges="onStaffPaymentChanges()"
          />
        </div>
      </v-slide-x-reverse-transition>

      <!-- Done-->
      <v-fade-transition>
        <div v-if="isSummaryMode && !showFeeSummary">
          <header>
            <h1>Review and Certify</h1>
          </header>

          <section class="mt-6">
            You have deleted all fee-based changes and your company information has reverted to its
            original state. If you made any non-fee changes such as updates to your Registered
            Office Contact Information, please note that these changes have already been saved.
          </section>

          <v-btn
            id="done-button"
            large
            color="primary"
            class="mt-8"
            @click="$root.$emit('go-to-dashboard')"
          >
            <span>Done</span>
          </v-btn>
        </div>
      </v-fade-transition>
    </section>
  </ViewWrapper>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { AlterationSummary, Articles } from '@/components/Alteration/'
import { BusinessContactInfo, BusinessType, CertifySection, CourtOrderPoa, CurrentDirectors, CurrentOfficers,
  DocumentsDelivery, EntityName, FolioInformation, OfficeAddresses, RecognitionDateTime,
  ShareStructures, StaffPayment, TransactionalFolioNumber, YourCompanyWrapper }
  from '@/components/common/'
import { NameTranslation } from '@/components/common/YourCompany/NameTranslations/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { EntitySnapshotIF, ResourceIF } from '@/interfaces/'
import { AuthorizedActions, FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import * as Resources from '@/resources/Alteration/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { useStore } from '@/store/store'
import { GetFeatureFlag, IsAuthorized } from '@/utils'

@Component({
  components: {
    AlterationSummary,
    Articles,
    BusinessContactInfo,
    BusinessType,
    CertifySection,
    CourtOrderPoa,
    CurrentDirectors,
    CurrentOfficers,
    DocumentsDelivery,
    EntityName,
    FolioInformation,
    NameTranslation,
    OfficeAddresses,
    RecognitionDateTime,
    ShareStructures,
    StaffPayment,
    TransactionalFolioNumber,
    ViewWrapper,
    YourCompanyWrapper
  }
})
export default class Alteration extends Mixins(CommonMixin, FeeMixin, FilingTemplateMixin) {
  // for template
  readonly IsAuthorized = IsAuthorized
  readonly AuthorizedActions = AuthorizedActions

  // Store getters
  @Getter(useStore) getAppValidate!: boolean
  // @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  // @Getter(useStore) getOriginalLegalType!: CorpTypeCd
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Store actions
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** Whether to show the Transactional Folio Number section. */
  get showTransactionalFolioNumber (): boolean {
    // mutually exclusive with Staff Payment
    return !IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
  }

  /** The id of the alteration being edited. */
  get alterationId (): number {
    return +this.$route.query['alteration-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource object for an alteration filing. */
  get alterationResource (): ResourceIF {
    switch (this.getOriginalLegalType) {
      case CorpTypeCd.BC_CCC: return Resources.AlterationResourceCc
      case CorpTypeCd.BC_COMPANY: return Resources.AlterationResourceBc
      case CorpTypeCd.BC_ULC_COMPANY: return Resources.AlterationResourceUlc
      case CorpTypeCd.BEN_CONTINUE_IN: return Resources.AlterationResourceCben
      case CorpTypeCd.BENEFIT_COMPANY: return Resources.AlterationResourceBen
      case CorpTypeCd.CCC_CONTINUE_IN: return Resources.AlterationResourceCcc
      case CorpTypeCd.CONTINUE_IN: return Resources.AlterationResourceC
      case CorpTypeCd.ULC_CONTINUE_IN: return Resources.AlterationResourceCul
      default: return null // should never happen
    }
  }

  /** For LD FF */
  get showOfficers (): boolean {
    return GetFeatureFlag('supported-change-of-officers-entities')
  }

  @Watch('hasBusinessNameChanged')
  @Watch('hasBusinessTypeChanged')
  @Watch('getNameRequestLegalName')
  @Watch('getEntityType')
  onBusinessTypeChanged () {
    const filingData = this.getFilingData
    // when altering from BC (or C) to ULC/CUL, use specific filing data
    if (
      (
        this.getOriginalLegalType === CorpTypeCd.BC_COMPANY ||
        this.getOriginalLegalType === CorpTypeCd.CONTINUE_IN
      ) &&
      (
        this.getEntityType === CorpTypeCd.BC_ULC_COMPANY ||
        this.getEntityType === CorpTypeCd.ULC_CONTINUE_IN
      )
    ) {
      this.setFilingData([{
        filingTypeCode: Resources.AlterationResourceBc.additionalFilingData.filingTypeCode,
        entityType: Resources.AlterationResourceBc.additionalFilingData.entityType as any,
        priority: filingData[0].priority,
        futureEffective: filingData[0].futureEffective
      }])
    } else {
      this.setFilingData([{
        filingTypeCode: this.alterationResource.filingData.filingTypeCode,
        entityType: this.alterationResource.filingData.entityType as any,
        priority: filingData[0].priority,
        futureEffective: filingData[0].futureEffective
      }])
    }
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if not authorized
    if (!IsAuthorized(AuthorizedActions.ALTERATION_FILING)) {
      window.alert('You are not authorized to use Alteration filings.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      switch (entitySnapshot?.businessInfo?.legalType) {
        case CorpTypeCd.BC_CCC:
        case CorpTypeCd.BC_COMPANY:
        case CorpTypeCd.BC_ULC_COMPANY:
        case CorpTypeCd.BEN_CONTINUE_IN:
        case CorpTypeCd.BENEFIT_COMPANY:
        case CorpTypeCd.CCC_CONTINUE_IN:
        case CorpTypeCd.CONTINUE_IN:
        case CorpTypeCd.ULC_CONTINUE_IN:
          break // acceptable types
        default:
          throw new Error('Invalid entity type, alterations are for corporations (BC/BEN/CCC/ULC) only')
      }

      if (this.alterationId) {
        // store the filing ID
        this.setFilingId(this.alterationId)

        // fetch draft alteration to resume
        const alterationFiling = await LegalServices.fetchFilingById(this.getBusinessId, this.alterationId)

        // do not proceed if this isn't an ALTERATION filing
        if (!alterationFiling.alteration) {
          throw new Error('Invalid alteration filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (alterationFiling.header?.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid alteration status')
        }

        // parse draft alteration filing and entity snapshot into store
        this.parseAlterationFiling(alterationFiling, entitySnapshot)
      } else {
        // parse just the entity snapshot into store
        this.parseEntitySnapshot(entitySnapshot)
      }

      if (!this.alterationResource) {
        throw new Error(`Invalid alteration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.alterationResource)

      // initialize Fee Summary data
      const filingData = [this.alterationResource.filingData]
      filingData.forEach(fd => {
        fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
      })
      this.setFilingData(filingData)

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData(true)

      // set current profile name to store for field pre population
      // do this except if we are authorized to skip it
      if (!IsAuthorized(AuthorizedActions.BLANK_CERTIFY_STATE)) {
        // pre-populate Certified By name
        this.setCertifyState(
          {
            valid: this.getCertifyState.valid,
            certifiedBy: `${this.getUserFirstName} ${this.getUserLastName}`
          }
        )
      }

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
      LegalServices.fetchNameTranslations(this.getBusinessId),
      LegalServices.fetchParties(this.getBusinessId),
      LegalServices.fetchShareStructure(this.getBusinessId),
      LegalServices.fetchResolutions(this.getBusinessId)
    ])

    if (items.length !== 7) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      nameTranslations: items[3],
      orgPersons: items[4],
      shareStructure: items[5],
      resolutions: items[6]
    } as EntitySnapshotIF
  }

  /** Called when alteration summary data has changed. */
  async onAlterationSummaryChanges (): Promise<void> {
    // update filing data with future effective field
    const filingData = [...this.getFilingData]
    filingData.forEach(fd => {
      fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
    })
    this.setFilingData(filingData)
    // update the current fees for this filing
    await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)
    // update the fee prices for the notice changes
    await this.setFeePricesFromFilingData(true)
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
#done-button {
  width: 10rem;
}
</style>
