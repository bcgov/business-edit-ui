<template>
  <section id="court-order-poa">
    <header>
      <h2>{{sectionNumber}} Court Order and Plan of Arrangement</h2>
      <div class="py-4">
        If this filing is pursuant to a court order, enter the court order number. If this
        filing is pursuant to a plan of arrangement, enter the court order number and select
        Plan of Arrangement.
      </div>
    </header>
    <div :class="{ 'invalid-section': invalidCourtOrder }">
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
// fix hard-coded whitespace inside shared component
// we want the same padding as "section-container py-6"
#court-order {
  margin-top: 0 !important;
  padding-top: 0.5rem !important;
  padding-right: 1.875rem !important;
  padding-bottom: 1.5rem !important;
  padding-left: 0.375rem !important;
}
</style>
