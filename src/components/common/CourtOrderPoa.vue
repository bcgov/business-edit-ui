<template>
  <section
    id="court-order-poa"
    class="pb-6"
  >
    <header>
      <h2>{{ sectionNumber }} Court Order and Plan of Arrangement</h2>
      <div class="py-4">
        If this filing is pursuant to a court order, enter the court order number. If this
        filing is pursuant to a plan of arrangement, enter the court order number and select
        Plan of Arrangement.
      </div>
    </header>
    <div :class="{ 'invalid-section': invalidCourtOrder }">
      <v-card
        flat
        class="section-container py-6"
      >
        <CourtOrderPoaShared
          id="court-order"
          :autoValidation="getAppValidate"
          :draftCourtOrderNumber="getFileNumber"
          :hasDraftPlanOfArrangement="getHasPlanOfArrangement"
          :invalidSection="invalidCourtOrder"
          @emitCourtNumber="setFileNumber($event)"
          @emitPoa="setHasPlanOfArrangement($event)"
          @emitValid="setValidCourtOrder($event)"
        />
      </v-card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { Action, Getter } from '@/utils/'
import { CourtOrderPoa as CourtOrderPoaShared } from '@/bcrs-shared-components/court-order-poa'
import { ActionBindingIF, FlagsReviewCertifyIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({
  components: {
    CourtOrderPoaShared
  }
})
export default class CourtOrderPoa extends Vue {
  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  // Store getters
  @Getter(useStore) getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getFileNumber!: string
  @Getter(useStore) getHasPlanOfArrangement!: boolean

  // Store actions
  @Action(useStore) setValidCourtOrder!: ActionBindingIF
  @Action(useStore) setHasPlanOfArrangement!: ActionBindingIF
  @Action(useStore) setFileNumber!: ActionBindingIF

  /** True if this component is invalid. */
  get invalidCourtOrder (): boolean {
    return (this.getAppValidate && !this.getFlagsReviewCertify.isValidCourtOrder)
  }
}
</script>
