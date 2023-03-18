<template>
  <v-container class="view-container my-8 py-0">
    <v-row>
      <v-col cols="9" class="left-side">
        <section class="pb-10" id="restoration-view">
          <!-- Company Information page-->
          <v-slide-x-transition hide-on-leave>
            <div v-if="!isSummaryMode">
              <header>
                <h1>Limited Restoration Extension</h1>
              </header>
              <QuestionWrapper>
                <PeopleAndRoles class="mt-10"

                />
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

              <RestorationSummary
                class="mt-10"
                :validate="getAppValidate"
              />

              <YourCompanySummary class="mt-10" />

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
      </v-col>

      <v-col cols="3" class="right-side">
        <affix v-if="showFeeSummary"
               relative-element-selector=".left-side"
               :offset="{ top: 86, bottom: 12 }"
        >
          <v-expand-transition>
<!--            <FeeSummaryShared-->
<!--              :filingData="getFilingData"-->
<!--              :payApiUrl="payApiUrl"-->
<!--              :isLoading="isBusySaving"-->
<!--              :hasConflicts="isConflictingLegalType && getNameRequestNumber"-->
<!--              :confirmLabel="feeSummaryConfirmLabel"-->
<!--              :errorMessage="feeSummaryError"-->
<!--              :isSummaryMode="isSummaryMode"-->
<!--              @action="handleFeeSummaryActions($event)"-->
<!--            />-->
          </v-expand-transition>
        </affix>
      </v-col>
      <!-- end of v-col -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import { GetFeatureFlag } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { CertifySection, DocumentsDelivery, PeopleAndRoles, ListPeopleAndRoles, StaffPayment,
  YourCompany } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import {
  ActionBindingIF, BusinessInformationIF, EntitySnapshotIF, FlagsReviewCertifyIF, ResourceIF,
  RestorationFilingIF, OrgPersonIF, EffectiveDateTimeIF
} from '@/interfaces/'
import { FilingStatus, FilingTypes, RestorationTypes, RoleTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { BcRestorationResource, BenRestorationResource, CccRestorationResource, UlcRestorationResource }
  from '@/resources/Restoration/'
import { FilingDataIF } from '@bcrs-shared-components/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import QuestionWrapper from '@/components/common/QuestionWrapper.vue'
import { mapActions, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    QuestionWrapper,
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
  ],
  methods: {
    ...mapActions([
      'fetchBusinessInfo',
      'fetchAuthentication',
      'fetchAddresses',
      'fetchNameTranslations',
      'fetchDirectors',
      'fetchFilingByIds',
      'fetchStateFiling'
    ]),
    ...mapMutations([
      'setRestorationFiling'
    ])
  }
})
export default class LimitedRestorationExtension extends Vue {
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
  @Getter getEntityType!: CorpTypeCd
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean
  @Prop({ required: true }) readonly restorationId!: number

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
      // fetch draft restoration and save to store
      this.fetchFilingByIds({ businessId: this.getBusinessId, filingId: this.restorationId })
        .then(response => {
          // do not proceed if this isn't a RESTORATION filing
          if (!response.restoration) {
            throw new Error('Invalid Restoration filing')
          }
          if (response.header?.status !== FilingStatus.DRAFT) {
            throw new Error('Invalid Restoration status')
          }
          this.setRestorationFiling(response)
        })
        .catch(error => {
          throw new Error('Error from API ' + error)
        })

      // fetch data required and commit to store
      await Promise.all([
        this.fetchBusinessInfo(this.getBusinessId),
        this.fetchAuthentication(this.getBusinessId),
        this.fetchAddresses(this.getBusinessId),
        this.fetchNameTranslations(this.getBusinessId),
        this.fetchDirectors(this.getBusinessId)
      ]).then(() => {
        this.fetchStateFiling()
          .catch(() => {
            throw new Error(`Invalid fetched stateFiling = ${this.getBusinessId}`)
          })
      }).catch(() => {
        throw new Error(`Unable to retrieve required data`)
      })

      /**
       * Parses a draft Restoration filing into the store.
       * @param filing the restoration filing
       * @param entitySnapshot the latest entity snapshot
       */
      //   parseRestorationFiling (filing: RestorationFilingIF, entitySnapshot: EntitySnapshotIF): void {
      //     // store Entity Snapshot
      //     this.setEntitySnapshot(entitySnapshot)
      //
      //     // store Entity Type
      //     this.setEntityType(filing.restoration.business?.legalType || entitySnapshot.businessInfo.legalType)
      //
      //     // store Business Information
      //     this.setBusinessInformation({
      //       ...entitySnapshot.businessInfo,
      //       ...filing.business,
      //       ...filing.restoration?.business
      //     })
      //
      //     // restore Restoration data
      //     this.setRestorationType(filing.restoration.type)
      //     this.setRestorationExpiry(filing.restoration.expiry || null)
      //
      //     // store Name Request data
      //     this.setNameRequest(cloneDeep(
      //       filing.restoration.nameRequest ||
      //       {
      //         legalType: entitySnapshot.businessInfo.legalType,
      //         legalName: entitySnapshot.businessInfo.legalName,
      //         nrNumber: entitySnapshot.businessInfo.nrNumber
      //       }
      //     ))
      //
      //     // store Name Translations
      //     this.setNameTranslations(cloneDeep(
      //       this.mapNameTranslations(filing.restoration.nameTranslations) ||
      //       this.mapNameTranslations(entitySnapshot.nameTranslations) ||
      //       []
      //     ))
      //
      //     // store Office Addresses
      //     this.setOfficeAddresses(cloneDeep(
      //       filing.restoration.offices ||
      //       entitySnapshot.addresses
      //     ))
      //
      //     // store People And Roles
      //     this.setPeopleAndRoles(cloneDeep(
      //       filing.restoration.parties ||
      //       entitySnapshot.orgPersons
      //     ))
      //
      //     // store current Business Contact
      //     this.setBusinessContact({ ...entitySnapshot.authInfo.contact })
      //
      //     // store Certify State
      //     this.setCertifyState({
      //       valid: false,
      //       certifiedBy: filing.header.certifiedBy
      //     })
      //
      //     // store Folio Number
      //     // FUTURE: should we store correction.folioNumber instead?
      //     this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')
      //
      //     // if Transactional Folio Number was saved then store it
      //     if (filing.header.isTransactionalFolioNumber) {
      //     this.setTransactionalFolioNumber(filing.header.folioNumber)
      //   }
      //
      //   // store Document Optional Email
      //   this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')
      //
      //   // store File Number and POA
      //   this.setFileNumber(filing.restoration.courtOrder?.fileNumber)
      //   this.setHasPlanOfArrangement(filing.restoration.courtOrder?.hasPlanOfArrangement)
      //
      //   // store Staff Payment
      //   this.storeStaffPayment(filing)
      // }

      if (!this.restorationResource) {
        throw new Error(`Invalid restoration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.restorationResource)

      // initialize Fee Summary data
      let filingData: FilingDataIF[] = []
      if (this.isLimitedExtendRestorationFiling) filingData = [this.restorationResource.filingData[0]]
      if (this.isLimitedConversionRestorationFiling) filingData = [this.restorationResource.filingData[1]]

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
