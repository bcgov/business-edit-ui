<template>
  <aside id="fee-summary">
    <SbcFeeSummary
      :filingData="[...filingData]"
      :payURL="payApiUrl"
    />

    <v-row no-gutters>
      <v-col
        v-if="isSummaryMode"
        class="pt-3 px-1"
      >
        <v-btn
          id="back-btn"
          large
          :loading="buttonStatus[FeeSummaryActions.BACK] === ButtonState.LOADING"
          :disabled="buttonStatus[FeeSummaryActions.BACK] === ButtonState.DISABLE"
          @click="handleClick(FeeSummaryActions.BACK)"
        >
          <span><v-icon>mdi-chevron-left</v-icon>Back</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3 px-1">
        <v-btn
          id="cancel-btn"
          large
          :loading="buttonStatus[FeeSummaryActions.CANCEL] === ButtonState.LOADING"
          :disabled="buttonStatus[FeeSummaryActions.CANCEL] === ButtonState.DISABLE"
          @click="handleClick(FeeSummaryActions.CANCEL)"
        >
          <span>Cancel</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3 px-1">
        <v-btn
          id="save-resume-later-btn"
          large
          :loading="buttonStatus[FeeSummaryActions.SAVE_RESUME_LATER] === ButtonState.LOADING"
          :disabled="buttonStatus[FeeSummaryActions.SAVE_RESUME_LATER] === ButtonState.DISABLE"
          @click="handleClick(FeeSummaryActions.SAVE_RESUME_LATER)"
        >
          <span>Save and Resume Later</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3 px-1">
        <v-btn
          id="confirm-btn"
          large
          :loading="buttonStatus[FeeSummaryActions.CONFIRM] === ButtonState.LOADING"
          :disabled="buttonStatus[FeeSummaryActions.CONFIRM] === ButtonState.DISABLE"
          @click="handleClick(FeeSummaryActions.CONFIRM)"
        >
          <span>{{ confirmLabel }}<v-icon>mdi-chevron-right</v-icon></span>
        </v-btn>
      </v-col>
    </v-row>

    <div
      v-if="errorMessage"
      class="error-msg pre-wrap mt-1"
      v-html="errorMessage"
    />
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { FeeSummaryActions } from '@bcrs-shared-components/enums'
import { FilingDataIF } from '@bcrs-shared-components/interfaces'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'

/* eslint-disable no-unused-vars */
/** Button state enum */
enum ButtonState {
  DEFAULT = '',
  LOADING = 'loading',
  DISABLE = 'disable'
}

type ButtonStatusMap = {
  [key in FeeSummaryActions]: ButtonState
}
/* eslint-enable no-unused-vars */

@Component({
  components: { SbcFeeSummary }
})
export default class FeeSummary extends Vue {
  readonly FeeSummaryActions = FeeSummaryActions
  readonly ButtonState = ButtonState

  /** Filing information to calculate fees. */
  @Prop({ default: () => [] }) readonly filingData!: Array<FilingDataIF>

  /** URL for Sbc Fee Summary component to get fees. */
  @Prop({ default: '' }) readonly payApiUrl!: string

  /** Whether to disable the Save and Resume Later button. */
  @Prop({ default: false }) readonly disableSaveResumeLater!: boolean

  /** Indicator that something isn't valid. This disables the confirm button. */
  @Prop({ default: false }) readonly hasConflicts!: boolean

  /** Indicator that there is a request in progress. */
  @Prop({ default: false }) readonly isLoading!: boolean

  /** Label for Confirm button. */
  @Prop({ default: 'Confirm' }) readonly confirmLabel!: string

  /** Message to display if there is an error. */
  @Prop({ default: '' }) readonly errorMessage!: string

  /** Prop to indicate summary mode. */
  @Prop({ default: false }) readonly isSummaryMode!: boolean

  /** Emit action event. */
  @Emit('action')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitAction (action: FeeSummaryActions): void {}

  /** Stores the action currently being processed */
  currentLoadingAction: FeeSummaryActions | null = null

  /** Watch for isLoading changes from parent */
  @Watch('isLoading')
  onIsLoadingChanged (newVal: boolean): void {
    if (!newVal) {
      this.currentLoadingAction = null
    }
  }

  /** Base button statuses based on props */
  get baseButtonStatus (): ButtonStatusMap {
    return {
      [FeeSummaryActions.BACK]: ButtonState.DEFAULT,
      [FeeSummaryActions.CANCEL]: ButtonState.DEFAULT,
      [FeeSummaryActions.SAVE_RESUME_LATER]: this.disableSaveResumeLater ? ButtonState.DISABLE : ButtonState.DEFAULT,
      [FeeSummaryActions.CONFIRM]: this.hasConflicts ? ButtonState.DISABLE : ButtonState.DEFAULT
    }
  }

  /** Computes current button statuses dynamically */
  get buttonStatus (): ButtonStatusMap {
    if (!this.isLoading || !this.currentLoadingAction) {
      return this.baseButtonStatus
    }

    const status = { ...this.baseButtonStatus }
    Object.values(FeeSummaryActions).forEach(action => {
      status[action] = action === this.currentLoadingAction ? ButtonState.LOADING : ButtonState.DISABLE
    })

    return status
  }

  /** Handle button click */
  handleClick (action: FeeSummaryActions): void {
    this.currentLoadingAction = action
    this.emitAction(action)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#fee-summary {
  .v-btn {
    width: 100%;
    border: 1.25px solid $app-blue;
    color: $app-blue;
    box-shadow: 0 1px 2px 0 rgba(33,37,41,0.2);
    border-radius: 4px;
  }

  #confirm-btn {
    color: white;
    background-color: $app-blue;
    font-weight: bold;
  }

  .error-msg {
    font-size: 0.75rem;
    color: $app-red;
    text-align: center;
  }

  :deep(.fee-list) {
    padding-left: 0;
  }
}
</style>
