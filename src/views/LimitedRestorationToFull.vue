<template>
  <ViewWrapper>
    <section class="pb-10" id="limited-restoration-full">
      <!-- Company Information page-->
      <v-slide-x-transition hide-on-leave>
        <div v-if="!isSummaryMode" id="question_container">
          <header>
            <h1>Conversion to Full Restoration</h1>
          </header>

          <QuestionWrapper
            id="applicant-relationship"
            title="Applicant Relationship"
            subtitle="Please select applicant's relationship to the company at the time the company was dissolved:">
            <RelationshipsPanel
              class="ml-4 pl-5 pt-1"
            />
          </QuestionWrapper>

          <QuestionWrapper
            id="applicant-information"
            title="Applicant Information"
          >
            <PeopleAndRoles />
          </QuestionWrapper>

          <QuestionWrapper
            id="approval-type"
            title="Approval Type">
            <ApprovalType class="white-background px-9 py-4 mt-4" />
          </QuestionWrapper>

          <YourCompany class="mt-10" />

        </div>
      </v-slide-x-transition>

      <!-- Review and Certify page -->
      <v-slide-x-reverse-transition hide-on-leave>
        <div v-if="isSummaryMode && showFeeSummary">
          <header>
            <h1>Review and Certify</h1>
          </header>

          <div class="document-info py-4">
            Review and certify the information in your application. If you need to change or complete anything,
            return to the previous step to make the necessary change.
          </div>

          <!-- Applicant list -->
          <v-card id="people-and-roles-vcard" flat class="mt-6">
            <!-- Header -->
            <div class="section-container header-container">
              <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
              <label class="font-weight-bold pl-2">{{ orgPersonLabel }} Information</label>
            </div>
            <div no-gutters class="mt-4 section-container">
              <ListPeopleAndRoles
                :isSummaryView="true"
                :showDeliveryAddressColumn="false"
                :showRolesColumn="false"
                :showEmailColumn="true"
              />
            </div>
          </v-card>

          <YourCompanySummary class="mt-10" />

          <DocumentsDelivery
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
            :userEmailOptional="userEmailOptional"
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
  </ViewWrapper>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { v4 as uuidv4 } from 'uuid'
import { GetFeatureFlag } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { CertifySection, CurrentDirectors, DocumentsDelivery, PeopleAndRoles, StaffPayment,
  YourCompany } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import {
  ActionBindingIF,
  ResourceIF,
  RestorationFilingIF,
  FilingDataIF,
  OrgPersonIF,
  EntitySnapshotIF } from '@/interfaces/'
import { BcRestorationResource, BenRestorationResource, CccRestorationResource, UlcRestorationResource }
  from '@/resources/LimitedRestorationToFull/'
import { FilingStatus, RoleTypes } from '@/enums/'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import CourtOrderPoa from '@/components/common/CourtOrderPoa.vue'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import { FeeSummary as FeeSummaryShared } from '@bcrs-shared-components/fee-summary/'
import QuestionWrapper from '@/components/common/QuestionWrapper.vue'
import ListPeopleAndRoles from '@/components/common/PeopleAndRoles/ListPeopleAndRoles.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'

@Component({
  components: {
    ApprovalType,
    CertifySection,
    CourtOrderPoa,
    CurrentDirectors,
    DocumentsDelivery,
    FeeSummaryShared,
    LimitedRestorationPanel,
    ListPeopleAndRoles,
    PeopleAndRoles,
    QuestionWrapper,
    RelationshipsPanel,
    RestorationSummary,
    StaffPayment,
    ViewWrapper,
    YourCompany,
    YourCompanySummary
  },
  mixins: [
    CommonMixin,
    FeeMixin,
    FilingTemplateMixin
  ]
})
export default class LimitedRestorationToFull extends Vue {
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
  @Action setStateFilingRestoration!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean
  @Prop({ default: 0 }) readonly restorationId!: number

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

  /** Resource getters. */
  get orgPersonLabel (): string {
    return this.getResource.changeData?.orgPersonInfo.orgPersonLabel
  }

  get userEmailOptional (): boolean {
    return this.getResource.userEmailOptional
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

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
      const stateFiling = entitySnapshot.businessInfo.stateFiling
      const filing = stateFiling && await LegalServices.fetchFiling(stateFiling)

      if (!filing) {
        throw new Error(`Invalid fetched stateFiling = ${this.getBusinessId}`)
      }

      const parties = filing.restoration?.parties || []

      // find first applicant from fetched parties
      const applicant = parties.find(
        orgPerson => orgPerson.roles.some(role => role.roleType === RoleTypes.APPLICANT)
      )

      if (applicant === undefined) {
        throw new Error(`Applicant not found for ${this.getBusinessId}`)
      }

      // set applicant orgPerson
      entitySnapshot.orgPersons = this.parseApplicantOrgPerson(applicant)

      this.setEntitySnapshot(entitySnapshot)

      // Set the previously filed limited restoration in the store.
      await this.setStateFilingRestoration()

      // parse draft restoration filing into store
      this.parseRestorationFiling(restorationFiling)

      if (!this.restorationResource) {
        throw new Error(`Invalid restoration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.restorationResource)

      // initialize Fee Summary data
      this.setFilingData([this.restorationResource.filingData])

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

  // build applicant orgPerson and assign id (uuid)
  private parseApplicantOrgPerson (applicant: OrgPersonIF): OrgPersonIF[] {
    const applicantOrgPerson: Array<OrgPersonIF> = []
    applicantOrgPerson.push({
      deliveryAddress: applicant.deliveryAddress,
      mailingAddress: applicant.mailingAddress,
      officer: {
        email: applicant.officer.email,
        firstName: applicant.officer.firstName,
        lastName: applicant.officer.lastName,
        middleName: applicant.officer.middleName,
        organizationName: applicant.officer.organizationName,
        partyType: applicant.officer.partyType,
        id: uuidv4()
      },
      roles: applicant.roles
    })

    return applicantOrgPerson
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
