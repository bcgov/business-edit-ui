<template>
  <v-card flat id="create-special-resolution">
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">mdi-handshake</v-icon>
        <label class="font-weight-bold pl-2">Special Resolution</label>
      </article>
      <v-card flat :class="{'invalid-section': invalidCreateSpecialResolutionSection}">
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
          <v-form v-model="formValid" ref="createSpecialResolutionRef">
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
                    :minDate="dateToYyyyMmDd(resolutionDateMin)"
                    :maxDate="dateToYyyyMmDd(resolutionDateMax)"
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
                  <v-textarea
                              auto-grow
                              filled
                              label="Resolution Text"
                              rows="6"
                              :counter="MAX_RESOLUTION_TEXT_LENGTH"
                              v-model="resolution"
                              :rules="resolutionRules"
                              @change="onResolutionChanged"
                  />
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
                  <div class="form__row three-column">
                    <v-text-field
                      filled
                      class="item"
                      label="First Name"
                      id="person__first-name"
                      v-model="signatory.givenName"
                      :rules="firstNameRules"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Middle Name (Optional)"
                      id="person__middle-name"
                      v-model="signatory.additionalName"
                      :rules="middleNameRules"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Last Name"
                      id="person__last-name"
                      v-model="signatory.familyName"
                      :rules="lastNameRules"
                      />
                  </div>
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
                    :initialValue="signingDate"
                    :minDate="dateToYyyyMmDd(signatureDateMin)"
                    :maxDate="dateToYyyyMmDd(signatureDateMax)"
                    :inputRules="signatureDateRules"
                    @emitDateSync="onSigningDateSync"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-form>
        </section>
      </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, HelpSectionIF, ResourceIF, FormIF, SampleFormIF } from '@/interfaces/'
import { DateMixin } from '@/mixins/'
import { HelpSection } from '@/components/common/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF, PersonIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'

@Component({
  components: {
    HelpSection,
    DatePickerShared
  }
})
export default class CreateSpecialResolution extends Mixins(DateMixin) {
  @Getter getResource!: ResourceIF
  @Getter getBusinessFoundingDate!: string
  @Getter getCurrentDate!: string
  @Getter getCurrentJsDate!: string
  @Getter getCreateResolution!: SpecialResolutionIF
  @Getter getComponentValidate!: boolean
  @Getter getCreateResolutionFormValid!: boolean

  @Action setResolution!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // Refs
  $refs!: {
    resolutionDatePickerRef: DatePickerShared,
    signatureDatePickerRef: DatePickerShared,
    createSpecialResolutionRef: FormIF
  }

  // Date properties
  protected resolutionDateText = ''
  protected signingDate = ''

  readonly MAX_RESOLUTION_TEXT_LENGTH = 1000
  protected resolution = ''
  protected formValid = false

  protected signatory: PersonIF = {
    givenName: '',
    familyName: '',
    additionalName: null
  }

  /** Validation rule for individual name fields */
  readonly firstNameRules = this.nameRules('First Name')
  readonly middleNameRules = this.nameRules('Middle Name', false)
  readonly lastNameRules = this.nameRules('Last Name')

  get helpSection (): HelpSectionIF {
    return this.getResource.changeData?.specialSpecialResolution?.helpSection || {}
  }

  get getCreateResolutionResource (): SampleFormIF {
    return this.getResource.changeData?.specialSpecialResolution?.sampleFormSection || {}
  }

  /** download URL for pdf file */
  get documentURL (): string {
    /**
     * In session is stored the BASE_URL with business ID
     * So we are taking from process.env.BASE_URL
     */

    return process.env.BASE_URL +
      this.getCreateResolutionResource?.downloadDocPath
  }

