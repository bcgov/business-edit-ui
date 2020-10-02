<template>
  <v-card flat id="your-company">
     <div class="define-company-header">
        <v-icon>mdi-domain</v-icon>
        <label class="define-company-title font-weight-bold">Your Company</label>
    </div>

    <div class="section-container">
      <!--TODO: Replace container content with Name Request Summary when it is ready -->
      <v-layout row class="mx-0">
        <v-flex xs3>
          <v-layout column>
            <label><strong>Company Name</strong></label>
            <v-flex md1>
              <v-chip v-if="companyNameChanges" x-small label color="#1669BB" text-color="white" id="corrected-lbl">
                 Corrected
              </v-chip>
            </v-flex>
          </v-layout>
        </v-flex>

        <template v-if="!isEditingNames">
          <v-flex xs8>
            <div class="company-name">{{ companyName }}</div>
            <div class="company-type">
              <span v-if="entityFilter(EntityTypes.BCOMP)">BC Benefit Company</span>
              <span v-else-if="entityFilter(EntityTypes.COOP)">BC Cooperative Association</span>
            </div>
          </v-flex>

          <v-flex xs1 class="ml-n5 mt-n2">
            <!-- TODO: only show buttons for named company -->
            <v-btn
              v-if="companyNameChanges"
              text color="primary"
              id="btn-undo-company-name"
              @click="resetName()"
            >
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
            <v-btn
              v-else
              text color="primary"
              id="btn-correct-company-name"
              @click="isEditingNames = true"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Correct</span>
            </v-btn>
          </v-flex>
        </template>

        <template v-else>
          <v-flex xs9>
            <correct-name-options
              :correction-name-choices="correctNameChoices"
              @done="nameChangeHandler"
              @cancel="isEditingNames = false"
            />
          </v-flex>
        </template>
      </v-layout>
      <correct-name-translation class="mt-3"
        @haveChanges="nameTranslationChanges = $event"
      />
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <v-layout row class="mx-0">
        <v-flex xs3>
          <label><strong>Recognition Date and Time</strong></label>
        </v-flex>
        <v-flex xs9>
          <div>{{ recognitionDateTime }}</div>
        </v-flex>
      </v-layout>
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <office-addresses
        @haveChanges="officeAddressChanges = $event"
      />
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <correct-business-contact-info
        @haveChanges="contactInfoChanges = $event"
      />
    </div>

    <template  v-if="isPremiumAccount">
      <v-divider class="mx-4" />

      <div class="section-container">
        <folio-number
          :initialValue="getFolioNumber"
          :isEditing="false"
          @haveChanges="folioNumberChanges = $event"
        />
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
import { ActionBindingIF, BusinessContactIF, GetterIF, IncorporationFilingIF,
  NameRequestIF, StateModelIF } from '@/interfaces'
// Components
import { CorrectBusinessContactInfo, FolioNumber, CorrectNameTranslation, OfficeAddresses } from '.'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'
import { DateMixin, EntityFilterMixin, LegalApiMixin } from '@/mixins'
import { CorrectionTypes, EntityTypes } from '@/enums'

@Component({
  components: {
    CorrectNameOptions,
    CorrectBusinessContactInfo,
    OfficeAddresses,
    FolioNumber,
    CorrectNameTranslation
  }
})
export default class YourCompany extends Mixins(DateMixin, EntityFilterMixin, LegalApiMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEffectiveDate!: Date
  @Getter getFolioNumber!: string
  @Getter getOfficeAddresses!: any
  @Getter isPremiumAccount!: GetterIF
  @Getter isNamedBusiness!: boolean
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getBusinessContact!: BusinessContactIF

  @Action setDefineCompanyStepChanged: ActionBindingIF

  // Global state
  @State(state => state.stateModel.defineCompanyStep.valid)
  readonly valid!: boolean

  // Declaration for template
  readonly EntityTypes = EntityTypes

  // whether components have changes
  private companyNameChanges = false
  private contactInfoChanges = false
  private folioNumberChanges = false
  private nameTranslationChanges = false
  private officeAddressChanges = false
  private correctNameChoices: Array<string> = []
  private isEditingNames = false

  /** The company name (from NR, or incorporation number). */
  private get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** The recognition (aka effective) datetime. */
  private get recognitionDateTime (): string {
    return this.getEffectiveDate
      ? (this.convertUtcTimeToLocalTime(this.getEffectiveDate.toString()) + ' Pacific Time')
      : 'Unknown'
  }

  /** Compare current to corrected data and update UI.  */
  @Watch('getApprovedName')
  private nameChangeHandler (): void {
    this.companyNameChanges = this.isNewName
    this.isEditingNames = false
  }

  /** Compare names. */
  private get isNewName () {
    const currentName = this.getOriginalIA.incorporationApplication.nameRequest.legalName
    const correctedName = this.getApprovedName
    return currentName !== correctedName
  }

  /** Reset company name values to original. */
  private resetName () {
    this.setBusinessInformation(this.getOriginalIA.business)
    this.setNameRequest(this.getOriginalIA.incorporationApplication.nameRequest)
    this.companyNameChanges = false
  }

  // watchers for component change flags
  @Watch('companyNameChanges') private onCompanyNameChanges ():void { this.setDataChanges() }
  @Watch('contactInfoChanges') private onContactInfoChanges ():void { this.setDataChanges() }
  @Watch('folioNumberChanges') private onFolioNumberChanges ():void { this.setDataChanges() }
  @Watch('nameTranslationChanges') private onNameTranslationChanges ():void { this.setDataChanges() }
  @Watch('officeAddressChanges') private onOfficeAddressChanges ():void { this.setDataChanges() }

  @Watch('getApprovedName')
  private onApprovedName ():void {
    if (this.getApprovedName) {
      this.correctNameChoices = [
        CorrectionTypes.CORRECT_NEW_NR,
        CorrectionTypes.CORRECT_NAME,
        CorrectionTypes.CORRECT_NAME_TO_NUMBER
      ]
    } else {
      this.correctNameChoices = [
        CorrectionTypes.CORRECT_NEW_NR
      ]
    }
  }

  private setDataChanges (): void {
    const haveChanges: boolean = this.companyNameChanges ||
      this.contactInfoChanges ||
      this.folioNumberChanges ||
      this.nameTranslationChanges ||
      this.officeAddressChanges
    this.setDefineCompanyStepChanged(haveChanges)
    this.emitHaveChanges(haveChanges)
  }

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  font-weight: bold;
  color: $primary-blue;
}

.section-container {
  padding: 1.25rem 1rem;
  font-size: 0.875rem;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-company-title {
 padding-left: 0.5rem;
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold
}

.company-type {
  padding-top: 0.5rem
}
</style>
