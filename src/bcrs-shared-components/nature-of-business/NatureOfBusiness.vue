<template>
  <div id="nature-of-business">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label>Nature of Business</label>
        <v-chip
          v-if="hasNaicsChanges"
          id="edited-chip"
          x-small
          label
          color="primary"
          text-color="white"
        >
          {{ editedLabel }}
        </v-chip>
      </v-col>

      <v-col
        cols="12"
        sm="9"
      >
        <div v-if="state !== States.SUMMARY">
          <p class="ma-0">
            Enter one or more keywords that describe the primary nature of your business or enter
            the six-digit NAICS code. Learn more by visiting the
            <a
              :href="STATS_CAN_URL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Statistics Canada website</span>
            </a>
            <v-icon
              size="small"
              color="primary"
            >
              mdi-open-in-new
            </v-icon>.
          </p>
          <v-text-field
            v-model="searchField"
            variant="filled"
            persistent-hint
            class="mt-5"
            autocomplete="chrome-off"
            label="Keywords or Six-Digit NAICS"
            hint="Example: landscaping, grocery, automotive repair, etc."
            :name="Math.random()"
            :rules="showErrors ? natureOfBusinessRules: []"
            @keydown.enter="onSearchClicked()"
          >
            <template #append>
              <v-btn
                id="nob-search-btn"
                variant="flat"
                color="primary"
                :loading="state === States.SEARCHING"
                @click="onSearchClicked()"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <template v-if="state === States.INITIAL && haveNaics">
            <v-btn
              id="nob-cancel1-btn"
              size="large"
              variant="outlined"
              color="primary"
              class="float-right"
              @click="onCancelClicked()"
            >
              <span>Cancel</span>
            </v-btn>
          </template>
        </div>

        <div
          v-if="state === States.SHOW_RESULTS"
          class="mt-5"
        >
          <p class="ma-0">
            Select an option below that best describes the nature of your business:
          </p>
          <div
            id="result-list"
            class="mt-5"
          >
            <NaicsResult
              v-for="(result, index) in searchResults"
              :key="index"
              :result="result"
              @click="onResultClicked(result)"
            />
            <!-- NB: NAICS help panel needs same formatting as NaicsResult -->
            <v-row
              no-gutters
              class="pa-6"
            >
              <v-col cols="2" />
              <v-col cols="10">
                <NaicsHelpText />
              </v-col>
            </v-row>
          </div>
          <v-btn
            id="nob-cancel2-btn"
            size="large"
            variant="outlined"
            color="primary"
            class="float-right mt-8"
            @click="onCancelClicked()"
          >
            <span>Cancel</span>
          </v-btn>
        </div>

        <div
          v-if="state === States.NO_RESULTS"
          class="mt-5"
        >
          <p class="font-weight-bold">
            No results found.
          </p>
          <NaicsHelpText />
          <v-btn
            id="nob-cancel3-btn"
            size="large"
            variant="outlined"
            color="primary"
            class="float-right mt-8"
            @click="onCancelClicked()"
          >
            <span>Cancel</span>
          </v-btn>
        </div>

        <div
          v-if="state === States.SUMMARY"
          class="summary-block d-flex justify-space-between align-center"
        >
          <span v-if="naicsCode && naicsDescription">{{ naicsCode }} - {{ naicsDescription }}</span>
          <span v-else-if="naicsCode">{{ naicsCode }}</span>
          <span v-else-if="naicsDescription">{{ naicsDescription }}</span>
          <span v-else>(Not entered)</span>

          <v-btn
            v-if="!hasNaicsChanges"
            id="nob-edit-btn"
            variant="text"
            color="primary"
            @click="onChangeClicked()"
          >
            <v-icon size="small">
              mdi-pencil
            </v-icon>
            <span>{{ editLabel }}</span>
          </v-btn>

          <div
            v-else
            id="nob-more-actions"
          >
            <v-btn
              id="nob-undo-btn"
              variant="text"
              color="primary"
              @click="emitUndo()"
            >
              <v-icon size="small">
                mdi-undo
              </v-icon>
              <span>Undo</span>
            </v-btn>
            <v-menu
              v-model="dropdown"
              offset-y
              location="left"
              nudge-bottom="4"
            >
              <template #activator="{ on }">
                <v-btn
                  id="nob-menu-btn"
                  variant="text"
                  size="small"
                  color="primary"
                  v-on="on"
                >
                  <v-icon>{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                </v-btn>
              </template>
              <v-btn
                id="more-changes-btn"
                variant="text"
                color="primary"
                class="py-5"
                @click="onChangeClicked(); dropdown = false"
              >
                <v-icon
                  size="small"
                  color="primary"
                >
                  mdi-pencil
                </v-icon>Change
              </v-btn>
            </v-menu>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import NaicsHelpText from './NaicsHelpText.vue'
import NaicsResult from './NaicsResult.vue'
import { NaicsIF, NaicsResultIF } from '@bcrs-shared-components/interfaces'

enum States {
  INITIAL = 'initial',
  SEARCHING = 'searching',
  SHOW_RESULTS = 'show results',
  NO_RESULTS = 'no results',
  SUMMARY = 'summary'
}

@Component({
  components: { NaicsHelpText, NaicsResult }
})
export default class NatureOfBusiness extends Vue {
  readonly STATS_CAN_URL = 'https://www.statcan.gc.ca/en/subjects/standard/naics/2017/v3/index'

  /** Whether to show errors. */
  @Prop({ required: true }) readonly showErrors!: boolean

  /** The NAICS object. */
  @Prop({ required: true }) readonly naics!: NaicsIF

  /** Class for NAICS services. */
  @Prop({ required: true }) readonly NaicsServices!: any

  /** Whether to display Change features. */
  @Prop({ default: false }) readonly hasNaicsChanges!: boolean

  /** Edit label name (ie, 'Change' or 'Correct'). */
  @Prop({ default: 'Change' }) readonly editLabel!: string

  /** Edited label name (ie, 'Changed' or 'Corrected'). */
  @Prop({ default: 'Changed' }) readonly editedLabel!: string

  // enum for template
  readonly States = States

  // local variables
  private state = States.INITIAL
  private searchField = ''
  private searchResults: Array<NaicsResultIF> = []

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  /** The text field validation rules. */
  readonly natureOfBusinessRules: Array<(v) => boolean | string> = [
    v => !!v || 'Nature of Business is required'
  ]

  /** The NAICS code. */
  get naicsCode (): string {
    return this.naics.naicsCode
  }

  /** The NAICS description. */
  get naicsDescription (): string {
    return this.naics.naicsDescription
  }

  /** Whether we have stored NAICS data. */
  get haveNaics (): boolean {
    return (!!this.naicsCode || !!this.naicsDescription)
  }

  /** Whether this form is valid. */
  get isFormValid (): boolean {
    return (this.haveNaics && this.state === States.SUMMARY)
  }

  /** Called when user has clicked the Search button. */
  protected async onSearchClicked (): Promise<void> {
    // remove extra whitespace
    this.searchField = this.searchField.trim().replaceAll(/\s+/g, ' ')

    // safety check
    if (this.searchField) {
      this.state = States.SEARCHING

      this.searchResults = await this.NaicsServices.search(this.searchField).catch(() => [])

      // display appropriate section
      this.state = (this.searchResults.length > 0) ? States.SHOW_RESULTS : States.NO_RESULTS
    }
  }

  /** Called when user has clicked a particular result. */
  protected onResultClicked (result: any): void {
    // safety check
    if (result) {
      // set store value
      this.setNaics({
        naicsCode: result.code,
        naicsDescription: result.classTitle
      })

      this.state = States.SUMMARY
    }
  }

  /** Called when user has clicked the Cancel button. */
  protected onCancelClicked (): void {
    // if we have stored NAICS data then display summary
    // otherwise go back to INITIAL state
    this.state = this.haveNaics ? States.SUMMARY : States.INITIAL
  }

  /** Called when user has clicked the Change button. */
  protected onChangeClicked (): void {
    // set search to current NOB
    this.searchField = this.naicsDescription.toLowerCase()
    this.state = States.INITIAL
  }

  /** Called when haveNaics property (which is based on this component's props) has changed. */
  @Watch('haveNaics', { immediate: true })
  private onHaveNaicsChanged (val: boolean): void {
    this.state = val ? States.SUMMARY : States.INITIAL
  }

  /** Called when this form's validity has changed. */
  @Watch('isFormValid', { immediate: true })
  private onIsFormValidChanged (val: boolean): void {
    this.emitValid(val)
  }

  /** Emits event to update the NAICS object. */
  @Emit('setNaics')
  private setNaics (val: NaicsIF): void {}

  /** Emits undo event. */
  @Emit('undoNaics')
  private emitUndo (): void {}

  /** Emits event to update this component's validity. */
  @Emit('valid')
  private emitValid (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#nature-of-business {
  .col-sm-3 {
    color: $gray9;
    font-weight: bold;
  }

  .col-sm-9 {
    color: $gray7;
  }
}

.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}

#nob-search-btn {
  min-width: unset;
  margin-top: -6px;
  padding: 8px;
}

#nob-edit-btn {
  margin-right: -14px;
}

#nob-more-actions {
  margin-right: -14px;
  white-space: nowrap;

  #nob-undo-btn {
    min-width: unset;
    border-right: 1px solid $gray1;
  }
}

#result-list {
  background-color: $gray1;
  max-height: 650px;
  overflow-y: auto;
}

.summary-block {
  margin-top: -6px; // compensate for Change button pushing this col down
}

// Vuetify overrides
:deep(.v-text-field .v-label) {
  font-weight: normal;
}
</style>
