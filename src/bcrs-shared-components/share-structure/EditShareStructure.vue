<template>
  <div id="edit-share-structure">
    <ConfirmDialog
      ref="confirm"
      attach="#edit-share-structure"
    />

    <v-expand-transition>
      <ul class="list add-share-structure">
        <li class="add-share-structure-container">
          <div class="meta-container">
            <label class="add-share-structure-header" :class="{'error-text': invalidSection}">
              <span v-if="activeIndex === -1" class="pl-5" :class="{'pl-10 text-body-3': isSeries}">
                Add Share {{ shareStructure.type }}
              </span>
              <span v-else :class="{'pl-10 text-body-3': isSeries}">Edit Share {{ shareStructure.type }}</span>
            </label>

            <div class="meta-container__inner">
              <v-form
                ref="shareStructureForm"
                class="share-structure-form"
                v-model="formValid"
                v-on:submit.prevent="addShareStructure()">
                <v-text-field
                  filled
                  :label="shareStructure.type + ' Name [Shares]'"
                  :hint="'Enter the name of the  '+ shareStructure.type.toLowerCase() +
                  '  - the word &quot;Shares&quot; is automatically added'"
                  id="txt-name"
                  v-model="shareStructure.name"
                  :rules="nameRules"
                  suffix="Shares"
                  persistent-hint/>

                <v-divider class="separator" />

                <v-radio-group
                  v-model="hasNoMaximumShares"
                  column
                  class="radio-group"
                  @change="changeMaximumShareFlag()">
                  <v-radio :value="false">
                    <template v-slot:label>
                      <v-row><v-col cols="6">
                        <v-text-field
                          filled
                          label="Maximum Number of Shares"
                          id="txt-max-shares"
                          v-model.number="shareStructure.maxNumberOfShares"
                          persistent-hint
                          :hint="'Enter the maximum number of shares in the ' + shareStructure.type.toLowerCase()"
                          :rules="maximumShareRules"
                          :disabled="hasNoMaximumShares"/>
                      </v-col></v-row>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="No maximum" id="lbl-no-maximum" v-if="isNoMaxSharesVisible"/>
                </v-radio-group>

                <v-divider class="separator mx-4" />

                <v-radio-group
                  v-model="hasNoParValue"
                  column
                  class="radio-group"
                  @change="changeParValueFlag()" v-show="isClass">
                  <v-radio :value="false" id="radio-par-value">
                    <template v-slot:label>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            filled
                            label="Par Value"
                            id="class-par-value"
                            v-model.number="shareStructure.parValue"
                            :rules="parValueRules"
                            hint="Enter the initial value of each share"
                            persistent-hint/>
                        </v-col>
                        <v-col cols="6">
                          <v-select
                            :items="getCurrencyList()"
                            filled
                            label="Currency"
                            v-model="shareStructure.currency"
                            :rules="currencyRules"
                            item-text="`${data.item.name}, ${data.item.code}`"
                            item-value="code"
                            id='class-currency'>
                            <template slot="selection" slot-scope="data">
                              {{ data.item.name }} ({{ data.item.code }})
                            </template>
                            <template slot="item" slot-scope="data">
                              {{ data.item.name }} ({{ data.item.code }})
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="No par value" id="radio-no-par"/>
                </v-radio-group>

                <div v-show="isSeries" class="pl-10">
                  <v-row v-if="shareStructure.hasParValue">
                    <v-col cols="6">
                      <v-text-field
                        label="Par Value"
                        id="series-par-value"
                        :value="shareStructure.parValue"
                        :disabled="true"
                        width="10"/>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        id="series-currency"
                        label="Currency"
                        :value="`${getCurrencyNameByCode(shareStructure.currency)} (${shareStructure.currency})`"
                        :disabled="true"/>
                    </v-col>
                  </v-row>
                  <v-label id="lbl-no-par" v-else>No par value</v-label>
                </div>

                <v-divider class="separator mx-4" />

                <div class="form__row">
                  <v-checkbox
                    id="special-rights-check-box"
                    :label="'This share ' + shareStructure.type.toLowerCase() + ' has special rights or restrictions'"
                    v-model="shareStructure.hasRightsOrRestrictions"
                    @click="confirmSeriesRemoval()"
                  />
                </div>

                <div class="form__row form__btns">
                  <v-btn large outlined color="error" :disabled="activeIndex === -1"
                         @click="removeShareStructure()" id="remove-btn">Remove</v-btn>

                  <v-btn
                    large
                    id="done-btn"
                    class="form-primary-btn"
                    color="primary"
                    @click="validateForm()"
                  >
                    Done
                  </v-btn>

                  <v-btn id="cancel-btn" large outlined color="primary" @click="resetFormAndData(true)">
                    Cancel
                  </v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </li>
      </ul>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'

