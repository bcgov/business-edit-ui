<template>
  <ViewWrapper>
    <section
      id="conversion-view"
      class="pb-10"
    >
      <!-- Business Information page-->
      <v-slide-x-transition hide-on-leave>
        <div v-if="!isSummaryMode || !showFeeSummary">
          <header>
            <h1>Record Conversion</h1>
          </header>

          <section class="mt-6">
            You must promptly file updates to your business information. Necessary fees will be applied as updates are
            made.
          </section>

          <YourCompanyWrapper class="mt-10">
            <div>
              <EntityName />
              <BusinessType />
            </div>
            <BusinessStartDate />
            <ConversionNOB />
            <OfficeAddresses />
            <FolioInformation />
          </YourCompanyWrapper>

          <PeopleAndRoles class="mt-10" />
        </div>
      </v-slide-x-transition>

      <!-- Review and Confirmm page -->
      <v-slide-x-reverse-transition hide-on-leave>
        <div v-if="isSummaryMode && showFeeSummary">
          <header>
            <h1>Review and Confirm</h1>
          </header>

          <section class="mt-6">
            <p id="intro-text">
              Changes were made to your business information that require a filing. Review and certify the changes you
              are about the make to your business.
            </p>
          </section>

          <ConversionSummary
            class="mt-10"
            :validate="getAppValidate"
          />

          <CompletingParty
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
          />
        </div>
      </v-slide-x-reverse-transition>
    </section>
  </ViewWrapper>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ConversionNOB, ConversionSummary } from '@/components/Conversion'
import { CompletingParty, BusinessStartDate, BusinessType, EntityName, FolioInformation, OfficeAddresses,
  PeopleAndRoles, YourCompanyWrapper } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { EntitySnapshotIF, ResourceIF } from '@/interfaces/'
import { FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { SpConversionResource, GpConversionResource } from '@/resources/Conversion/'
import { StatusCodes } from 'http-status-codes'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { useStore } from '@/store/store'

@Component({
  components: {
    BusinessStartDate,
    BusinessType,
    CompletingParty,
    ConversionNOB,
    ConversionSummary,
    EntityName,
    FolioInformation,
    OfficeAddresses,
    PeopleAndRoles,
    ViewWrapper,
    YourCompanyWrapper
  }
})
export default class Conversion extends Mixins(CommonMixin, FeeMixin, FilingTemplateMixin) {
  // Global getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) isPartnership!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSoleProp!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Global actions
  @Action(useStore) setCertifyStateValidity!: (x: boolean) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** The id of the conversion filing being edited. */
  get conversionId (): number {
    return +this.$route.query['conversion-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource object for a firm conversion filing. */
  get firmConversionResource (): ResourceIF {
    if (this.isPartnership) return GpConversionResource
    if (this.isSoleProp) return SpConversionResource
    return null
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can convert a record.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

      switch (entitySnapshot?.businessInfo?.legalType) {
        case CorpTypeCd.SOLE_PROP:
        case CorpTypeCd.PARTNERSHIP:
          break // acceptable types
        default:
          throw new Error(`Invalid entity type, must be a firm (Sole Prop or General Partnership)`)
      }

      if (this.conversionId) {
        // store the filing ID
        this.setFilingId(this.conversionId)

        // fetch draft conversion filing to resume
        const conversionFiling = await LegalServices.fetchFilingById(this.getBusinessId, this.conversionId)

        // do not proceed if this isn't a conversion  filing
        if (!conversionFiling.conversion) {
          throw new Error('Invalid conversion filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (conversionFiling.header?.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid conversion status')
        }

        // parse draft conversion filing and entity snapshot into store
        this.parseFirmConversionFiling(conversionFiling, entitySnapshot)
      } else {
        // parse just the entity snapshot into store
        this.parseEntitySnapshot(entitySnapshot)
      }

      if (!this.firmConversionResource) {
        throw new Error(`Invalid conversion resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.firmConversionResource)

      // initialize Fee Summary data
      this.setFilingData([this.firmConversionResource.filingData])

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData()

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData()

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // since this filing type has no Certify component,
    // just set its validity to True
    this.setCertifyStateValidity(true)

    // now that all data is loaded, wait for things to stabilize and reset flag
    this.$nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the entity snapshot. */
  private async fetchEntitySnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      LegalServices.fetchBusinessInfo(this.getBusinessId),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      LegalServices.fetchParties(this.getBusinessId)
    ])

    if (items.length !== 3) throw new Error('Failed to fetch entity snapshot')

    const addresses = await LegalServices.fetchAddresses(this.getBusinessId)
      .catch(reason => {
        // error message for business address has the pattern "FMXXXXXXX address not found"
        if (reason.response?.status === StatusCodes.NOT_FOUND &&
          reason.response?.data.message.includes('address')) return { businessOffice: null }
        throw new Error('Failed to fetch entity addresses')
      })

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses,
      orgPersons: items[2]
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
