<template>
  <section class="pb-10" id="alteration-view">
    <!-- Company Information page-->
    <v-slide-x-transition hide-on-leave>
      <div v-if="!isSummaryMode">
        <header>
          <h1>Company Information</h1>
        </header>

        <section class="mt-6">
          You are legally obligated to keep your company information up to date. Necessary fees
          will be applied as updates are made.
        </section>

        <YourCompany class="mt-10" />

        <CurrentDirectors class="mt-10" />

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
            Review and certify the changes you are about to make to your company. Certain changes require an Alteration
            Notice which will incur a {{filingFeesPrice}} fee. Choosing an alteration date and time in the future will
            incur an additional {{futureEffectiveFeesPrice}} fee.
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
          :disableEdit="!isRoleStaff"
        />

        <!-- STAFF ONLY: Court Order and Plan of Arrangement -->
        <template v-if="isRoleStaff">
          <h2 class="mt-10">{{showTransactionalFolioNumber ? '4.' : '3.'}} Court Order and Plan of Arrangement</h2>
          <div class="py-4">
            If this filing is pursuant to a court order, enter the court order number. If this
            filing is pursuant to a plan of arrangement, enter the court order number and select
            Plan of Arrangement.
          </div>

          <div :class="{'invalid-section': invalidCourtOrder}">
            <CourtOrderPoaShared
              id="court-order"
              :autoValidation="getAppValidate"
              :draftCourtOrderNumber="getFileNumber"
              :hasDraftPlanOfArrangement="getHasPlanOfArrangement"
              :invalidSection="invalidCourtOrder"
              @emitCourtNumber="setFileNumber($event)"
              @emitPoa="setHasPlanOfArrangement($event)"
              @emitValid="setValidCourtOrder($event)"
            />
          </div>

          <StaffPayment
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '5.' : '4.'"
            :validate="getAppValidate"
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
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils/'
import { AlterationSummary, Articles, TransactionalFolioNumber } from '@/components/Alteration/'
import { CertifySection, CurrentDirectors, DocumentsDelivery, ShareStructures, StaffPayment, YourCompany }
  from '@/components/common/'
import { CourtOrderPoa as CourtOrderPoaShared } from '@bcrs-shared-components/court-order-poa/'
import { AuthServices } from '@/services/'
import { CommonMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins/'
import { ActionBindingIF, EmptyFees, EntitySnapshotIF, FeesIF, FilingDataIF, FlagsReviewCertifyIF, ResourceIF }
  from '@/interfaces/'
import { FilingCodes, FilingStatus } from '@/enums/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { cloneDeep } from 'lodash'
import { BenefitCompanyResource, CooperativeResource } from '@/resources/Alteration/'

@Component({
  components: {
    AlterationSummary,
    Articles,
    CertifySection,
    CourtOrderPoaShared,
    CurrentDirectors,
    DocumentsDelivery,
    ShareStructures,
    StaffPayment,
    TransactionalFolioNumber,
    YourCompany
  }
})
export default class Alteration extends Mixins(
  CommonMixin,
  LegalApiMixin,
  FilingTemplateMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter isSummaryMode!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getFilingData!: FilingDataIF
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean
  @Getter getFeePrices!: FeesIF

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setValidCourtOrder!: ActionBindingIF
  @Action setCurrentFees!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** Whether to show the Transactional Folio Number section. */
  get showTransactionalFolioNumber (): boolean {
    return (this.isPremiumAccount && !this.isRoleStaff)
  }

  /** The id of the alteration being edited. */
  get alterationId (): number {
    return +this.$route.query['alteration-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Check validity state, only when prompted by app. */
  get invalidCourtOrder (): boolean {
    return (this.getAppValidate && !this.getFlagsReviewCertify.isValidCourtOrder)
  }

  get filingFeesPrice (): string {
    if (this.getFeePrices.filingFees !== null) {
      return `$${this.getFeePrices.filingFees.toFixed(2)}`
    }
    return ''
  }

  get futureEffectiveFeesPrice (): string {
    if (this.getFeePrices.futureEffectiveFees !== null) {
      return `$${this.getFeePrices.futureEffectiveFees.toFixed(2)}`
    }
    return ''
  }

  /** The resource file for an alteration filing. */
  get alterationResource (): ResourceIF {
    if (this.isEntityTypeBEN) return BenefitCompanyResource
    if (this.isEntityTypeCP) return CooperativeResource
    return null
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
    if (!this.isJestRunning && !getFeatureFlag('alteration-ui-enabled')) {
      window.alert('Alterations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      const businessSnapshot = await this.fetchBusinessSnapshot()

      if (this.alterationId) {
        // store the filing ID
        this.setFilingId(this.alterationId)

        // fetch draft alteration to resume
        const alterationFiling = await this.fetchFilingById(this.alterationId)

        // do not proceed if this isn't an ALTERATION filing
        if (!alterationFiling.alteration) {
          throw new Error('Invalid Alteration filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (alterationFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid Alteration status')
        }

        // parse alteration filing and original business snapshot into store
        await this.parseAlterationFiling(alterationFiling, businessSnapshot)
      } else {
        // parse business data into store
        await this.parseEntitySnapshot(businessSnapshot)
      }

      if (this.alterationResource) {
        // set the specific resource
        this.setResource(this.alterationResource)

        // initialize Fee Summary data
        this.setFilingData(this.alterationResource.filingData)
      } else {
        // go to catch()
        throw new Error(`Invalid Alteration resources entity type = ${this.getEntityType}`)
      }

      // update the current fees for the Filing
      this.setCurrentFees(
        await this.fetchFilingFees(
          FilingCodes.ALTERATION, this.getEntityType, this.getEffectiveDateTime.isFutureEffective
        ).catch(() => cloneDeep(EmptyFees))
      )

      // fetches the fee prices to display in the text
      this.setFeePrices(
        await this.fetchFilingFees(
          FilingCodes.ALTERATION, this.getEntityType, true
        ).catch(() => cloneDeep(EmptyFees))
      )

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

  /** Fetches the business snapshot. */
  private async fetchBusinessSnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      this.fetchBusinessInfo(),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      this.fetchAddresses(),
      this.fetchNameTranslations(),
      this.fetchDirectors(),
      this.fetchShareStructure(),
      this.fetchResolutions()
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

  /** Called when staff payment data has changed. */
  protected onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    this.setFilingData({
      ...this.getFilingData,
      priority: this.getStaffPayment.isPriority,
      waiveFees: (this.getStaffPayment.option === StaffPaymentOptions.NO_FEE)
    })
  }

  /** Called when alteration summary data has changed. */
  protected async onAlterationSummaryChanges (): Promise<void> {
    // update filing data with future effective field
    this.setFilingData({
      ...this.getFilingData,
      futureEffective: this.getEffectiveDateTime.isFutureEffective
    })
    // update the current fees for the filing
    this.setCurrentFees(await this.fetchFilingFees(
      FilingCodes.ALTERATION, this.getEntityType, this.getEffectiveDateTime.isFutureEffective
    ))
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
#done-button {
  width: 10rem;
}

// fix hard-coded whitespace inside shared component
// we want the same padding as "section-container py-6"
::v-deep #court-order {
  margin-top: 0 !important;
  padding-top: 0.5rem !important;
  padding-right: 1.875rem !important;
  padding-bottom: 1.5rem !important;
  padding-left: 0.375rem !important;
}
</style>