// Components
import { ConfirmDialog } from '@/bcrs-shared-components/confirm-dialog'

// Interfaces and Enums
import { ConfirmDialogType, FormIF, ShareClassIF } from '@/bcrs-shared-components/interfaces'
import { ActionTypes } from '@/bcrs-shared-components/enums'

// Mixin
import CurrencyLookupMixin from './currency-lookup-mixin'

@Component({
  components: { ConfirmDialog },
  mixins: [CurrencyLookupMixin]
})
export default class EditShareStructure extends Vue {
  // Refs
  declare $refs: Vue['$refs'] & {
    confirm: ConfirmDialogType,
    shareStructureForm: FormIF
  }

  // Props
  @Prop({ default: null }) readonly initialValue!: ShareClassIF
  @Prop({ default: null }) readonly activeIndex!: number
  @Prop({ default: null }) readonly parentIndex!: number
  @Prop({ default: '' }) readonly shareId!: string
  @Prop({ default: [] }) readonly shareClasses!: ShareClassIF[]
  @Prop({ default: false }) readonly resolutionRequired!: boolean

  /** Prompt Error. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  // Text-field Rules
  private nameRules = []
  private maximumShareRules = []
  private parValueRules = []
  private currencyRules = []

  // Data Properties
  private shareStructure: ShareClassIF = null
  private formValid = true
  private hasNoMaximumShares = false
  private hasNoParValue = false
  private hasSeriesShares = false

  private excludedWordsListForClass: string [] = ['share', 'shares', 'value']
  private excludedWordsListForSeries: string [] = ['share', 'shares']

  // Getters
  get isClass (): boolean {
    return this.shareStructure.type === 'Class'
  }

  get isSeries (): boolean {
    return this.shareStructure.type === 'Series'
  }

  get isNoMaxSharesVisible (): boolean {
    return this.isSeries ? !(this.shareClasses[this.parentIndex].hasMaximumShares) : true
  }

  /** The rules applying to the Class/Series name input field. */
  get nameRule (): Array<(v) => boolean | string> {
    const rules: Array<(v) => boolean | string> = [
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
    ]
    if (this.isClass) {
      rules.push(
        (v: string) => !!v || 'Enter the name of the class - the word "Shares" is automatically added',
        (v: string) => !(this.shareClasses
          .find((s, index) => {
            // Don't apply uniqueness check to self
            return index !== this.activeIndex && s.name.split(' Shares')[0].toLowerCase() === v.toLowerCase()
          })
        ) || 'Class name must be unique')
      rules.push(
        (v: string) => !(v.split(' ').some(r => this.excludedWordsListForClass.includes(r.toLowerCase()))) ||
          'Class name should not contain any of the words share, shares or value')
    } else if (this.isSeries) {
      rules.push(
        (v: string) => !!v || 'Enter the name of the series - the word "Shares" is automatically added',
        (v: string) => !(this.shareClasses[this.parentIndex].series
          .find((s, index) => {
            // Don't apply uniqueness check to self
            return index !== this.activeIndex &&
                s.name.split(' Shares')[0].toLowerCase() === v.toLowerCase()
          })
        ) || 'Series name must be unique')
      rules.push(
        (v: string) => !(v.split(' ').some(r => this.excludedWordsListForSeries.includes(r.toLowerCase()))) ||
          'Series name should not contain any of the words share or shares')
    }
    return rules
  }

