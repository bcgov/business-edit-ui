<template>
  <section class="pb-10" id="restoration-view">
    <!-- Company Information page-->
    <v-slide-x-transition hide-on-leave>
      <div v-if="!isSummaryMode">
        <header>
          <h1>Conversion to Full Restoration</h1>
        </header>

        <YourCompany class="mt-10" />

        <CurrentDirectors class="mt-10" />
      </div>
    </v-slide-x-transition>

    <!-- Review and Certify page -->
    <v-slide-x-reverse-transition hide-on-leave>
      <div v-if="isSummaryMode && showFeeSummary">
        <header>
          <h1>Review and Certify</h1>
        </header>

        <RestorationSummary
          class="mt-10"
          :validate="getAppValidate"
          @haveChanges="onRestorationSummaryChanges()"
        />

        <DocumentsDelivery
          class="mt-10"
          sectionNumber="1."
          :validate="getAppValidate"
          @valid="setDocumentOptionalEmailValidity($event)"
        />

        <CertifySection
          class="mt-10"
          :sectionNumber="2."
          :validate="getAppValidate"
        />

        <StaffPayment
          class="mt-10"
          :sectionNumber="3."
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
import { GetFeatureFlag } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import { CertifySection, CurrentDirectors, DocumentsDelivery, StaffPayment, YourCompany }
  from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, EntitySnapshotIF, FlagsReviewCertifyIF, ResourceIF }
  from '@/interfaces/'
import { FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BcRestorationResource, BenRestorationResource, CccRestorationResource, UlcRestorationResource }
  from '@/resources/Restoration/'

@Component({
  components: {
    CertifySection,
    CurrentDirectors,
    DocumentsDelivery,
    RestorationSummary,
    StaffPayment,
    YourCompany
  }
})
export default class Restoration extends Mixins(
  CommonMixin,
  FeeMixin,
  FilingTemplateMixin
) {
  // Global getters
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter isSummaryMode!: boolean
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean
  @Getter isBcCompany!: boolean
  @Getter isBenefitCompany!: boolean
  @Getter isBcCcc!: boolean
  @Getter isBcUlcCompany!: boolean

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** The id of the restoration being edited. */
  get restorationId (): number {
    return +this.$route.query['restoration-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource file for a restoration filing. */
  get restorationResource (): ResourceIF {
    switch (true) {
      case this.isBcCompany: return BcRestorationResource
      case this.isBenefitCompany: return BenRestorationResource
      case this.isBcCcc: return CccRestorationResource
      case this.isBcUlcCompany: return UlcRestorationResource
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
    if (!this.isJestRunning && !GetFeatureFlag('restoration-ui-enabled')) {
      window.alert('Restorations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can extend or convert a limited restoration.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      if (this.restorationId) {
        // store the filing ID
        this.setFilingId(this.restorationId)

        // fetch draft restoration to resume
        const restorationFiling = await LegalServices.fetchFilingById(this.getBusinessId, this.restorationId)

        // do not proceed if this isn't a RESTORATION filing
        if (!restorationFiling.restoration) {
          throw new Error('Invalid Restoration filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (restorationFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid Restoration status')
        }

        // parse draft restoration filing and entity snapshot into store
        this.parseRestorationFiling(restorationFiling, entitySnapshot)
      } else {
        // parse just the entity snapshot into store
        this.parseEntitySnapshot(entitySnapshot)
      }

      if (!this.restorationResource) {
        throw new Error(`Invalid restoration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.restorationResource)

      // initialize Fee Summary data
      // *** TODO: need to select extension or conversion depending on sub-type
      const filingData = [this.restorationResource.filingData[0]]
      filingData.forEach(fd => {
        fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
      })
      this.setFilingData(filingData)

      // update the current fees for the Filing
      await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)

      // fetches the fee prices to display in the summary text
      await this.setFeePricesFromFilingData(true)

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

  /** Called when restoration summary data has changed. */
  protected async onRestorationSummaryChanges (): Promise<void> {
    // update filing data with future effective field
    const filingData = [...this.getFilingData]
    filingData.forEach(fd => {
      fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
    })
    this.setFilingData(filingData)
    // update the current fees for the filing
    await this.setCurrentFeesFromFilingData(this.getEffectiveDateTime.isFutureEffective)
    // update the fee prices to display in the text
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
