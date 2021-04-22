<template>
  <section class="pb-10">
    <!-- Company Information-->
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

        <AgreementType class="mt-10" v-if="false" />

        <Detail class="mt-10" v-if="false" />
      </div>
    </v-slide-x-transition>

    <!-- Review and Certify-->
    <v-slide-x-reverse-transition hide-on-leave>
      <div v-if="isSummaryMode && showFeeSummary">
        <header>
          <h1>Review and Certify</h1>
        </header>

        <section class="mt-6">
          <p>Review and certify the changes you are about to make to your company. Certain changes require an Alteration
           Notice which will incur a ${{feePrices.filingFees.toFixed(2)}} fee. Choosing an alteration date and time in
           the future will incur an additional ${{feePrices.futureEffectiveFees.toFixed(2)}} fee.</p>
        </section>

        <AlterationSummary
          class="mt-10"
          :validate="getAppValidate"
          @haveChanges="onAlterationSummaryChanges()"
        />

        <DocumentsDelivery
          class="mt-10"
          :validate="getAppValidate"
          @valid="setDocumentOptionalEmailValidity($event)"
        />

        <CertifySection
          class="mt-10"
          :validate="getAppValidate"
        />

        <!-- STAFF ONLY: Court Order and Plan of Arrangement -->
        <template v-if="isRoleStaff">
          <h2 class="mt-10">3. Court Order and Plan of Arrangement</h2>
          <p class="my-3 pb-2">
            If this filing is pursuant to a court order, enter the court order number. If this
            filing is pursuant to a plan of arrangement, enter the court order number and select
            Plan of Arrangement.
          </p>

          <div :class="{'invalid-section': invalidPoa}">
            <CourtOrderPoa
              id="court-order"
              :validate="getAppValidate"
              :draftCourtOrderNumber="getFileNumber"
              :hasDraftPlanOfArrangement="getHasPlanOfArrangement"
              :invalidSection="invalidPoa"
              @emitCourtNumber="setFileNumber($event)"
              @emitPoa="setHasPlanOfArrangement($event)"
              @emitValid="setValidFileNumber($event)"
            />
          </div>

          <StaffPayment
            class="mt-10"
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
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'

// Components
import { AlterationSummary, DocumentsDelivery } from '@/components/Summary'
import { YourCompany } from '@/components/YourCompany'
import { AgreementType } from '@/components/IncorporationAgreement'
import { CurrentDirectors } from '@/components/PeopleAndRoles'
import { CertifySection, Detail, StaffPayment } from '@/components/common'
import { ShareStructures } from '@/components/ShareStructure'
import { Articles } from '@/components/Articles'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'

// Mixins, Interfaces, Enums, etc
import { CommonMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins'
import {
  ActionBindingIF,
  BusinessSnapshotIF,
  EffectiveDateTimeIF,
  FilingDataIF,
  ValidFlagsIF,
  FeesIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { CorpTypeCd, FilingCodes, FilingStatus } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    AgreementType,
    AlterationSummary,
    Articles,
    CertifySection,
    CourtOrderPoa,
    CurrentDirectors,
    Detail,
    DocumentsDelivery,
    ShareStructures,
    StaffPayment,
    YourCompany
  }
})
export default class Alteration extends Mixins(CommonMixin, LegalApiMixin, FilingTemplateMixin, PayApiMixin) {
  // Global getters
  @Getter getAlterationValidFlags!: ValidFlagsIF
  @Getter getEntityType!: CorpTypeCd
  @Getter isSummaryMode!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getFilingData!: FilingDataIF
  @Getter getAppValidate!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean
  @Getter showFeeSummary!: boolean

  // Global actions
  @Action setFileNumber!: ActionBindingIF
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setValidFileNumber!: ActionBindingIF
  @Action setCurrentFees!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** The id of the alteration being edited. */
  private get alterationId (): number {
    return +this.$route.query['alteration-id'] || 0
  }

  /** The fees prices for Alteration. */
  private feePrices: FeesIF

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Check validity state, only when prompted by app. */
  private get invalidPoa (): boolean {
    return this.getAppValidate && !this.getAlterationValidFlags.isValidFileNum
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
    if (!this.isJestRunning && !getFeatureFlag('alteration-ui-enabled')) {
      window.alert('Alterations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard')
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
        await this.parseAlteration(alterationFiling, businessSnapshot)
      } else {
        // parse business data into store
        await this.parseBusinessSnapshot(businessSnapshot)
      }

      // initialize Fee Summary data
      this.setFilingData({
        filingTypeCode: FilingCodes.ALTERATION,
        entityType: this.getEntityType,
        priority: false
      })

      // update the current fees for the Filing
      this.setCurrentFees(await this.fetchCurrentFees())

      // fetches the fee prices to display in the text
      this.feePrices = await this.fetchFeePrices()

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches current fees for the Filing */
  private async fetchCurrentFees (): Promise<FeesIF> {
    const result = await Promise.resolve(this.fetchFilingFees(FilingCodes.ALTERATION,
      this.getEntityType, this.getEffectiveDateTime.isFutureEffective))
    if (!('filingFees' in result)) throw new Error('Failed to fetch current fees')
    return result
  }

  /** Fetches the Fee prices to display in the text */
  private async fetchFeePrices (): Promise<FeesIF> {
    const result = await Promise.resolve(this.fetchFilingFees(FilingCodes.ALTERATION,
      this.getEntityType, true))
    if (!('filingFees' in result)) throw new Error('Failed to fetch fees prices')
    return result
  }

  /** Fetches the business snapshot. */
  private async fetchBusinessSnapshot (): Promise<BusinessSnapshotIF> {
    const items = await Promise.all([
      this.fetchBusinessInfo(),
      this.fetchContactPoint(),
      this.fetchIncorporationAddress(),
      this.fetchNameTranslations(),
      this.fetchOrgPersons(),
      this.fetchShareStructure(),
      this.fetchResolutions()
    ])

    if (items.length !== 7) throw new Error('Failed to fetch business snapshot')

    return {
      businessInfo: items[0],
      contactPoint: items[1],
      incorporationAddress: items[2],
      nameTranslations: items[3],
      orgPersons: items[4],
      shareStructure: items[5],
      resolutions: items[6]
    }
  }

  /** Called when staff payment data has changed. */
  onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    this.setFilingData({
      ...this.getFilingData,
      priority: this.getStaffPayment.isPriority,
      waiveFees: this.getStaffPayment.option === StaffPaymentOptions.NO_FEE
    })
  }

  /** Called when alteration summary data has changed. */
  async onAlterationSummaryChanges (): Promise<void> {
    // update filing data with future effective field
    this.setFilingData({
      ...this.getFilingData,
      futureEffective: this.getEffectiveDateTime.isFutureEffective
    })
    // update the current fees for the filing
    this.setCurrentFees(await this.fetchCurrentFees())
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#done-button {
  width: 10rem;
}
</style>