  /** The name section validity state (when prompted by app). */
  get invalidCreateSpecialResolutionSection (): boolean {
    // add more state here
    return (this.getComponentValidate && !this.getCreateResolutionFormValid)
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMin (): Date {
    /** TODO: Needs to be after the most recent filing date, I don't think the business founding date is correct
     * Will be fixed in 13231 */
    return this.apiToDate(this.getBusinessFoundingDate)
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMinStr (): string {
    return this.dateToYyyyMmDd(this.resolutionDateMin)
  }

  /** The maximum date that can be entered (today). */
  get resolutionDateMax (): Date {
    return this.yyyyMmDdToDate(this.getCurrentDate)
  }

  get resolutionRules (): Array<Function> {
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

        this.isValidDateRange(this.resolutionDateMin,
          this.resolutionDateMax,
          v) ||
        `Date should be between ${this.dateToPacificDate(this.resolutionDateMin, true)} and
         ${this.dateToPacificDate(this.resolutionDateMax, true)}`
    ]
  }

  /**
   * True if date is >= the minimum (ie, today) and <= the maximum (ie, the 10th day).
   * This is used for Vue form validation (in Date Rules above).
   */
  private isValidDateRange (minDate: Date, maxDate: Date, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    // only compare year/month/day (ignore time)
    let date = new Date(dateStrToValidate)
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const minDay = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    const maxDay = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    return (date >= minDay && date <= maxDay)
  }

  /** Called to update resolution date. */
  async onResolutionDateSync (val: string): Promise<void> {
    this.resolutionDateText = val
    this.setResolution({
      ...this.getCreateResolution,
      resolutionDate: val
    })
    await this.validate()
  }

  /** called to add new resolutionDateText. */
  protected async onResolutionChanged (val: string) {
    this.setResolution({
      ...this.getCreateResolution,
      resolution: val
    })
    await this.validate()
  }

  /** Validation rule for name */
  private nameRules (label, isRequired = true): Array<Function> {
    return [
      v => isRequired ? (!!v?.trim() || `${label} is required`) : true,
      v => v ? (v?.length <= 30) || 'Cannot exceed 30 characters' : true // maximum character count
    ]
  }

  /** The minimum date that can be entered (resolution date). */
  get signatureDateMin (): Date {
    if (this.resolutionDateText) {
      const resolutionDate = this.yyyyMmDdToDate(this.resolutionDateText)
      return resolutionDate
    }
    return this.yyyyMmDdToDate(this.getCurrentDate)
  }

  /** The maximum date that can be entered (today). */
  private get signatureDateMax (): Date {
    return this.yyyyMmDdToDate(this.getCurrentDate)
  }

  /** Validations rules for signing date field. */
  get signatureDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Signature date is required',
      (v: string) =>
        this.isValidDateRange(this.signatureDateMin,
          this.signatureDateMax,
          v) ||
        `Date should be between ${this.dateToPacificDate(this.signatureDateMin, true)} and
         ${this.dateToPacificDate(this.signatureDateMax, true)}`
    ]
  }

  /** called to add new signature date  */
  async onSigningDateSync (val: string): Promise<void> {
    this.setResolution({
      ...this.getCreateResolution,
      signingDate: val
    })
    await this.validate()
  }

  /** Set validate on file and pay click. */
  @Watch('getComponentValidate')
  protected updateResolutionValidationDetail (): void {
    this.$refs.createSpecialResolutionRef.validate()
    this.$refs.resolutionDatePickerRef.validateForm()
    this.$refs.signatureDatePickerRef.validateForm()
  }

  /** called to store signing party. */
  @Watch('signatory', { deep: true })
  protected async onSignatoryChanged (): Promise<void> {
    this.setResolution({
      ...this.getCreateResolution,
      signatory: this.signatory
    })
    // wait for store update
    await this.$nextTick()
    await this.validate()
  }

  /** called to store component validity to store. */
  protected async validate () {
    // wait to reflect validation state
    await this.$nextTick()

    // date validation
    const isResolutionDateValid = this.$refs?.resolutionDatePickerRef?.isDateValid()
    const isSignatureDateValid = this.$refs?.signatureDatePickerRef?.isDateValid()

    const isFormValid = this.formValid && isResolutionDateValid && isSignatureDateValid
    // setting component validity flag
    this.setValidComponent({ key: 'isValidCreateSpecialResolution', value: isFormValid })
  }

  /** Set values if exist
   * while coming back from summary page this form need to show existing values.
  */
  protected created () {
    this.signatory = this.getCreateResolution.signatory ||
      {
        givenName: '',
        familyName: '',
        additionalName: null
      }
    this.resolution = this.getCreateResolution.resolution || ''
    this.resolutionDateText = this.getCreateResolution.resolutionDate || ''
    this.signingDate = this.getCreateResolution.signingDate || ''
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

// this is to show error color for label and placeholder
::v-deep .invalid-section label.v-label.error--text , .invalid-section label {
    color: $BCgovInputError !important;
}
</style>
