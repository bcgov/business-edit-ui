<template>
  <section class="pb-10" id="restoration-view">
    <!-- Company Information page-->
    <v-slide-x-transition hide-on-leave>
      <div v-if="!isSummaryMode">
        <header>
          <h1>{{ entityTitle }}</h1>
        </header>

        <PeopleAndRoles class="mt-10" />

        <YourCompany class="mt-10" />
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
        />

        <YourCompanySummary class="mt-10" />

        <v-card id="people-and-roles-vcard" flat class="mt-6">
          <!-- Header -->
          <div class="section-container header-container">
            <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
            <label class="font-weight-bold pl-2">{{ orgPersonLabel }} Informaton</label>
          </div>
          <ListPeopleAndRoles
            :isSummaryView="true"
            :showDeliveryAddressColumn="false"
            :showRolesColumn="false"
            :showEmailColumn="true"
          />
        </v-card>

        <DocumentsDelivery
          class="mt-10"
          sectionNumber="1."
          :validate="getAppValidate"
          @valid="setDocumentOptionalEmailValidity($event)"
        />

        <CertifySection
          class="mt-10"
          sectionNumber="2."
          :validate="getAppValidate"
        />

        <StaffPayment
          class="mt-10"
          sectionNumber="3."
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
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { v4 as uuidv4 } from 'uuid'
import { GetFeatureFlag } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { CertifySection, DocumentsDelivery, PeopleAndRoles, ListPeopleAndRoles, StaffPayment,
  YourCompany } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF, FlagsReviewCertifyIF, ResourceIF,
  RestorationFilingIF } from '@/interfaces/'
import { FilingStatus, FilingTypes, RestorationTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BcRestorationResource, BenRestorationResource, CccRestorationResource, UlcRestorationResource }
  from '@/resources/Restoration/'
import { FilingDataIF } from '@bcrs-shared-components/interfaces'

@Component({
  components: {
    CertifySection,
    DocumentsDelivery,
    PeopleAndRoles,
    ListPeopleAndRoles,
    RestorationSummary,
    StaffPayment,
    YourCompany,
    YourCompanySummary
  },
  mixins: [
    CommonMixin,
    FeeMixin,
    FilingTemplateMixin
  ]
})
export default class Restoration extends Vue {
  // Global getters
  @Getter isSummaryMode!: boolean
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean
  @Getter isBcCompany!: boolean
  @Getter isBenefitCompany!: boolean
  @Getter isBcCcc!: boolean
  @Getter isBcUlcCompany!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isLimitedExtendRestorationFiling!: boolean
  @Getter isLimitedConversionRestorationFiling!: boolean
  @Getter getResource!: ResourceIF

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

  /** The resource object for a restoration filing. */
  get restorationResource (): ResourceIF {
    switch (true) {
      case this.isBcCompany: return BcRestorationResource
      case this.isBenefitCompany: return BenRestorationResource
      case this.isBcCcc: return CccRestorationResource
      case this.isBcUlcCompany: return UlcRestorationResource
    }
    return null // should never happen
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

    // fetch the restoration filing
    try {
      // do not proceed if we don't have the necessary query param
      if (!this.restorationId) {
        throw new Error('Invalid restoration filing ID')
      }

      // store the filing ID
      this.setFilingId(this.restorationId)

      // fetch draft restoration to resume
      const restorationFiling =
        await LegalServices.fetchFilingById(this.getBusinessId, this.restorationId) as RestorationFilingIF

      // do not proceed if this isn't a RESTORATION filing
      if (!restorationFiling.restoration) {
        throw new Error('Invalid Restoration filing')
      }

      // do not proceed if this isn't a DRAFT filing
      if (restorationFiling.header?.status !== FilingStatus.DRAFT) {
        throw new Error('Invalid Restoration status')
      }

      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      // set Applicant info in entitySnapshot
      const stateFiling = entitySnapshot.businessInfo.stateFiling
      const filing = stateFiling && await LegalServices.fetchFiling(stateFiling)
      entitySnapshot.orgPersons = filing.restoration.parties as OrgPersonIF
      entitySnapshot.orgPersons.forEach(o => {
        o.officer.id = uuidv4()
      })

      // verify that business is in Limited Restoration status
      // (will throw on error)
      await this.verifyLimitedRestorationStatus(entitySnapshot.businessInfo)

      // parse draft restoration filing and entity snapshot into store
      this.parseRestorationFiling(restorationFiling, entitySnapshot)

      if (!this.restorationResource) {
        throw new Error(`Invalid restoration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.restorationResource)

      // initialize Fee Summary data
      let filingData: FilingDataIF[] = []
      if (this.isLimitedExtendRestorationFiling) filingData = [this.restorationResource.filingData[0]]
      if (this.isLimitedConversionRestorationFiling) filingData = [this.restorationResource.filingData[1]]

      filingData.forEach(fd => {
        fd.futureEffective = this.getEffectiveDateTime.isFutureEffective
      })
      this.setFilingData(filingData)

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData()

      // update the fee prices for the notice changes
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
      LegalServices.fetchDirectors(this.getBusinessId)
    ])

    if (items.length !== 5) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      nameTranslations: items[3],
      orgPersons: items[4]
    } as EntitySnapshotIF
  }

  /** Verifies that the business is in Limited Restoration status. */
  private async verifyLimitedRestorationStatus (businessInfo: BusinessInformationIF): Promise<void> {
    // fetch state filing
    const stateFiling = businessInfo.stateFiling
    const filing = stateFiling && await LegalServices.fetchFiling(stateFiling)
    const type = filing?.header?.name as FilingTypes
    // FUTURE: enable code below when limited restorations can be filed (ticket 14641)

    // // Verify state filing. It should be a Limited Restoration filing or a
    // // Limited Restoration Extension filing. If the expiry date has passed
    // // then the state filing should be a dissolution.
    // if (filing?.name === FilingTypes.RESTORATION) {
    //   if (filing?.restoration?.type === RestorationTypes.LIMITED) return // all good
    //   if (filing?.restoration?.type === RestorationTypes.LTD_EXTEND) return // all good
    // }
    // throw new Error('Business is not in Limited Restoration status')
  }

  /** Resource getters. */
  get orgPersonLabel (): string {
    return this.getResource.changeData?.orgPersonInfo.orgPersonLabel
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
@import '@/assets/styles/theme.scss';
#done-button {
  width: 10rem;
}

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}
</style>
