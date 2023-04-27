<template>
  <div
    id="company-name-section"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <!-- Business/Company Name -->
    <v-row
      no-gutters
      class="mt-4"
    >
      <v-col
        cols="3"
        class="pr-2"
      >
        <label :class="{'error-text': invalidSection}">
          <strong>{{ getResource.entityReference }} Name</strong>
        </label>
        <v-col md="1">
          <v-chip
            v-if="hasCompanyNameChanged || (hasBusinessNameChanged && (isAlterationFiling || isFirmChangeFiling ||
              isFirmConversionFiling || isSpecialResolutionFiling))"
            id="corrected-lbl"
            x-small
            label
            color="primary"
            text-color="white"
          >
            {{ getEditedLabel }}
          </v-chip>
        </v-col>
      </v-col>

      <!-- Display Mode -->
      <template v-if="!isEditingNames">
        <v-col cols="7">
          <div class="company-name font-weight-bold text-uppercase">
            {{ companyName }}
          </div>

          <!-- Business Type Info -->
          <template
            v-if="!hasNewNr && hasBusinessNameChanged && (isAlterationFiling || isFirmChangeFiling ||
              isFirmConversionFiling)"
          >
            <div class="company-info mt-4">
              <span class="subtitle">Business Type: </span>
              <span class="info-text">{{ GetCorpFullDescription(getEntityType) }}</span>
            </div>
            <div class="info-text pt-3">
              <span>The name of this business will be the current Incorporation Number followed by "B.C. Ltd."</span>
            </div>
          </template>

          <!-- Name Request Info -->
          <template v-if="hasNewNr">
            <div class="company-name mt-2">
              {{ getNameRequestNumber || 'Unknown' }}
            </div>
            <div class="company-info mt-4">
              <span class="subtitle">Business Type: </span>
              <span
                :class="{ 'has-conflict': isConflictingLegalType}"
                class="info-text"
              >{{ GetCorpFullDescription(getNameRequest.legalType) }}
              </span>
              <v-tooltip
                v-if="isConflictingLegalType"
                location="top"
                content-class="top-tooltip"
                transition="fade-transition"
                nudge-right="3"
              >
                <template #activator="{ on }">
                  <v-icon
                    color="error"
                    size="small"
                    v-on="on"
                  >
                    mdi-alert
                  </v-icon>
                </template>
                <span>Business Types do not match. The Name Request type must match the business type before
                  you can continue.</span>
              </v-tooltip>
            </div>
            <div class="company-info">
              <span class="subtitle">Request Type: </span>
              <span class="info-text">{{ getNrRequestDesc(getNameRequest.requestType) }}</span>
            </div>
            <div class="company-info">
              <span class="subtitle">Expiry Date: </span>
              <span class="info-text">{{ nrExpiryDate || 'Unknown' }}</span>
            </div>
            <div class="company-info">
              <span class="subtitle">Status: </span>
              <span class="info-text text-capitalize">{{ nrStatus }}</span>
            </div>
          </template>
        </v-col>

        <!-- Actions -->
        <v-col
          v-if="showNameOptions"
          cols="2"
          class="my-n2"
        >
          <div class="actions mr-4">
            <!-- FUTURE: only show buttons for named company -->
            <v-btn
              v-if="hasCompanyNameChanged || (hasBusinessNameChanged && (isAlterationFiling ||
                isFirmChangeFiling || isSpecialResolutionFiling))"
              id="btn-undo-company-name"
              variant="text"
              color="primary"
              class="undo-action"
              @click="resetName()"
            >
              <v-icon size="small">
                mdi-undo
              </v-icon>
              <span>Undo</span>
            </v-btn>
            <v-btn
              v-else-if="!isFirmConversionFiling && !isLimitedRestorationExtension"
              id="btn-correct-company-name"
              variant="text"
              color="primary"
              @click="isEditingNames = true"
            >
              <v-icon size="small">
                mdi-pencil
              </v-icon>
              <span>{{ getEditLabel }}</span>
            </v-btn>
            <span
              v-if="hasCompanyNameChanged || (hasBusinessNameChanged &&
                (isAlterationFiling || isFirmChangeFiling || isSpecialResolutionFiling))"
              class="more-actions"
            >
              <v-menu
                v-model="dropdown"
                offset-y
                location="left"
                nudge-bottom="4"
              >
                <template #activator="{ on }">
                  <v-btn
                    id="btn-more-actions"
                    variant="text"
                    size="small"
                    color="primary"
                    v-on="on"
                  >
                    <v-icon>{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0">
                  <v-list-item
                    id="btn-more-actions-edit"
                    class="v-list-item"
                    @click="isEditingNames = true; dropdown = false"
                  >
                    <v-list-item-subtitle>
                      <v-icon
                        size="small"
                        color="primary"
                      >mdi-pencil</v-icon>
                      <span class="drop-down-action ml-1">Change</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </div>
        </v-col>
      </template>

      <!-- Editing Mode -->
      <v-col
        v-else
        cols="9"
      >
        <CorrectNameOptions
          :correctionNameChoices="nameChangeOptions"
          @isSaved="nameChangeHandler($event)"
          @cancel="isEditingNames = false"
        />
      </v-col>
    </v-row>

    <!-- Name Request Applicant -->
    <v-row
      v-if="hasNewNr && (isAlterationFiling || isFirmChangeFiling || isFirmConversionFiling ||
        isSpecialResolutionFiling)"
      no-gutters
      class="sub-section"
    >
      <v-col cols="3">
        <label class="pr-4">Name Request Applicant</label>
      </v-col>

      <v-col cols="7">
        <div class="name-request-applicant-info">
          <span class="subtitle">Name: </span>
          <span class="info-text">{{ nrApplicant.fullName }}</span>
        </div>
        <div class="name-request-applicant-info">
          <span class="subtitle">Address: </span>
          <span class="info-text">{{ nrApplicant.fullAddress }}</span>
        </div>
        <div class="name-request-applicant-info">
          <span class="subtitle">Email: </span>
          <span class="info-text">{{ nrApplicant.emailAddress || 'N/A' }}</span>
        </div>
        <div class="name-request-applicant-info">
          <span class="subtitle">Phone: </span>
          <span class="info-text">{{ nrPhoneNumber || 'N/A' }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { CoopTypes, NameChangeOptions } from '@/enums/'
import { ActionBindingIF, EntitySnapshotIF, NameRequestApplicantIF, NameRequestIF, ResourceIF }
  from '@/interfaces/'
import { CorrectNameOptions } from '@/components/common/YourCompany'
import { NameRequestMixin } from '@/mixins'
import DateUtilities from '@/services/date-utilities'
import { ToDisplayPhone } from '@/utils'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { useStore } from '@/store/store'

@Component({
  components: { CorrectNameOptions },
  mixins: [NameRequestMixin]
})
export default class EntityName extends Vue {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  // store getters
  @Getter(useStore) getAssociationType!: CoopTypes
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isConflictingLegalType!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isLimitedRestorationExtension!: boolean
  @Getter(useStore) isNumberedCompany!: boolean
  @Getter(useStore) isSpecialResolutionFiling!: boolean

  // store actions
  @Action(useStore) setBusinessInformation!: ActionBindingIF
  @Action(useStore) setEditingCompanyName!: ActionBindingIF
  @Action(useStore) setNameRequest!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  // local properties
  protected dropdown = false // v-model for dropdown menu
  protected hasCompanyNameChanged = false // only used by corrections
  protected isEditingNames = false

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** True if a new NR number has been entered. */
  get hasNewNr (): boolean {
    return !!this.getNameRequestNumber
  }

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && this.isEditingNames)
  }

  /** Whether a new business legal name was entered.. */
  get isNewName () {
    const originalName = this.getNameRequestLegalName
    const currentName = this.getEntitySnapshot?.businessInfo.legalName
    return (originalName !== currentName)
  }

  /** The current options for change of name correction or edit. */
  get nameChangeOptions (): Array<NameChangeOptions> {
    // safety check
    if (!this.getResource.changeData) return []

    // if this is a numbered company, remove correct-name and name-to-number options
    if (this.isNumberedCompany) {
      return this.getResource.changeData?.nameChangeOptions.filter(option => (
        option !== NameChangeOptions.CORRECT_NAME &&
        option !== NameChangeOptions.CORRECT_NAME_TO_NUMBER
      ))
    }
    return this.getResource.changeData.nameChangeOptions
  }

  /** Whether to show the name options button and component. */
  get showNameOptions (): boolean {
    return (this.nameChangeOptions.length > 0)
  }

  /** The Name Request applicant info. */
  get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest?.applicant
  }

  /** The Name Request expiry date. */
  get nrExpiryDate (): string {
    const expiry = this.getNameRequest?.expiry
    if (expiry) {
      return DateUtilities.apiToPacificDateTime(expiry)
    }
    return null
  }

  /** The Name Request phone number. */
  get nrPhoneNumber (): string {
    return ToDisplayPhone(this.nrApplicant.phoneNumber)
  }

  /** The Name Request status. */
  get nrStatus (): string {
    return (this.getNameRequest?.status || '').toLowerCase()
  }

  /** Updates UI when correct name options are done.  */
  protected nameChangeHandler (isSaved = false): void {
    this.hasCompanyNameChanged = this.isNewName
    if (isSaved) this.isEditingNames = false
  }

  /** Reset company name values to original. */
  protected resetName () {
    // reset business information, except for association type.
    const businessInfo = { ...this.getEntitySnapshot.businessInfo, associationType: this.getAssociationType }
    this.setBusinessInformation(businessInfo)

    // reset name request
    this.setNameRequest({
      legalType: this.getEntitySnapshot.businessInfo.legalType,
      legalName: this.getEntitySnapshot.businessInfo.legalName,
      nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
    })

    // reset flag
    this.hasCompanyNameChanged = false
  }

  /** Updates store initially and when isEditingName property has changed. */
  @Watch('isEditingNames', { immediate: true })
  private updateValidity (val: boolean): void {
    const isValid = !this.isEditingNames
    this.setValidComponent({ key: 'isValidCompanyName', value: isValid })
    this.setEditingCompanyName(val)
  }

  /** Updates UI when Name Request is updated (ie, on resume draft). */
  @Watch('getNameRequest')
  private onNameRequestChange (): void {
    this.nameChangeHandler()
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/theme.scss';

.company-name {
  font-size: 1.5rem;
}

.company-info {
  padding-top: 0.5rem;
}

.name-request-applicant-info:not(:first-child) {
  padding-top: 0.5rem
}

.actions {
  position: absolute;
  right: 0;

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}
</style>