  /** The rules applying to the Class/Series max share input field. */
  get maximumShareRule (): Array<(v) => boolean | string> {
    let rules: Array<(v) => boolean | string> = []
    if (!this.hasNoMaximumShares) {
      rules = [
        (v: string) => (v !== '' && v !== null && v !== undefined) || 'Number of shares is required',
        (v: string) => /^-?\d+$/.test(v) || 'Must be a whole number',
        (v: string) => (+v > 0) || 'Number must be greater than 0',
        (v: string) => (v && v.toString().length < 16) || 'Number must be less than 16 digits'
      ]
      // To prevent changing share class value to a lower value after adding series.
      if (this.isClass && this.activeIndex !== -1 && !this.hasNoMaximumShares &&
        this.shareStructure.series.length > 0) {
        const seriesSum = this.shareStructure.series.reduce((a, b) => +a + +b.maxNumberOfShares, 0)
        rules.push(
          (v: string) => !!v || 'Enter the maximum number of shares in the class',
          (v: string) => +v >= seriesSum ||
            'The number for the series (or all series combined, if there are multiple under ' +
            'a class) cannot exceed the number for the class')
      }
      if (this.isSeries && this.shareClasses[this.parentIndex].hasMaximumShares) {
        let filteredSeries = this.shareClasses[this.parentIndex].series
        // The series is in edit mode and should be avoided from the calculating the total
        if (this.activeIndex !== -1) {
          filteredSeries = filteredSeries.filter((series) => (
            series.id !== this.shareClasses[this.parentIndex].series[this.activeIndex].id))
        }
        const currentSum = filteredSeries.reduce((a, b) => +a + +b.maxNumberOfShares, 0)
        rules.push(
          (v: string) => !!v || 'Enter the maximum number of shares in the series',
          (v: string) => +v + currentSum <= +this.shareClasses[this.parentIndex].maxNumberOfShares ||
            'The number for the series (or all series combined, if there are multiple under ' +
            'a class) cannot exceed the number for the class')
      }
    }
    return rules
  }

  /** The rules applying to the Class/Series par value input field. */
  get parValueRule (): Array<(v) => boolean | string> {
    let rules: Array<(v) => boolean | string> = []
    if (!this.hasNoParValue) {
      rules = [
        (v: string) => (v !== '' && v !== null && v !== undefined) || 'Par value is required',
        (v: string) => +v > 0 || 'Amount must be greater than 0',
        (v: string) => (+v < 1)
          ? (/^(\d+(\.\d{0,3})?|\.\d{0,3})$/.test(v) || 'Amounts less than 1 can be entered with up to 3 decimal place')
          : (/^\d+(\.\d{1,2})?$/.test(v) || 'Amounts greater than 1 can be entered with up to 2 decimal place')]
    }
    return rules
  }

  /** The rules applying to the Class/Series currency input field. */
  get currencyRule (): Array<(v) => boolean | string> {
    if (!this.hasNoParValue) {
      return [(v: string) => !!v || 'Currency is required']
    }
    return []
  }

  /** Called when component is created. */
  created (): void {
    if (this.initialValue) {
      this.shareStructure = { ...this.initialValue }
      this.hasNoMaximumShares = !this.shareStructure.hasMaximumShares
      this.hasNoParValue = !this.shareStructure.hasParValue
      this.hasSeriesShares = this.shareStructure.hasRightsOrRestrictions &&
        (this.shareStructure.series && this.shareStructure.series.length >= 1)
      if (this.activeIndex !== -1) {
        const name = this.shareStructure.name
        this.shareStructure.name = name.substr(0, name.indexOf(' Shares'))
      }
    }
  }

  /** Applies the Rules to the input fields and validate. */
  protected async validateForm (): Promise<void> {
    this.nameRules = this.nameRule
    this.maximumShareRules = this.maximumShareRule
    this.parValueRules = this.parValueRule
    this.currencyRules = this.currencyRule

    // Await the applied rules and validate form
    await this.$nextTick()
    this.$refs.shareStructureForm.validate()

    if (this.formValid) {
      const shareStructure: ShareClassIF = this.addShareStructure()
      this.emitAddShareStructureEvent(shareStructure)
      this.resetFormAndData(false)
    }
  }

  /**
   * Emit the updated share structure to the parent component.
   * @param shareStructure The object body to emit.
   * */
  private emitAddShareStructureEvent (shareStructure: ShareClassIF): void {
    if (this.isClass) {
      this.emitAddEditShareClassEvent(shareStructure)
    } else if (this.isSeries) {
      this.emitAddEditShareSeriesEvent(shareStructure)
    }
  }

