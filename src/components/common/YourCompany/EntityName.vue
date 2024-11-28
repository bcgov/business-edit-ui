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
        <v-col
          md="1"
          class="pa-0"
        >
          <v-chip
            v-if="shouldShowEditedLabel"
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
        <v-col
          cols="7"
          class="mt-1"
        >
          <div class="company-name font-weight-bold text-uppercase">
            {{ companyName }}
          </div>

          <!-- Business Type Info -->
          <template
            v-if="shouldShowTypeDetail"
          >
            <div class="company-info mt-4">
              <span class="subtitle">Business Type: </span>
              <span class="info-text">{{ GetCorpFullDescription(getEntityType) }}</span>
            </div>
            <div class="info-text pt-3">
              <span>The name of this business will be the current Incorporation Number followed
                by "B.C. {{ getUpdatedName() }}"</span>
            </div>
          </template>
          <template v-if="isNameChangedByType && hasCompanyNameChanged">
            <!-- Reminder: Name changed based on selected business type -->
            <v-row
              no-gutters
              class="pt-4"
            >
              <v-col cols="auto">
                <v-icon
                  class="pr-2"
                  color="primary"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </v-col>

              <v-col>
                <div class="info-text">
                  We have changed your numbered company name based on the business type you selected.
                </div>
              </v-col>
            </v-row>
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
              >{{ corpFullDescription }}
              </span>
              <v-tooltip
                v-if="isConflictingLegalType"
                top
                content-class="top-tooltip"
                transition="fade-transition"
                nudge-right="3"
              >
                <template #activator="{ on }">
                  <v-icon
                    color="error"
                    small
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
              <span class="info-text">{{ getNrRequestDesc(getNameRequest.request_action_cd) }}</span>
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
              v-if="shouldShowUndoButton"
              id="btn-undo-company-name"
              text
              color="primary"
              class="undo-action"
              @click="resetName()"
            >
              <v-icon small>
                mdi-undo
              </v-icon>
              <span>Undo</span>
            </v-btn>
            <v-btn
              v-else-if="!isFirmConversionFiling && !isLimitedRestorationExtension && !isNameChangedByType"
              id="btn-correct-company-name"
              text
              color="primary"
              @click="isEditingNames = true"
            >
              <v-icon small>
                mdi-pencil
              </v-icon>
              <span>{{ getEditLabel }}</span>
            </v-btn>
            <span
              v-if="shouldShowUndoButton"
              class="more-actions"
            >
              <v-menu
                v-model="dropdown"
                offset-y
                left
                nudge-bottom="4"
              >
                <template #activator="{ on }">
                  <v-btn
                    id="btn-more-actions"
                    text
                    small
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
                        small
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
        <CorrectName
          :correctNameChoices="correctNameChoices"
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
          <span class="info-text">{{ nrFullName }}</span>
        </div>
        <div class="name-request-applicant-info">
          <span class="subtitle">Address: </span>
          <span class="info-text">{{ nrFullAddress }}</span>
        </div>
        <div class="name-request-applicant-info">
          <span class="subtitle">Email: </span>
          <span class="info-text">{{ nrEmailAddress || 'N/A' }}</span>
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
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { CoopTypes, CorrectNameOptions } from '@/enums/'
import { ActionKvIF, BusinessInformationIF } from '@/interfaces/'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'
import CorrectName from '@/components/common/YourCompany/CorrectName/CorrectName.vue'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import DateUtilities from '@/services/date-utilities'
import { ToDisplayPhone } from '@/utils'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { useStore } from '@/store/store'

@Component({
  components: {
    CorrectName
  }
})
export default class EntityName extends Mixins(CommonMixin, NameRequestMixin) {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  // store getters
  @Getter(useStore) getAssociationType!: CoopTypes
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getOriginalBusinessInfo!: BusinessInformationIF
  @Getter(useStore) getOriginalLegalName!: string
  @Getter(useStore) getOriginalLegalType!: CorpTypeCd
  @Getter(useStore) getOriginalNrNumber!: string
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isConflictingLegalType!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isLimitedRestorationExtension!: boolean
  @Getter(useStore) isNumberedCompany!: boolean
  @Getter(useStore) isSpecialResolutionFiling!: boolean
  @Getter(useStore) isNameChangedByType!: boolean
  @Getter(useStore) isEntityTypeChangedByName!: boolean

  // store actions
  @Action(useStore) setBusinessInformation!: (x: BusinessInformationIF) => void
  @Action(useStore) setEditingCompanyName!: (x: boolean) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestLegalName!: (x: string) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setEntityTypeChangedByName!: (x: boolean) => void
  @Action(useStore) setNameChangedToNumber!: (x: boolean) => void

  // local properties
  dropdown = false // v-model for dropdown menu
  hasCompanyNameChanged = false // only used by corrections
  isEditingNames = false

  /** The corp full description. */
  get corpFullDescription (): string {
    return GetCorpFullDescription(this.getNameRequest.legalType as any)
  }

