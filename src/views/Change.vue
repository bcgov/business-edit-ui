<template>
  <ViewWrapper>
    <section
      id="change-view"
      class="pb-10"
    >
      <!-- Business Information page-->
      <v-slide-x-transition hide-on-leave>
        <div v-if="!isSummaryMode || !showFeeSummary">
          <header>
            <h1>Business Information</h1>
          </header>

          <section class="mt-6">
            You must promptly file updates to your business information. Necessary fees will be applied as
            updates are made.
          </section>

          <YourCompanyWrapper class="mt-10">
            <div>
              <EntityName />
              <BusinessType />
            </div>
            <BusinessStartDate />
            <NatureOfBusiness />
            <OfficeAddresses />
            <BusinessContactInfo />
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
              Changes were made to your business information that require a filing. Review and certify the
              changes you are about the make to your business.
            </p>
          </section>

          <ChangeSummary
            class="mt-10"
            :validate="getAppValidate"
          />

          <DocumentsDelivery
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
            @valid="setDocumentOptionalEmailValidity($event)"
          />

          <CompletingParty
            class="mt-10"
            sectionNumber="2."
            :validate="getAppValidate"
          />

          <!-- Transactional Folio Number is mutually exclusive with Staff Payment -->
          <TransactionalFolioNumber
            v-if="showTransactionalFolioNumber"
            class="mt-10"
            sectionNumber="3."
            :validate="getAppValidate"
          />

          <CertifySection
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '4.' : '3.'"
            :validate="getAppValidate"
            :disableEdit="!IsAuthorized(AuthorizedActions.EDITABLE_CERTIFY_NAME)"
          />

          <CourtOrderPoa
            v-if="IsAuthorized(AuthorizedActions.COURT_ORDER_POA)"
            class="mt-10"
            :sectionNumber="showTransactionalFolioNumber ? '5.' : '4.'"
            :autoValidation="getAppValidate"
          />

          <!-- Staff Payment is mutually exclusive with Transactional Folio Number -->
          <StaffPayment
            v-if="IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
            class="mt-10"
            :sectionNumber="IsAuthorized(AuthorizedActions.COURT_ORDER_POA) ? '5.' : '4.'"
            @haveChanges="onStaffPaymentChanges()"
          />
        </div>
      </v-slide-x-reverse-transition>
    </section>
  </ViewWrapper>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ChangeSummary } from '@/components/Change/'
import { BusinessContactInfo, BusinessStartDate, BusinessType, CertifySection, CompletingParty,
  CourtOrderPoa, DocumentsDelivery, EntityName, NatureOfBusiness, OfficeAddresses, PeopleAndRoles,
  StaffPayment, TransactionalFolioNumber, YourCompanyWrapper } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { EntitySnapshotIF, ResourceIF } from '@/interfaces/'
import { AuthorizedActions, FilingStatus, PartyTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { ChangeResourceSp, ChangeResourceGp, ChangeResourceSpOrganization } from '@/resources/Change/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { useStore } from '@/store/store'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    BusinessContactInfo,
    BusinessStartDate,
    BusinessType,
    CertifySection,
    ChangeSummary,
    CompletingParty,
    CourtOrderPoa,
    DocumentsDelivery,
    EntityName,
    NatureOfBusiness,
    OfficeAddresses,
    PeopleAndRoles,
    StaffPayment,
    TransactionalFolioNumber,
    ViewWrapper,
    YourCompanyWrapper
  }
})
export default class Change extends Mixins(CommonMixin, FeeMixin, FilingTemplateMixin) {
  // for template
  readonly IsAuthorized = IsAuthorized
  readonly AuthorizedActions = AuthorizedActions

  // Store getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) isEntityPartnership!: boolean
  @Getter(useStore) isEntitySoleProp!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Store actions
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** Whether the Transactional Folio Number section is shown. */
  get showTransactionalFolioNumber (): boolean {
    // mutually exclusive with Staff Payment
    return !IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
  }

  /** The id of the change filing being edited. */
  get changeId (): number {
    return +this.$route.query['change-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource object for a firm change filing. */
  get firmChangeResource (): ResourceIF {
    const isOfficerOrganization = this.getOrgPeople[0]?.officer?.partyType === PartyTypes.ORGANIZATION
    if (this.isEntityPartnership) return ChangeResourceGp
    if (this.isEntitySoleProp && isOfficerOrganization) return ChangeResourceSpOrganization
    if (this.isEntitySoleProp) return ChangeResourceSp
    return null
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if not authorized
    if (!IsAuthorized(AuthorizedActions.FIRM_CHANGE_FILING)) {
      window.alert('You are not authorized to use Change filings.')
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

      if (this.changeId) {
        // store the filing ID
        this.setFilingId(this.changeId)

        // fetch draft change filing to resume
        const changeFiling = await LegalServices.fetchFilingById(this.getBusinessId, this.changeId)

        // do not proceed if this isn't a change filing
        if (!changeFiling.changeOfRegistration) {
          throw new Error('Invalid change filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (changeFiling.header?.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid change status')
        }

        // parse draft change filing and entity snapshot into store
        this.parseChangeRegFiling(changeFiling, entitySnapshot)
      } else {
        // parse just the entity snapshot into store
        this.parseEntitySnapshot(entitySnapshot)
      }

      if (!this.firmChangeResource) {
        throw new Error(`Invalid change resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.firmChangeResource)

      // initialize Fee Summary data
      this.setFilingData([this.firmChangeResource.filingData as any])

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData()

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData()

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
      LegalServices.fetchParties(this.getBusinessId)
    ])

    if (items.length !== 4) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      orgPersons: items[3]
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
