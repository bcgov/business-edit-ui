<template>
  <v-card flat id="special-resolution-summary">
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">mdi-handshake</v-icon>
        <label class="font-weight-bold pl-2">Special Resolution</label>
      </article>
      <v-card flat :class="{'invalid-section': invalidNameSection}">
        <!-- Instructional Text -->
        <article class="instructional-text section-container">
          Before submitting this filing, you must pass a
            <v-tooltip  top
                    content-class="top-tooltip"
                    transition="fade-transition"
                    nudge-right="3">
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
                class="tool-tip-text"
              >special resolution</span>
            </template>
            <span>Special Resolution -  A decision voted on by the voting members of a Cooperative Association.</span>
          </v-tooltip>
        for this amendment
        </article>

        <HelpSection
            class="ma-6"
            :helpSection="helpSection"
          />

      <!-- Special Resolution Form -->
        <section id="sample-resolution-section" class="section-container mt-10">
          <header id="sample-resolution-header">
            <h2>{{ getCreateResolutionResource.header}}</h2>
          </header>

          <p class="section-description mt-2"
            v-html="getCreateResolutionResource.text"></p>

          <div class="mt-4">
            <v-card flat class="py-8 px-6">
              <div class="d-flex flex-column flex-sm-row justify-center align-center">
                <img src="@/assets/images/BCRegistries_CoopSpecialResolution-x2.png"
                  :alt="getCreateResolutionResource.downloadDocLabel"
                  slot-scope="" class="preview-image" />
                <div class="px-8" />
                <div class="download-link-container py-5">
                  <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                  <a :href="documentURL" download class="ml-1">
                    {{getCreateResolutionResource.downloadDocLabel}}
                  </a>
                </div>
              </div>
            </v-card>
          </div>
        </section>
        <v-divider class="mx-4" />

        <section id="resolution-date-section" class="section-container mt-10">
          <header id="resolution-date-header">
            <h2>Special Resolution</h2>
          </header>

          <p class="section-description mt-2">
            Enter the date the special resolution passed and the text as it appears on your printed form.
          </p>

          <div class="mt-4" >
            <v-card flat id="resolution-date-card" class="py-8">
              <v-row no-gutters>
                <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block">
                  <label class="resolution-date-vcard-title mt-4">
                    Resolution Date
                  </label>
                </v-col>
                <v-col cols="12" sm="9">
                  <DatePickerShared
                    ref="resolutionDatePickerRef"
                    title="Resolution Date"
                    :nudgeRight="40"
                    :nudgeTop="85"
                    :initialValue="resolutionDateText"
                    :minDate="resolutionDateMinStr"
                    :maxDate="resolutionDateMaxStr"
                    :inputRules="resolutionDateRules"
                    @emitDateSync="onResolutionDateSync"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block">
                  <label class="resolution-text-vcard-title mt-4">
                    Resolution Text
                  </label>
                </v-col>
                <v-col cols="12" sm="9">
                  <v-form ref="resolutionTextFormRef">
                    <v-textarea ref="resolutionTextRef"
                                auto-grow
                                filled
                                label="Resolution Text"
                                rows="6"
                                :counter="MAX_RESOLUTION_TEXT_LENGTH"
                                v-model="resolutionText"
                                :rules="resolutionTextRules"
                                @change="onResolutionTextChanged"
                    />

                  </v-form>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- Resolution Signature -->

          <header id="resolution-signature-info-header">
            <h2> Resolution signature</h2>
          </header>

          <p class="section-description mt-2">
            Enter the full name of the person who signed the special resolution and the date they signed it.
            </p>

            <v-card flat id="resolution-signature-card" class="py-8">
              <v-row no-gutters>
                <v-col cols="12" sm="3" class="pr-4">
                  <label class="resolution-signature-vcard-title">Signing Party</label>
                </v-col>
                <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
                  <v-form ref="signingPersonFormRef">
                    <div class="form__row three-column">
                      <v-text-field
                        ref="signingPersonGivenNameRef"
                        filled
                        class="item"
                        label="First Name"
                        id="person__first-name"
                        v-model="signingPerson.givenName"
                        :rules="firstNameRules"
                      />
                      <v-text-field
                        ref="signingPersonMiddleNameRef"
                        filled
                        class="item"
                        label="Middle Name (Optional)"
                        id="person__middle-name"
                        v-model="signingPerson.additionalName"
                        :rules="middleNameRules"
                      />
                      <v-text-field
                        ref="signingPersonFamilyNameRef"
                        filled
                        class="item"
                        label="Last Name"
                        id="person__last-name"
                        v-model="signingPerson.familyName"
                        :rules="lastNameRules"
                        />
                    </div>
                  </v-form>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" sm="3" class="pr-4">
                  <label class="resolution-signature-vcard-title">Date Signed</label>
                </v-col>
                <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
                  <DatePickerShared
                    ref="signatureDatePickerRef"
                    title="Date Signed"
                    :nudgeRight="40"
                    :nudgeTop="85"
                    :minDate="signatureDateMinStr"
                    :maxDate="signatureDateMaxStr"
                    :inputRules="signatureDateRules"
                    @emitDateSync="onSigningDateSync"
                  />
                </v-col>
              </v-row>
            </v-card>

        </section>
      </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, HelpSectionIF, ResourceIF,
  FormIF, SigningPersonIF, EmptySigningPersonIF, CreateResolutionIF } from '@/interfaces/'
