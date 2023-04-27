<template>
  <div
    id="recognition-date-time"
    class="section-container"
  >
    <v-row no-gutters>
      <v-col
        cols="3"
        class="pr-2"
      >
        <label><strong>Recognition Date and Time</strong></label>
      </v-col>

      <v-col cols="9">
        <span class="info-text mr-1">{{ recognitionDateTime || 'Unknown' }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { Getter } from '@/store/PiniaClass'
import DateUtilities from '@/services/date-utilities'
import { useStore } from '@/store/store'

@Component({})
export default class RecognitionDateTime extends Vue {
  // store getters
  @Getter(useStore) getBusinessFoundingDateTime!: string
  @Getter(useStore) getCorrectedFilingDate!: string
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isBenBcCccUlcCorrectionFiling!: boolean
  @Getter(useStore) isRestorationFiling!: boolean

  /** The recognition date or business start date string. */
  get recognitionDateTime (): string {
    if (this.isBenBcCccUlcCorrectionFiling || this.isRestorationFiling) {
      if (this.getBusinessFoundingDateTime) {
        return DateUtilities.apiToPacificDateTime(this.getBusinessFoundingDateTime)
      }
      if (this.getCorrectedFilingDate) {
        return DateUtilities.apiToPacificDateTime(this.getCorrectedFilingDate)
      }
    }
    if (this.isAlterationFiling) {
      if (this.getBusinessFoundingDateTime) {
        return DateUtilities.apiToPacificDateTime(this.getBusinessFoundingDateTime)
      }
    }
    return null
  }
}
</script>
