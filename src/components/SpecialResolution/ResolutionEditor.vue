<template>
  <div
    id="special-resolution-editor"
    class="mt-4"
  >
    <v-card
      id="resolution-date-card"
      flat
      class="pt-8"
    >
      <!-- Resolution Date -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4 d-none d-sm-block"
        >
          <label class="resolution-date-vcard-title mt-4">
            Resolution Date
          </label>
        </v-col>
        <v-col
          cols="12"
          sm="9"
        >
          <DatePickerShared
            v-show="isEditing"
            ref="resolutionDatePickerRef"
            title="Resolution Date"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="resolutionDateText"
            :minDate="resolutionDateMin"
            :maxDate="resolutionDateMax"
            :inputRules="dateRules"
            @emitDate="onResolutionDate($event)"
            @emitCancel="onResolutionDate($event)"
          />
          <span
            v-show="!isEditing"
            class="info-text"
          >
            {{ resolutionDateLongPacificFormat }}
          </span>
        </v-col>
      </v-row>

      <!-- Resolution Text -->
      <v-row
        no-gutters
        class="mt-8"
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4 d-none d-sm-block"
        >
          <label class="resolution-text-vcard-title mt-4">
            Resolution Text
          </label>
        </v-col>
        <v-col
          cols="12"
          sm="9"
        >
          <div v-if="isEditing">
            <!-- For Vue 3, remove this WYSIWYG editor, consult with assets team -->
            <tiptap-vuetify
              id="resolution-text-editor"
              v-model="resolution"
              auto-grow
              :extensions="extensions"
              :class="{ 'invalid': resolutionInvalid }"
              placeholder="Full text of the resolution"
              :card-props="{
                flat: true,
                style: 'background: rgba(0, 0, 0, 0.06)',
              }"
              :editor-properties="{ editorProps: editorProperties }"
            />
            <!-- Note: This component has no built in validation or rules. -->
            <div
              id="editorValidation"
              :class="{'v-text-field__details': true, 'mt-2': true }"
            >
              <div
                class="v-messages theme--light error--text"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <v-slide-y-transition>
                    <div
                      v-if="resolutionInvalid"
                      class="v-messages__message"
                    >
                      Resolution Text is required
                    </div>
                  </v-slide-y-transition>
                </div>
              </div>
            </div>
            <p class="summary-text info-text">
              Note: If you are pasting text,
              <strong>we recommend pasting plain text</strong>
              to avoid formatting and font issues with PDF and printed
              registrations. If you have pasted text other than plain text, verify
              that your documents are correct. If they are not correct, they will
              need to be amended.
            </p>
          </div>
          <div
            v-else
            v-sanitize="getSpecialResolution.resolution"
            class="resizable info-text"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
  Table,
  TableCell,
  TableHeader,
  TableRow
} from 'tiptap-vuetify'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { useStore } from '@/store/store'
import { VuetifyRuleFunction } from '@/types'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces'
import DateUtilities from '@/services/date-utilities'

@Component({
  components: {
    DatePickerShared,
    TiptapVuetify
  }
})
export default class ResolutionEditor extends Vue {
  @Getter(useStore) getBusinessFoundingDateTime!: string
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF

  @Action(useStore) setSpecialResolution!: (x: SpecialResolutionIF) => void
  @Action(useStore) setSpecialResolutionValid!: (x: boolean) => void

  @Prop({ default: false }) readonly isEditing!: boolean

  $refs!: {
    resolutionDatePickerRef: DatePickerShared,
  }

  resolution = ''
  resolutionDateText = ''
  resolutionOriginal = '' // for undo for corrections.
  resolutionDateTextOriginal = '' // for undo for corrections.

  extensions = [
    History,
    Blockquote,
    Underline,
    Strike,
    Italic,
    ListItem,
    BulletList,
    OrderedList,
    [
      Heading,
      {
        options: {
          levels: [1, 2, 3]
        }
      }
    ],
    Bold,
    HorizontalRule,
    HardBreak,
    Table,
    TableCell,
    TableHeader,
    TableRow
  ]

