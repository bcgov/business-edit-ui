<template>
  <aside id="fee-summary">
    <sbc-fee-summary
      :filingData="[...filingData]"
      :payURL="payApiUrl"
    />

    <v-row no-gutters>
      <v-col
        v-if="isSummaryMode"
        class="pt-3 pr-3"
      >
        <v-btn
          id="back-btn"
          size="large"
          :loading="isLoading"
          @click="emitAction(FeeSummaryActions.BACK)"
        >
          <span><v-icon>mdi-chevron-left</v-icon>Back</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3">
        <v-btn
          id="cancel-btn"
          size="large"
          :loading="isLoading"
          @click="emitAction(FeeSummaryActions.CANCEL)"
        >
          <span>Cancel</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3">
        <v-btn
          id="save-resume-later-btn"
          size="large"
          :loading="isLoading"
          @click="emitAction(FeeSummaryActions.SAVE_RESUME_LATER)"
        >
          <span>Save and Resume Later</span>
        </v-btn>
      </v-col>
      <v-col class="pt-3">
        <v-btn
          id="confirm-btn"
          size="large"
          :disabled="hasConflicts"
          :loading="isLoading"
          @click="emitAction(FeeSummaryActions.CONFIRM)"
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
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'

// Enums and Interfaces
import { FeeSummaryActions } from '@/bcrs-shared-components/enums'
import { FilingDataIF } from '@bcrs-shared-components/interfaces'

// Component Dependency
import SbcFeeSummary from '@/sbc-common-components/components/SbcFeeSummary.vue'

@Component({
  components: { SbcFeeSummary }
})
export default class FeeSummary extends Vue {
  readonly FeeSummaryActions = FeeSummaryActions

  /** Filing information to calculate fees. */
  @Prop({ default: () => [] }) readonly filingData!: Array<FilingDataIF>

  /** URL for Sbc Fee Summary component to get fees. */
  @Prop({ default: '' }) readonly payApiUrl!: string

  /** Indicator that something isn't valid. */
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
  protected emitAction (action: string): void {}
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

  .v-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
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
