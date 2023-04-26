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

          <!-- STAFF ONLY: Court Order/Plan of Arrangement and Staff Payment -->
          <template v-if="isRoleStaff">
            <CourtOrderPoa
              class="mt-10"
              :sectionNumber="showTransactionalFolioNumber ? '4.' : '3.'"
              :autoValidation="getAppValidate"
            />

            <StaffPayment
              class="mt-10"
              :sectionNumber="showTransactionalFolioNumber ? '5.' : '4.'"
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
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { GetFeatureFlag } from '@/utils/'
import { AlterationSummary, Articles } from '@/components/Alteration/'
import { BusinessContactInfo, BusinessType, CertifySection, CourtOrderPoa, CurrentDirectors,
  DocumentsDelivery, EntityName, FolioInformation, OfficeAddresses, RecognitionDateTime,
  ShareStructures, StaffPayment, TransactionalFolioNumber, YourCompanyWrapper }
  from '@/components/common/'
import { NameTranslation } from '@/components/common/YourCompany/NameTranslations/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, CertifyIF, EffectiveDateTimeIF, EntitySnapshotIF, FilingDataIF,
  ResourceIF } from '@/interfaces/'
import { FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BcAlterationResource, BenAlterationResource, CccAlterationResource, UlcAlterationResource }
  from '@/resources/Alteration/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { useStore } from '@/store/store'

@Component({
  components: {
    AlterationSummary,
    Articles,
    BusinessContactInfo,
    BusinessType,
    CertifySection,
    CourtOrderPoa,
    CurrentDirectors,
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
  },
  mixins: [CommonMixin, FeeMixin, FilingTemplateMixin]
})
export default class Alteration extends Vue {
  // Global getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingData!: FilingDataIF[]
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) isBcCcc!: boolean
  @Getter(useStore) isBcCompany!: boolean
  @Getter(useStore) isBcUlcCompany!: boolean
  @Getter(useStore) isBenefitCompany!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Global actions
  @Action(useStore) setCertifyState!: ActionBindingIF
  @Action(useStore) setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action(useStore) setFilingData!: ActionBindingIF
  @Action(useStore) setFilingId!: ActionBindingIF
  @Action(useStore) setHaveUnsavedChanges!: ActionBindingIF
  @Action(useStore) setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

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

  /** The resource object for an alteration filing. */
  get alterationResource (): ResourceIF {
    switch (true) {
      case this.isBcCompany: return BcAlterationResource
      case this.isBenefitCompany: return BenAlterationResource
      case this.isBcCcc: return CccAlterationResource
      case this.isBcUlcCompany: return UlcAlterationResource
    }
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
    if (!this.isJestRunning && !GetFeatureFlag('alteration-ui-enabled')) {
      window.alert('Alterations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

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
      LegalServices.fetchNameTranslations(this.getBusinessId),
      LegalServices.fetchDirectors(this.getBusinessId),
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
  protected async onAlterationSummaryChanges (): Promise<void> {
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