  editorProperties = {
    transformPastedText (text) {
      return text.replaceAll(/[\u200B-\u200D\uFEFF\u200E\u200F]|(?:&#x200E;)/g, '') // eslint-disable-line
    },
    transformPastedHTML (html) {
      return html.replaceAll(/[\u200B-\u200D\uFEFF\u200E\u200F]|(?:&#x200E;)/g, '') // eslint-disable-line
    }
  }

  /** Validations rules for resolution date field. */
  get dateRules (): Array<VuetifyRuleFunction> {
    return [
      (v: string) => !!v || 'Resolution date is required',
      (v: string) =>
        this.isValidDateRange(this.resolutionDateMin,
          this.resolutionDateMax,
          v) ||
        `Date should be between ${DateUtilities.yyyyMmDdToPacificDate(this.resolutionDateMin, true)} and
         ${DateUtilities.yyyyMmDdToPacificDate(this.resolutionDateMax, true)}`
    ]
  }

  /**
   * True if date is >= the minimum (ie, today) and <= the maximum (ie, the 10th day).
   * This is used for Vue form validation (in Date Rules above).
   */
  isValidDateRange (minDateStr: string, maxDateStr: string, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    const minDate = DateUtilities.yyyyMmDdToDate(minDateStr)
    const maxDate = DateUtilities.yyyyMmDdToDate(maxDateStr)
    // Input is in the format of MM dd, yyyy - only compare year/month/day (ignore time)
    const utcDateStr = new Date(dateStrToValidate + ' 00:00 UTC').toISOString().split('T')[0]
    const pstDate = DateUtilities.yyyyMmDdToDate(utcDateStr)
    return (pstDate >= minDate && pstDate <= maxDate)
  }

  /** The minimum resolution date that can be entered (incorporation date). */
  get resolutionDateMin (): string {
    const date = DateUtilities.apiToDate(this.getBusinessFoundingDateTime)
    return DateUtilities.dateToYyyyMmDd(date)
  }

  /** The maximum resolution date that can be entered (today). */
  get resolutionDateMax (): string {
    return this.getCurrentDate
  }

  /* Determines if we should show validation for resolution text, substitute for rules. */
  get resolutionInvalid (): boolean {
    return this.resolution === '<p></p>' || (this.getComponentValidate && !this.resolution)
  }

  get resolutionDateLongPacificFormat (): string {
    return DateUtilities.yyyyMmDdToPacificDate(this.resolutionDateText, true, false)
  }

  /** Called to update resolution date. */
  async onResolutionDate (val: string): Promise<void> {
    if (this.resolutionDateText === val) {
      return
    }
    this.resolutionDateText = val
    if (this.getComponentValidate) {
      this.emitDate(this.resolutionDateText)
      await this.onValidate()
    }
  }

  /* Save event called from parent via ref. */
  async saveToStore (): Promise<void> {
    await this.setSpecialResolution({
      ...this.getSpecialResolution,
      resolutionDate: this.resolutionDateText,
      resolution: this.resolution
    })
  }

  /* Undo event called from parent via ref. */
  async undoToStore (): Promise<void> {
    this.resolution = this.resolutionOriginal
    this.resolutionDateText = this.resolutionDateTextOriginal
    this.emitDate(this.resolutionDateText)
    await this.setSpecialResolution({
      ...this.getSpecialResolution,
      resolutionDate: this.resolutionDateText,
      resolution: this.resolution
    })
  }

  @Watch('isEditing')
  onIsEditingChange (val: boolean): void {
    if (!val) return
    this.resolutionOriginal = this.resolution
    this.resolutionDateTextOriginal = this.resolutionDateText
  }

  @Watch('resolution')
  async onResolutionChange () : Promise<void> {
    if (this.getComponentValidate) {
      await this.onValidate()
    }
  }

  /**
  * While coming back from summary page, this form need to show existing values.
  * Note: The data is loaded before the component is created.
  */
  created () {
    this.resolution = this.getSpecialResolution.resolution || ''
    this.resolutionDateText = this.getSpecialResolution.resolutionDate || ''
    this.resolutionOriginal = this.resolution
    this.resolutionDateTextOriginal = this.resolutionDateText
  }

  /** Used to trigger validate from outside of component. */
  @Watch('getComponentValidate')
  async onValidate (includeIsEditing = true): Promise<void> {
    const hasData = !!this.resolutionDateText && !!this.resolution && this.resolution !== '<p></p>'
    this.$refs.resolutionDatePickerRef.validateForm()
    const isResolutionDateValid = this.$refs.resolutionDatePickerRef.isDateValid()
    const isValid = hasData && isResolutionDateValid && (!includeIsEditing || !this.isEditing)
    this.setSpecialResolutionValid(isValid)
  }

  @Emit('emitDate')
  emitDate (date: string) { return date }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#editorValidation {
  padding: 0 12px;
}

:deep(.tiptap-vuetify-editor__content) {
  overflow-y: scroll;
  resize: vertical;
  min-width: 100%;
  min-height: 90px;
  height: 425px;
  max-height: 800px;
  transition: none;
  table td {
    white-space: normal;
  }
}

div#resolution-text-editor {
  border-bottom: 1px solid;
  &:deep(.is-editor-empty:first-child:before) {
      font-style: normal;
  }
  &.invalid {
    border-bottom: 1px solid $BCgovInputError;
    :deep(.is-editor-empty:first-child:before) {
      color: $BCgovInputError;
    }
  }
}

.resizable {
  padding: 30px;
  border: 1px solid $gray1;
  overflow-y: auto;
  resize: vertical;
  min-width: 100%;
  max-width: 400px;
  min-height: 90px;
  height: 425px;
  max-height: 800px;
}
</style>
