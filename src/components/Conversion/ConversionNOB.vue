<template>
  <section id="nature-of-business-section">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label>Nature of Business</label>
        <v-chip
          v-if="hasNatureOfBusinessChanged"
          id="changed-chip"
          x-small label
          color="primary"
          text-color="white"
        >
          Changed
        </v-chip>
      </v-col>

      <v-col cols="12" sm="9">
        <div v-if="onEditMode">
          <p class="ma-0">
            Provide a brief description of the nature of business (e.g., corner grocery store,
            automotive repair service, landscaping, etc.).
          </p>
          <v-text-field
            filled
            persistent-hint
            class="mt-5"
            autocomplete="chrome-off"
            label="Enter Nature of Business"
            v-model="naicsText"
            counter="300"
            :rules="naicsRules"
            @change="onChangeNaics($event)"
          >
          </v-text-field>
          <div id="nob-confirm-container" class="mb-2">
            <v-btn large color="primary" id="nob-done-btn" class="mr-2"
              @click="onSubmitClicked()"
            >
              <span>Done</span>
            </v-btn>
            <v-btn large outlined color="primary" id="nob-cancel-btn"
              @click="onCancelClicked()"
            >
              <span>Cancel</span>
            </v-btn>
          </div>
        </div>

        <div v-if="!onEditMode" class="summary-block d-flex justify-space-between align-center">
          <span id="naics-summary">{{ naicsSummary }}</span>
          <v-btn text color="primary" id="nob-change-btn" @click="onChangeClicked()">
            <v-icon small>mdi-pencil</v-icon>
            <span>Change</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import { ActionBindingIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'

@Component({})
export default class NatureOfBusiness extends Vue {
  @Getter getCurrentNaics!: NaicsIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF

  // local variables
  private onEditMode = false
  private naicsRules = []
  private naicsText = ''

  /** Show naics value, description or (Not Entered) upon first render */
  get naicsSummary (): string {
    const code = this.getCurrentNaics.naicsCode
    const desc = this.getCurrentNaics.naicsDescription
    let summary = '(Not Entered)'
    if (code && desc) {
      this.naicsText = this.hasNatureOfBusinessChanged ? this.naicsText : `${code} - ${desc}`
      summary = `${code} - ${desc}`
    } else if (desc) {
      this.naicsText = desc
      summary = desc
    }
    return summary
  }

  /** The naics data on record for the business. */
  get originalNaics (): NaicsIF {
    return {
      naicsCode: this.getCurrentNaics.naicsCode,
      naicsDescription: this.getCurrentNaics.naicsDescription
    }
  }

  /** Monitor naics text change */
  private onChangeNaics (naicsText:string): void {
    this.naicsRules = naicsText.length > 300 ? ['Maximum 300 characters reached'] : []
  }

  /** Called when user has clicked the Change button. */
  onChangeClicked (): void {
    this.onEditMode = true
  }

  /** Submited when user has clicked the Done button. */
  onSubmitClicked (): void {
    if (this.naicsText.length > 300) {
      this.naicsRules = ['Maximum 300 characters reached']
    } else {
      if (!isEqual(this.naicsText, this.naicsSummary)) {
        this.setNaics({
          naicsCode: '',
          naicsDescription: this.naicsText
        })
      }
      this.onEditMode = false
      this.naicsRules = []
    }
  }

  /** Called when user has clicked the Cancel button. */
  onCancelClicked (): void {
    this.setNaics(this.originalNaics)
    this.onEditMode = false
    this.naicsRules = []
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#nob-confirm-container {
  display: flex;
  justify-content: flex-end;
}
</style>
