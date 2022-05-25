<template>
  <section id="nature-of-business">
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
        <template v-if="onEditMode">
          <p class="ma-0">
            Provide a brief description of the nature of business (e.g., corner grocery store,
            automotive repair service, landscaping, etc.).
          </p>
          <v-form ref="form" lazy-validation>
            <v-textarea
              filled
              persistent-hint
              class="mt-5"
              autocomplete="chrome-off"
              label="Enter Nature of Business"
              rows="3"
              v-model="naicsText"
              counter="300"
              :rules="naicsRules"
              validate-on-blur
            />
            <div class="float-right mb-2">
              <v-btn large color="primary" id="nob-done-btn" class="mr-2" @click="onSubmitClicked()">
                <span>Done</span>
              </v-btn>
              <v-btn large outlined color="primary" id="nob-cancel-btn" @click="onCancelClicked()">
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-form>
        </template>

        <div v-if="!onEditMode" class="d-flex justify-space-between align-start">
          <span id="naics-summary">{{ naicsSummary }}</span>

          <div v-if="!hasNatureOfBusinessChanged" class="mt-n2 mr-n3">
            <v-btn text color="primary" id="nob-change-btn" @click="onChangeClicked()">
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
          </div>

          <div v-else id="nob-more-actions" class="mt-n2 mr-n3">
            <v-btn text color="primary" id="nob-undo-btn" @click="emitUndo()">
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
            <v-menu offset-y left nudge-bottom="4" v-model="dropdown">
              <template v-slot:activator="{ on }">
                <v-btn text small color="primary" id="nob-menu-btn" v-on="on">
                  <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                </v-btn>
              </template>
              <v-btn text color="primary" id="more-changes-btn" class="py-5"
                @click="onChangeClicked(); dropdown = false">
                <v-icon small color="primary">mdi-pencil</v-icon>Change
              </v-btn>
            </v-menu>
          </div>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import { ActionBindingIF, EntitySnapshotIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'

@Component({})
export default class NatureOfBusiness extends Vue {
  @Getter getCurrentNaics!: NaicsIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // local variables
  private dropdown: boolean = null
  private onEditMode = false
  private naicsText = ''
  private naicsRules = [
    (v: string) => (v?.length <= 300) || 'Maximum 300 characters reached'
  ]

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
      naicsCode: this.getEntitySnapshot.businessInfo?.naicsCode,
      naicsDescription: this.getEntitySnapshot.businessInfo?.naicsDescription
    }
  }

  /** Called when user has clicked the Change button. */
  onChangeClicked (): void {
    this.onEditMode = true
  }

  /** Submited when user has clicked the Done button. */
  onSubmitClicked (): void {
    let validForm = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (validForm) {
      if (!isEqual(this.naicsText, this.naicsSummary)) {
        this.setNaics({
          naicsCode: '',
          naicsDescription: this.naicsText
        })
      }
      this.onEditMode = false
    }
  }

  /** Called when user has clicked the Cancel button. */
  onCancelClicked (): void {
    this.setNaics(this.originalNaics)
    this.onEditMode = false
  }

  emitUndo (): void {
    let code = this.originalNaics.naicsCode
    let desc = this.originalNaics.naicsDescription
    this.naicsText = null
    if (code && desc) {
      this.naicsText = this.hasNatureOfBusinessChanged ? this.naicsText : `${code} - ${desc}`
    } else if (desc) {
      this.naicsText = desc
    }
    this.setNaics(this.originalNaics)
  }

  /** Called when this edit mode has changed. */
  @Watch('onEditMode')
  private onIsEditModeChanged (): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: !this.onEditMode })
    this.emitHaveChanges()
  }

  /** Emits the changed state of this component. */
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return this.hasNatureOfBusinessChanged
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#nob-more-actions {
  min-width: 140px;
}
</style>