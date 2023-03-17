<template>
  <ViewWrapper>
    <section class="pb-10" id="special-resolution-view">
      <!-- Company Information page-->
      <v-slide-x-transition hide-on-leave>
        <div v-if="!isSummaryMode">
          <header>
            <h1>Business Information</h1>
          </header>

          <section class="mt-6">
            You must keep your business information up to date. Some changes require a Special Resolution.
            Necessary fees will be applied as updates are made.
          </section>

          <YourCompany class="mt-10" />

          <CurrentDirectors class="mt-10" />

          <CreateSpecialResolution class="mt-10" v-if="showCreateSpecialResolution" />
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
              Changes were made to your business information that require a filing.
              Review and certify the changes you are about to make to your business.
            </p>
          </section>

          <SpecialResolutionSummary
            class="mt-10"
            :validate="getAppValidate"
            @haveChanges="onSpecialResolutionSummaryChanges($event)"
          />

          <DocumentsDelivery
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
            @valid="setDocumentOptionalEmailValidity($event)"
          />

          <TransactionalFolioNumber
            v-if="showTransactionalFolioNumber"
            class="mt-10"
            sectionNumber="2."
            :validate="getAppValidate"
          />

          <CompletingParty
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '3.' : '2.'"
            :validate="getAppValidate"
          />

          <CertifySection
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '4.' : '3.'"
            :validate="getAppValidate"
            :disableEdit="!isRoleStaff"
          />

          <template v-if="isRoleStaff">
            <StaffPayment
              class="mt-10"
              sectionNumber="4."
              @haveChanges="onStaffPaymentChanges()"
            />
          </template>

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
            large
            color="primary"
            id="done-button"
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
import { Action, Getter } from 'vuex-class'
import { GetFeatureFlag } from '@/utils/'
import { SpecialResolutionSummary, CreateSpecialResolution } from '@/components/SpecialResolution'
import { CertifySection, CurrentDirectors, DocumentsDelivery, StaffPayment, TransactionalFolioNumber,
  YourCompany, CompletingParty } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, EntitySnapshotIF, FlagsReviewCertifyIF, ResourceIF } from '@/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { FilingCodes, FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/'
import ViewWrapper from '@/components/ViewWrapper.vue'

@Component({
  components: {
    ViewWrapper,
    SpecialResolutionSummary,
    CertifySection,
    CurrentDirectors,
    DocumentsDelivery,
    StaffPayment,
    TransactionalFolioNumber,
    YourCompany,
    CreateSpecialResolution,
    CompletingParty
  }
})
export default class SpecialResolution extends Mixins(
  CommonMixin,
  FeeMixin,
  FilingTemplateMixin
) {
  // Global getters
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter isSummaryMode!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean
  @Getter isCoop!: boolean

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** Determines if data is loaded, will trigger loading certain components. */
  protected loadedData = false

  /** Whether to show the Transactional Folio Number section. */
  get showTransactionalFolioNumber (): boolean {
    return (this.isPremiumAccount && !this.isRoleStaff)
  }

  /** The id of the alteration being edited. */
  get specialResolutionId (): number {
    return +this.$route.query['special-resolution-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource object for a special resolution filing. */
  get specialResolutionResource (): ResourceIF {
    if (this.isCoop) return CpSpecialResolutionResource
    return null
  }

  /** show special resolution form component.
   * (Business name change, association type change)
   * to add : memorandum, rules */
  get showCreateSpecialResolution (): boolean {
    return this.loadedData && (this.hasBusinessNameChanged || this.hasAssociationTypeChanged)
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
    if (!this.isJestRunning && !GetFeatureFlag('alteration-ui-enabled')) {
      window.alert('Alterations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      // update later with resolution-id and parse it once it saved
      if (this.specialResolutionId) {
        // store the filing ID
        this.setFilingId(this.specialResolutionId)

        // fetch draft special resolution to resume
        const filing = await LegalServices.fetchFilingById(this.getBusinessId, this.specialResolutionId)

        // do not proceed if this isn't an Special Resolution filing
        if (!filing.specialResolution) {
          throw new Error('Invalid special resolution filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (filing.header?.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid special resolution status')
        }

        // parse special resolution filing and original entity snapshot into store
        this.parseSpecialResolutionFiling(filing, entitySnapshot)
      } else {
        // parse just the entity snapshot into store
        this.parseEntitySnapshot(entitySnapshot)
      }

      if (!this.specialResolutionResource) {
        throw new Error(`Invalid special resolution resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.specialResolutionResource)

      // initialize Fee Summary data
      const filingData = [this.specialResolutionResource.filingData]
      if (this.hasBusinessNameChanged) {
        filingData.push({
          filingTypeCode: FilingCodes.SPECIAL_RESOLUTION_NAME_CHANGE,
          entityType: CorpTypeCd.COOP,
          priority: false
        })
      }
      filingData.forEach(fd => {
        fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
      })
      this.setFilingData(filingData)

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData(true)

      // set current profile name to store for field pre population
      // do this only if we are not staff
      if (!this.isRoleStaff) {
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
      LegalServices.fetchDirectors(this.getBusinessId)
    ])

    if (items.length !== 4) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      orgPersons: items[3]
    } as EntitySnapshotIF
  }

  /** Called when resolution summary data has changed. */
  protected async onSpecialResolutionSummaryChanges (): Promise<void> {
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

  /** Updates fees depending on business name change. */
  @Watch('hasBusinessNameChanged', { immediate: true })
  private async businessNameChanged (hasBusinessNameChanged: boolean): Promise<void> {
    if (this.specialResolutionResource) {
      let filingData = [this.specialResolutionResource.filingData]
      if (hasBusinessNameChanged) {
        filingData.push({
          filingTypeCode: FilingCodes.SPECIAL_RESOLUTION_NAME_CHANGE,
          entityType: CorpTypeCd.COOP,
          priority: false
        })
      }
      this.setFilingData(filingData)
      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)
      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData(true)
    }
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitHaveData (haveData = true): void {
    this.loadedData = true
  }
}
</script>

<style lang="scss" scoped>
#done-button {
  width: 10rem;
}
</style>
