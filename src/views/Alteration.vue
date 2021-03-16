<template>
  <section>
    <!-- Profile View -->
    <template v-if="!isSummaryMode">
      <header>
        <h1>Company Information</h1>
      </header>

      <section class="mt-6">
        <p>You are legally obligated to keep your company information up to date. Necessary fees will be applied as
          updates are made.</p>
      </section>

      <your-company class="mt-10" />

      <current-directors class="mt-10" />

      <share-structures class="mt-10" />

      <articles class="mt-10" />

      <agreement-type class="mt-10" />

      <detail class="mt-10" />

      <staff-payment
        class="mt-10"
        @haveChanges="onStaffPaymentChanges()"
      />
    </template>

    <!-- Summary View -->
    <template v-else>
      <header>
        <h1>Review and Certify</h1>
      </header>
      <section class="mt-6">
        <p>Review and certify the changes you are about to make to your company. Certain changes require an Alteration
          Notice which will incur a $100.00 Fee.</p>
      </section>

      <!-- FUTURE: set `pleaseValidate` when user clicks File and Pay -->
      <alteration-summary
        class="mt-10"
        :pleaseValidate="true"
        @haveChanges="onAlterationSummaryChanges()"
      />

      <documents-delivery
       class="mt-10"
       :pleaseValidate="true"
        @valid="setDocumentOptionalEmailValidity($event)"
      />

      <certify-section
       class="mt-10"
       :pleaseValidate="true"
      />

      <!-- STAFF ONLY: Court Order and Plan of Arrangement -->
      <template>
        <header>
          <h2>x. Court Order and Plan of Arrangement</h2>
        </header>
        <p class="my-2">If this filing is pursuant to a court order, enter the court order number. If this filing
          is pursuant to a plan of arrangement, <br>enter the court order number and select Plan of Arrangement.</p>
        {{getAlterationsValidity}}
        <v-btn @click="test = !test">
          Validate
        </v-btn>
        <court-order-poa
          :validate="test"
          @emitCourtNumber="setCourtOrderNumber($event)"
          @emitPoa="setPlanOfArrangement($event)"
          @emitValid="setValidCourtNum($event)"
        />
      </template>

    </template>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils'

// Components
import { AlterationSummary, NoFeeSummary, DocumentsDelivery } from '@/components/Summary'
import { YourCompany } from '@/components/YourCompany'
import { AgreementType } from '@/components/IncorporationAgreement'
import { CurrentDirectors } from '@/components/PeopleAndRoles'
import { CertifySection, CompletingParty, CourtOrderPoa, Detail, StaffPayment } from '@/components/common'
import { ShareStructures } from '@/components/ShareStructure'
import { Articles } from '@/components/Articles'

// Mixins, Interfaces, Enums, etc
import { CommonMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, BusinessSnapshotIF, EffectiveDateTimeIF, FilingDataIF } from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { EntityTypes, FilingCodes, FilingStatus } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    AgreementType,
    AlterationSummary,
    CertifySection,
    CompletingParty,
    CourtOrderPoa,
    Detail,
    DocumentsDelivery,
    NoFeeSummary,
    CurrentDirectors,
    Articles,
    ShareStructures,
    StaffPayment,
    YourCompany
  }
})
export default class Alteration extends Mixins(CommonMixin, LegalApiMixin, FilingTemplateMixin) {
  private test = false
  // Global getters
  @Getter getAlterationsValidity!: string
  @Getter getEntityType!: EntityTypes
  @Getter isSummaryMode!: boolean
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getFilingData!: FilingDataIF
  @Getter getDocumentOptionalEmail!: string

  // Global actions
  @Action setCourtOrderNumber!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setPlanOfArrangement!: ActionBindingIF
  @Action setSummaryMode!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setValidCourtNum!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** The id of the alteration being edited. */
  private get alterationId (): number {
    return +this.$route.query['alteration-id'] || 0
  }

  /** True if user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
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
      this.redirectEntityDashboard()
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

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveChanges(false))
  }

  /** Fetches the business snapshot. */
  private async fetchBusinessSnapshot (): Promise<BusinessSnapshotIF> {
    const items = await Promise.all([
      this.fetchBusinessInfo(),
      this.fetchContactPoint(),
      this.fetchIncorporationAddress(),
      this.fetchNameTranslations(),
      this.fetchOrgPersons(),
      this.fetchShareStructure()
    ])

    if (items.length !== 6) throw new Error('Failed to fetch business snapshot')

    return {
      businessInfo: items[0],
      contactPoint: items[1],
      incorporationAddress: items[2],
      nameTranslations: items[3],
      orgPersons: items[4],
      shareStructure: items[5]
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
  onAlterationSummaryChanges (): void {
    // update filing data with future effective field
    this.setFilingData({
      ...this.getFilingData,
      futureEffective: this.getEffectiveDateTime.isFutureEffective
    })
  }

  /** Redirects browser to Entity Dashboard. */
  private redirectEntityDashboard (): void {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.getBusinessId)
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void { }

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void { }
}
</script>
