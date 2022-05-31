<template>
  <section id="nature-of-business">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label :class="{'error-text': invalidSection}">Nature of Business</label>
        <v-chip
          v-if="hasNatureOfBusinessChanged"
          id="changed-chip"
          x-small label
          color="primary"
          text-color="white"
        >
          <span>Changed</span>
        </v-chip>
      </v-col>

      <v-col cols="12" sm="9">
        <!-- Edit mode -->
        <template v-if="onEditMode">
          <p class="ma-0">
            Provide a brief description of the nature of business (e.g., corner grocery store,
            automotive repair service, landscaping, etc.).
          </p>
          <v-form ref="form" lazy-validation>
            <v-textarea
              filled
              class="mt-5"
              autocomplete="chrome-off"
              placeholder="Enter Nature of Business"
              rows="3"
              v-model="naicsText"
              counter="300"
              :rules="naicsRules"
              validate-on-blur
            />
            <div class="float-right mb-2">
              <v-btn large color="primary" id="nob-done-btn" class="mr-2" @click="onDoneClicked()">
                <span>Done</span>
              </v-btn>
              <v-btn large outlined color="primary" id="nob-cancel-btn" @click="onCancelClicked()">
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-form>
        </template>

        <!-- Display mode -->
        <div v-if="!onEditMode" class="d-flex justify-space-between align-start">
          <span id="naics-summary">{{ naicsSummary }}</span>

          <div v-if="!hasNatureOfBusinessChanged" class="mt-n2 mr-n3">
            <v-btn text color="primary" id="nob-change-btn" @click="onChangeClicked()">
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
          </div>

          <div v-else id="nob-more-actions" class="mt-n2 mr-n3">
            <v-btn text color="primary" id="nob-undo-btn" @click="onUndoClicked()">
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ActionBindingIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'

@Component({})
export default class NatureOfBusiness extends Vue {
  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection!: boolean

  @Getter getCurrentNaics!: NaicsIF
  @Getter getSnapshotNaics!: NaicsIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // local variables
  protected dropdown = false
  protected onEditMode = false
  protected naicsText = ''

  readonly naicsRules = [
    (v: string) => !!v || 'Nature of Business is required',
    (v: string) => (v?.length <= 300) || 'Maximum 300 characters reached'
  ]

  /** The NAICS code, description or (Not entered). */
  get naicsSummary (): string {
    const code = this.getCurrentNaics.naicsCode
    const desc = this.getCurrentNaics.naicsDescription

    if (code && desc) {
      this.naicsText = this.hasNatureOfBusinessChanged ? this.naicsText : `${code} - ${desc}`
      return `${code} - ${desc}`
    } else if (desc) {
      this.naicsText = desc
      return desc
    } else {
      return '(Not entered)'
    }
  }

  /** Called when user has clicked the Change button. */
  protected onChangeClicked (): void {
    this.onEditMode = true
  }

  /** Called when user has clicked the Done button. */
  protected onDoneClicked (): void {
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
  protected onCancelClicked (): void {
    this.onEditMode = false
  }

  /** Called when user has clicked the Undo button. */
  protected onUndoClicked (): void {
    const code = this.getSnapshotNaics.naicsCode
    const desc = this.getSnapshotNaics.naicsDescription
    this.naicsText = null
    if (code && desc) {
      this.naicsText = this.hasNatureOfBusinessChanged ? this.naicsText : `${code} - ${desc}`
    } else if (desc) {
      this.naicsText = desc
    }
    this.setNaics(this.getSnapshotNaics)
  }

  /** Called when this edit mode has changed. */
  @Watch('onEditMode', { immediate: true })
  private onIsEditModeChanged (): void {
    this.updateValidity()
  }

  /** Called when NAICS Description has changed. */
  @Watch('getCurrentNaics.naicsDescription', { immediate: true })
  private onNaicsDescriptionChanged (): void {
    this.updateValidity()
  }

  private updateValidity (): void {
    const isValid = (!this.onEditMode && !!this.getCurrentNaics.naicsDescription)
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// prevent buttons from wrapping
#nob-more-actions {
  min-width: 140px;
}
</style>