import { DateMixin } from '@/mixins/'
import { HelpSection } from '@/components/common/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'

@Component({
  components: {
    HelpSection,
    DatePickerShared
  }
})
export default class SpecialResolutionForm extends Mixins(DateMixin) {
  @Getter getResource!: ResourceIF
  @Getter getBusinessFoundingDate!: string
  @Getter getCurrentDate!: string
  @Getter getCurrentJsDate!: string

  @Action setResolution!: ActionBindingIF
  @Getter getcreateResolution!: CreateResolutionIF
  @Getter getComponentValidate!: boolean

  // Refs
  $refs!: {
    resolutionDatePickerRef: DatePickerShared,
    signatureDatePickerRef: DatePickerShared,
    signingPersonFormRef: FormIF,
  }

  // Date properties
  protected resolutionDateText = ''
  protected signatureDateText = ''

  readonly MAX_RESOLUTION_TEXT_LENGTH = 1000
  protected resolutionText = ''

  protected signingPerson: SigningPersonIF = null

  /** Validation rule for individual name fields */
  readonly firstNameRules = this.nameRules('First Name')
  readonly middleNameRules = this.nameRules('Middle Name', false)
  readonly lastNameRules = this.nameRules('Last Name')

  get helpSection (): HelpSectionIF {
    return this.getResource.changeData?.specialSpecialResolution?.helpSection
  }

  get getCreateResolutionResource (): any {
    return this.getResource.changeData?.specialSpecialResolution?.sampleFormSection || {}
  }

  get documentURL (): string {
    const docUrl = sessionStorage.getItem('BASE_URL') +
      this.getCreateResolutionResource?.downloadDocPath
    return docUrl
  }