  /** Add a NEW share class or series to the share structure and the appropriate action. */
  protected addShareStructure (): ShareClassIF {
    let shareStructureToAdd: ShareClassIF = { ...this.shareStructure }
    if (this.activeIndex === -1) {
      shareStructureToAdd.id = this.shareId
    }
    shareStructureToAdd.name = `${shareStructureToAdd.name} Shares`
    shareStructureToAdd.hasMaximumShares = !this.hasNoMaximumShares
    shareStructureToAdd.hasParValue = !this.hasNoParValue

    // Check if Corrections disabled share Classes capability to support Series
    if (!shareStructureToAdd.hasRightsOrRestrictions && shareStructureToAdd.series) {
      let addedSeriesIndexes: number[] = []
      shareStructureToAdd.series.forEach(series => {
        // First remove any ADDED series from the list
        if (series.action === ActionTypes.ADDED) {
          // Find the index of the series to remove due to sorting functionality potentially changing indexes
          const seriesIndex = shareStructureToAdd.series.findIndex(x => x.id === series.id)
          addedSeriesIndexes.push(seriesIndex)
        }
      })
      // Remove the added series from the array starting at the highest index, as to not shift the indexes of series
      addedSeriesIndexes.reverse().forEach(index => shareStructureToAdd.series.splice(index, 1))

      // Set the action to REMOVED for any original series
      shareStructureToAdd.series.forEach(series => {
        series.action = ActionTypes.REMOVED
      })
    }
    return shareStructureToAdd
  }

  /** Remove the current share class or series. */
  protected removeShareStructure (): void {
    if (this.isClass) {
      this.emitRemoveShareClassEvent(this.activeIndex)
    } else if (this.isSeries) {
      this.emitRemoveShareSeriesEvent(this.activeIndex)
    }
  }

  /** Reset the form validators. */
  protected resetFormAndData (emitEvent: boolean): void {
    this.$refs.shareStructureForm.reset()
    if (emitEvent) {
      this.emitResetEvent()
    }
  }

  /** Update the maximum share flag. */
  protected changeMaximumShareFlag (): void {
    if (this.hasNoMaximumShares) {
      this.shareStructure.maxNumberOfShares = null
    }
  }

  /** Update the par value flag. */
  protected changeParValueFlag (): void {
    if (this.hasNoParValue) {
      this.shareStructure.currency = null
      this.shareStructure.parValue = null
    }
  }

  /** Middleware to prompt a confirmation of removal or resolution. */
  protected async confirmSeriesRemoval (): Promise<void> {
    if (this.hasSeriesShares && !this.shareStructure.hasRightsOrRestrictions) {
      // open confirmation dialog and wait for response
      this.$refs.confirm.open(
        'Remove Share Series with Class',
        'A share series exists for this class. Removing the Special Rights or Restrictions for this class' +
        ' will remove all associated share series.',
        {
          width: '45rem',
          persistent: true,
          yes: 'Remove',
          no: null,
          cancel: 'Cancel'
        }
      ).then(() => {
        // if we get here, Yes was clicked
        this.shareStructure.hasRightsOrRestrictions = false
      }).catch(() => {
        // if we get here, Cancel was clicked
        this.shareStructure.hasRightsOrRestrictions = true
      })
    } else {
      // Prompt parent to collect resolution info if required
      if (this.resolutionRequired) {
        await this.emitResolutionPrompt(true)
        this.shareStructure.hasRightsOrRestrictions = false
      }
    }
  }

  @Watch('resolutionRequired')
  private updateResolutionRequirement (): any {
    // When resolution requirements have been satisfied, update the model
    this.shareStructure.hasRightsOrRestrictions = !this.resolutionRequired
  }

  // Events
  @Emit('addEditClass')
  private emitAddEditShareClassEvent (shareClass: ShareClassIF): void {}

  @Emit('addEditSeries')
  private emitAddEditShareSeriesEvent (shareSeries: ShareClassIF): void {}

  @Emit('removeClass')
  private emitRemoveShareClassEvent (shareClassIndex: number): void {}

  @Emit('removeSeries')
  private emitRemoveShareSeriesEvent (shareSeriesIndex: number): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('resolutionPrompt')
  private emitResolutionPrompt (requiresPrompt: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  padding-top: 0.5rem;
}

li {
  list-style: None;
  padding-top: 0.25rem;
}

:deep(.v-input .v-label) {
  font-weight: normal !important;
}

.v-btn {
  min-width: 6.5rem !important;
}

.add-share-structure {
  .add-share-structure-container {
    padding: 1.25rem 1.25rem 1.25rem 0;

    .meta-container {
      > label:first-child {
        margin-bottom: 1.5rem;
      }
    }
  }
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }

  &__inner {
    flex: 1 1 auto;
  }
}

.add-share-structure-header {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 10rem;
    }
  }
}

.separator {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.radio-group {
  padding-top:0.875rem
}

:deep(.theme--light.v-btn.v-btn--disabled) {
  color: $app-red !important;
  opacity: 0.4 !important;
}
</style>
