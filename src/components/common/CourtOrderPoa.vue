<template>
  <section class="pb-6" id="court-order-poa">
    <header>
      <h2>{{sectionNumber}} Court Order and Plan of Arrangement</h2>
      <div class="py-4">
        If this filing is pursuant to a court order, enter the court order number. If this
        filing is pursuant to a plan of arrangement, enter the court order number and select
        Plan of Arrangement.
      </div>
    </header>
    <div :class="{ 'invalid-section': invalidCourtOrder }">
      <v-card flat class="section-container py-6">
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
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CourtOrderPoa as CourtOrderPoaShared } from '@bcrs-shared-components/court-order-poa'
import { ActionBindingIF, FlagsReviewCertifyIF } from '@/interfaces/'

@Component({
  components: {
    CourtOrderPoaShared
  }
})
export default class CourtOrderPoa extends Vue {
  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  /** Store getters */
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter getAppValidate!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean

  /** Global actions */
  @Action setValidCourtOrder!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setFileNumber!: ActionBindingIF

  /** Local getters */
  get invalidCourtOrder (): boolean {
    return (this.getAppValidate && !this.getFlagsReviewCertify.isValidCourtOrder)
  }
}
</script>

<style lang="scss" scoped>
</style>
