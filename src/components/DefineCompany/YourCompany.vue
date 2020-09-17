<template>
  <v-card flat>
     <div class="define-company-header">
        <v-icon>mdi-domain</v-icon>
        <label class="define-company-title"><strong>Your Company</strong></label>
    </div>
    <div class="section-container px-8">
      <!--TODO: Replace container content with Name Request Summary when it is ready -->
      <v-layout row>
        <v-flex md3>
          <v-layout column>
            <label><strong>Company Name</strong></label>
            <v-flex md1>
              <v-chip
                v-if="companyNameChanges"
                class="ma-2 pa-2"
                color="primary"
                pill
                x-small
              >
                Corrected
              </v-chip>
            </v-flex>
          </v-layout>
        </v-flex>
        <template v-if="!isEditingNames">
          <v-flex md7>
            <div class="company-name">{{ companyName }}</div>
            <div class="company-type">
              <span v-if="entityFilter(EntityTypes.BCOMP)">BC Benefit Company</span>
              <span v-else-if="entityFilter(EntityTypes.COOP)">BC Cooperative Association</span>
            </div>
          </v-flex>
          <v-flex md2 class="align-right">
            <!-- only show buttons for named company -->
            <v-btn
              v-if="!companyNameChanges"
              text color="primary"
              id="btn-correct-company-name"
              @click="isEditingNames = true"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Correct</span>
            </v-btn>
            <v-btn
              v-else
              text color="primary"
              id="btn-undo-company-name"
              @click="resetName"
            >
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
          </v-flex>
        </template>
        <v-flex v-else md9>
          <correct-name-options
            :correction-name-choices="correctNameChoices"
            @done="nameChangeHandler($event)"
            @cancel="isEditingNames = false"
          />
        </v-flex>
      </v-layout>
      <v-layout row v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
        <v-flex md3>
          <label><strong>Name Translation</strong></label>
        </v-flex>
        <v-flex md7>
          <div v-for="(name, index) in getNameTranslations" :key="`name_translation_${index}`">{{name}}</div>
        </v-flex>
        <v-flex md2 class="align-right">
          <v-btn
            v-if="!nameTranslationChanges"
            text color="primary"
            id="btn-correct-name-translations"
            @click="nameTranslationChanges = true"
          >
            <v-icon small>mdi-pencil</v-icon>
            <span>Correct</span>
          </v-btn>
          <v-btn
            v-if="nameTranslationChanges"
            text color="primary"
            id="btn-undo-name-translations"
            @click="nameTranslationChanges = false"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>

    <v-divider />

    <div class="section-container px-8">
      <v-layout row>
        <v-flex md3>
          <label><strong>Recognition Date and Time</strong></label>
        </v-flex>
        <v-flex md7>
          <div>{{ recognitionDateTime }}</div>
        </v-flex>
        <v-flex md2 class="align-right">
        </v-flex>
      </v-layout>
    </div>

    <v-divider />

    <div class="section-container">
      <!-- TODO: add Correct button -->
      <office-addresses
        :inputAddresses="getOfficeAddresses"
        :isEditing="false"
        @haveChanges="officeAddressChanges = $event"
      />
    </div>

    <v-divider />

    <div class="section-container">
      <!-- TODO: add Correct button -->
      <business-contact-info
        :initialValue="businessContact"
        :isEditing="false"
        @haveChanges="contactInfoChanges = $event"
      />
    </div>

    <div class="section-container" v-if="isPremiumAccount">
      <!-- TODO: add Correct button -->
      <folio-number
        :initialValue="getFolioNumber"
        :isEditing="false"
        @haveChanges="folioNumberChanges = $event"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'
// Interfaces
import { BusinessContactIF, GetterIF, IncorporationFilingIF, NameRequestIF, StateModelIF } from '@/interfaces'
// Components
import { BusinessContactInfo, FolioNumber, OfficeAddresses } from '@/components/DefineCompany'
import { CorrectNameOptions } from '@/components/Company/CompanyName'
// Mixins
import { DateMixin, EntityFilterMixin, LegalApiMixin } from '@/mixins'
// Enums
import { CorrectionTypes, EntityTypes } from '@/enums'

@Component({
  components: {
    CorrectNameOptions,
    BusinessContactInfo,
    OfficeAddresses,
    FolioNumber
  }
})
export default class YourCompany extends Mixins(DateMixin, EntityFilterMixin, LegalApiMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEffectiveDate!: Date
  @Getter getFolioNumber!: string
  @Getter getNameTranslations!: Array<string>
  @Getter getOfficeAddresses!: any
  @Getter isPremiumAccount!: GetterIF
  @Getter isNamedBusiness!: boolean
  @Getter getOriginalIA!: IncorporationFilingIF

  // Global state
  @State(state => state.stateModel.defineCompanyStep.valid)
  readonly valid!: boolean

  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF

  @Prop({ default: false })
  private isSummary: boolean

  // Enums
  readonly CorrectionTypes = CorrectionTypes
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
  private nameChangeHandler (isSaved: boolean): void {
    if (isSaved) {
      this.companyNameChanges = this.isNewName()
      this.isEditingNames = false
    }
  }

  /** Compare names. */
  private isNewName () {
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
  @Watch('companyNameChanges') private onCompanyNameChanges ():void { this.emitHaveChanges() }
  @Watch('contactInfoChanges') private onContactInfoChanges ():void { this.emitHaveChanges() }
  @Watch('folioNumberChanges') private onFolioNumberChanges ():void { this.emitHaveChanges() }
  @Watch('nameTranslationChanges') private onNameTranslationChanges ():void { this.emitHaveChanges() }
  @Watch('officeAddressChanges') private onOfficeAddressChanges ():void { this.emitHaveChanges() }

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

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return (
      this.companyNameChanges ||
      this.contactInfoChanges ||
      this.folioNumberChanges ||
      this.nameTranslationChanges ||
      this.officeAddressChanges
    )
  }
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
  padding-left: 2rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
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