  /** The name section validity state (when prompted by app). */
  get invalidNameSection (): boolean {
    // add more state here
    return (this.getComponentValidate)
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMinStr (): string {
    return this.dateToYyyyMmDd(this.apiToDate(this.getBusinessFoundingDate))
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMin (): Date {
    return this.apiToDate(this.getBusinessFoundingDate)
  }
  /** The maximum date that can be entered (today). */
  get resolutionDateMax (): Date {
    return this.apiToDate(this.getCurrentDate)
  }

  get resolutionTextRules (): Array<Function> {
    return [
      v => (v && v.trim().length > 0) || 'Resolution text is required',
      v => (v && v.length <= this.MAX_RESOLUTION_TEXT_LENGTH) || 'Maximum characters exceeded',
      v => (v && /^([\w\s$&+,:;=?@#|'<>.^*()%!-\\"]*)$/g.test(v)) || 'Invalid characters'
    ]
  }

  /** The maximum date that can be entered (today). */
  get resolutionDateMaxStr (): string {
    return this.getCurrentDate
  }

  /** Validations rules for resolution date field. */
  get resolutionDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Resolution date is required',
      (v: string) =>

        this.isBetweenDates(this.resolutionDateMinStr,
          this.resolutionDateMaxStr,
          v) ||
        `Date should be between ${this.dateToPacificDate(this.resolutionDateMin, true)} and
         ${this.dateToPacificDate(this.resolutionDateMax, true)}`
    ]
  }

  /**
   * True if date is >= the minimum (ie, today) and <= the maximum (ie, the 10th day).
   * This is used for Vue form validation (in Date Rules above).
   */
  isBetweenDates (minDate: string, maxDate: string, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    return (new Date(dateStrToValidate) >= new Date(minDate)) && (new Date(dateStrToValidate) <= new Date(maxDate))
  }
  /** Called to update resolution date. */
  async onResolutionDateSync (val: string): Promise<void> {
    this.resolutionDateText = val
    this.setResolution({
      ...this.getcreateResolution,
      resolutionDate: val
    })
  }
  /** called to add new resolutionDateText. */
  protected onResolutionTextChanged (val: string) {
    this.setResolution({
      ...this.getcreateResolution,
      resolutionText: val
    })
  }

  /** Validation rule for name */
  private nameRules (label, isRequired = true): Array<Function> {
    return [
      v => isRequired ? (!!v?.trim() || `${label} is required`) : true,
      v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
    ]
  }

  /** The minimum date that can be entered (resolution date). */
  get signatureDateMinStr (): string {
    return this.dateToYyyyMmDd(this.signatureDateMin)
  }

  /** The minimum date that can be entered (resolution date). */
  get signatureDateMin (): Date {
    if (this.resolutionDateText) {
      const resolutionDate = this.yyyyMmDdToDate(this.resolutionDateText)
      return resolutionDate
    }
    return this.apiToDate(this.getCurrentDate)
  }

  /** The maximum date that can be entered (today). */
  get signatureDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.signatureDateMax)
  }

  /** The maximum date that can be entered (today). */
  private get signatureDateMax (): Date {
    return this.apiToDate(this.getCurrentDate)
  }

  /** Validations rules for signing date field. */
  get signatureDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Signature date is required',
      (v: string) =>
        this.isBetweenDates(this.signatureDateMinStr,
          this.signatureDateMaxStr,
          v) ||
        `Date should be between ${this.dateToPacificDate(this.signatureDateMin, true)} and
         ${this.dateToPacificDate(this.signatureDateMax, true)}`
    ]
  }
  /** called to add new signature date  */
  async onSigningDateSync (val: string): Promise<void> {
    this.setResolution({
      ...this.getcreateResolution,
      signingDate: val
    })
  }
  /** called to store signing party. */
   @Watch('signingPerson', { deep: true })
  protected async onSigningPersonChanged (): Promise<void> {
    this.setResolution({
      ...this.getcreateResolution,
      signingPerson: this.signingPerson
    })
  }
   /** Set values if exist */
   created () {
     this.resolutionDateText = this.getcreateResolution.resolutionDate
     this.resolutionText = this.getcreateResolution.resolutionText
     this.signingPerson = this.getcreateResolution.signingPerson || { ...EmptySigningPersonIF }
     this.signatureDateText = this.getcreateResolution.signingDate
   }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

.preview-image {
  width: 200px;
  height: 259px;
}

.download-link-container {
  border-top: solid 1px $gray3;
  border-bottom: solid 1px $gray3;
}
#sample-resolution-section {
  a {
    text-decoration: none;
  }
}

// Form Row Elements
.form__row.three-column {
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  margin-left: -0.5rem;
  margin-right: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
::v-deep label.v-label.theme--light {
  color: $gray7 !important;
  font-weight: normal;
}
.tool-tip-text{
   border-bottom: 1px dashed $gray6;
}
</style>
