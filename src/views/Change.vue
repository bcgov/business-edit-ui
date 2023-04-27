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
            :disableEdit="!(isRoleStaff || isSbcStaff)"
          />

          <!-- STAFF ONLY: Court Order/Plan of Arrangement and Staff Payment -->
          <template v-if="isRoleStaff">
            <CourtOrderPoa
              class="mt-10"
              :sectionNumber="showTransactionalFolioNumber ? '5.' : '4.'"
              :autoValidation="getAppValidate"
            />

            <StaffPayment
              class="mt-10"
              :sectionNumber="showTransactionalFolioNumber ? '6.' : '5.'"
              @haveChanges="onStaffPaymentChanges()"
            />
          </template>
        </div>
      </v-slide-x-reverse-transition>
    </section>
  </ViewWrapper>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { GetFeatureFlag } from '@/utils/'
import { ChangeSummary } from '@/components/Change/'
import { BusinessContactInfo, BusinessStartDate, BusinessType, CertifySection, CompletingParty, CourtOrderPoa,
  DocumentsDelivery, EntityName, NatureOfBusiness, OfficeAddresses, PeopleAndRoles, StaffPayment,
  TransactionalFolioNumber, YourCompanyWrapper } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, CertifyIF, EntitySnapshotIF, OrgPersonIF, ResourceIF } from '@/interfaces/'
import { FilingStatus, PartyTypes } from '@/enums/'
import { SessionStorageKeys } from '@/sbc-common-components/src/util/constants'
import { SpChangeResource, GpChangeResource, SpOrganizationChangeResource } from '@/resources/Change/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/bcrs-shared-components/corp-type-module'

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
  },
  mixins: [CommonMixin, FeeMixin, FilingTemplateMixin]
})
export default class Change extends Vue {
  // Global getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getOrgPeople!: OrgPersonIF[]
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) isPartnership!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSbcStaff!: boolean
  @Getter(useStore) isSoleProp!: boolean
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

  /** Whether the Transactional Folio Number section is shown. */
  get showTransactionalFolioNumber (): boolean {
    return (this.isPremiumAccount && !this.isRoleStaff)
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
    if (this.isPartnership) return GpChangeResource
    if (this.isSoleProp && isOfficerOrganization) return SpOrganizationChangeResource
    if (this.isSoleProp) return SpChangeResource
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
    if (!this.isJestRunning && !GetFeatureFlag('change-ui-enabled')) {
      window.alert('Change filings are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()

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
      this.setFilingData([this.firmChangeResource.filingData])

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData()

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData()

      // set current profile name to store for field pre population
      // do this only if we are not staff
      if (!(this.isRoleStaff || this.isSbcStaff)) {
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

    // WORK-AROUND WARNING !!!
    // convert orgPersons from "middleInitial" to "middleName"
    const orgPersons = items[3].map(orgPerson => {
      const middleInitial = orgPerson.officer['middleInitial']
      if (middleInitial !== undefined) {
        orgPerson.officer.middleName = middleInitial
        delete orgPerson.officer['middleInitial']
      }
      return orgPerson
    })

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      orgPersons
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