  /** Whether the edited label should be displayed. */
  get shouldShowEditedLabel (): boolean {
    return (
      this.hasCompanyNameChanged ||
      (
        this.hasBusinessNameChanged &&
        (this.isAlterationFiling || this.isFirmChangeFiling || this.isSpecialResolutionFiling)
      )
    )
  }

  /** Get the numbered name, after changing from named company */
  getUpdatedName (): string {
    if (this.getEntityType === CorpTypeCd.BC_ULC_COMPANY ||
    this.getEntityType === CorpTypeCd.ULC_CONTINUE_IN) {
      return 'UNLIMITED LIABILITY COMPANY'
    }
    if (this.getEntityType === CorpTypeCd.BC_CCC ||
    this.getEntityType === CorpTypeCd.CCC_CONTINUE_IN) {
      return 'COMMUNITY CONTRIBUTION COMPANY LTD.'
    }
    if (this.getEntityType === CorpTypeCd.BC_COMPANY ||
    this.getEntityType === CorpTypeCd.CONTINUE_IN ||
    this.getEntityType === CorpTypeCd.BENEFIT_COMPANY ||
    this.getEntityType === CorpTypeCd.BEN_CONTINUE_IN) {
      return 'LTD.'
    }
    return 'LTD.' // should never happen
  }

  /**
   * Whether the undo button should be displayed. This is the case when the company name has changed,
   * or the business name has changed during an alteration, firm change, or special resolution filing,
   * and the name has not been changed by type.
   */
  get shouldShowUndoButton (): boolean {
    return (
      (
        this.hasCompanyNameChanged ||
        (
          this.hasBusinessNameChanged &&
          (this.isAlterationFiling || this.isFirmChangeFiling || this.isSpecialResolutionFiling)
        )
      ) &&
      !this.isNameChangedByType
    )
  }

  /**
   * Whether the type details should be displayed. This is the case when:
   * - there is no new NR, and
   * - the business name has changed, and
   * - the filing is an alteration or firm change filing, and
   * - the name has not been changed by type
   * - this is when a named business is changed to a numbered business
   */
  get shouldShowTypeDetail (): boolean {
    const result = (
      !this.hasNewNr &&
      this.hasBusinessNameChanged &&
      (this.isAlterationFiling || this.isFirmChangeFiling) &&
      !this.isNameChangedByType
    )
    this.setNameChangedToNumber(result)
    return result
  }

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName
    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. ${this.getUpdatedName()}`
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
    const currentName = this.getOriginalLegalName
    return (originalName !== currentName)
  }

  /** The current options for name changes. */
  get correctNameChoices (): Array<CorrectNameOptions> {
    // safety check
    if (!this.getResource.changeData) return []

    // if this is a numbered company, remove correct-name and name-to-number options
    if (this.isNumberedCompany) {
      return this.getResource.changeData?.correctNameOptions.filter(option => (
        option !== CorrectNameOptions.CORRECT_NAME &&
        option !== CorrectNameOptions.CORRECT_NAME_TO_NUMBER
      ))
    }
    return this.getResource.changeData.correctNameOptions
  }

  /** Whether to show the name options button and component. */
  get showNameOptions (): boolean {
    return (this.correctNameChoices.length > 0)
  }

  get nrFullName (): string {
    return this.formatFullName(this.getNameRequest.applicants)
  }

  get nrFullAddress (): string {
    return this.formatFullAddress(this.getNameRequest.applicants)
  }

  get nrEmailAddress (): string {
    return this.getNameRequest.applicants.emailAddress
  }

  /** The Name Request expiry date. */
  get nrExpiryDate (): string {
    const expiry = this.getNameRequest.expirationDate
    if (expiry) {
      return DateUtilities.apiToPacificDateTime(expiry)
    }
    return null
  }

  /** The Name Request phone number. */
  get nrPhoneNumber (): string {
    return ToDisplayPhone(this.getNameRequest.applicants.phoneNumber)
  }

  /** The Name Request status. */
  get nrStatus (): string {
    return (this.getNameRequest.state || '').toLowerCase()
  }

  /** Updates UI when correct name options are done.  */
  nameChangeHandler (isSaved = false): void {
    this.hasCompanyNameChanged = this.isNewName
    if (isSaved) this.isEditingNames = false
  }

  /** Reset company name values to original. */
  resetName () {
    // reset business information, except for association type
    const businessInfo = { ...this.getOriginalBusinessInfo, associationType: this.getAssociationType }
    this.setBusinessInformation(businessInfo)

    // reset name request
    this.setNameRequest({
      legalType: this.getOriginalLegalType,
      nrNum: this.getOriginalNrNumber
    } as any)
    this.setNameRequestLegalName(this.getOriginalLegalName)

    this.setEntityType(this.getOriginalLegalType || null)

    if (this.isEntityTypeChangedByName) {
      this.setEntityTypeChangedByName(false)
    }

    this.setNameChangedToNumber(false)

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
