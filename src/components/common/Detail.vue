<template>
  <section id="detail-section">
    <header>
      <h2>{{sectionNumber}} Detail</h2>
    </header>

    <div class="py-4">
      Enter a Detail that will appear on the ledger for this entity.
    </div>

    <v-card flat class="detail-card">
      <v-row no-gutters>
        <v-col cols="2" xs="3">
          <label><strong>Detail</strong></label>
        </v-col>
        <v-col cols="10" xs="9">
          <label><strong>{{defaultCorrectionDetailComment}}</strong></label>
          <div class="pt-2">
            <DetailCommentShared
              v-model="comment"
              placeholder="Add a Detail that will appear on the ledger for this entity."
              :textAreaStyle="'filled'"
              :maxLength="maxLength"
              :rowCount="2"
              @valid="onValidityChange($event)"
            />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { DetailComment as DetailCommentShared } from '@bcrs-shared-components/detail-comment/'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces/'
import { DateMixin } from '@/mixins'
@Component({
  components: { DetailCommentShared }
})
export default class Detail extends Mixins(DateMixin) {
  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  @Getter getDetailComment!: string
  @Getter getOriginalFilingDateTime!: string
  @Action setDetailComment: ActionBindingIF
  @Action setDetailValidity: ActionBindingIF
  private comment: string = null
  get defaultCorrectionDetailComment (): string {
    const date = this.apiToDate(this.getOriginalFilingDateTime)
    const yyyyMmDd = this.dateToYyyyMmDd(date)
    return `Correction for Incorporation Application filed on ${yyyyMmDd}.`
  }
  get maxLength (): number {
    // = (max size in db) - (default comment length) - (Carriage Return)
    return (4096 - this.defaultCorrectionDetailComment.length - 1)
  }
  private onValidityChange (valid: boolean): void {
    this.setDetailValidity(valid)
  }
  @Watch('comment')
  private onCommentChanged (): void {
    this.setDetailComment(this.comment)
    this.setDetailValidity(!!this.comment)
  }
  @Watch('getDetailComment')
  private onCommentStateChange (): void {
    this.comment = this.getDetailComment
  }
}
</script>

<style lang="scss" scoped>
// we want the same padding as "section-container py-6"
.detail-card {
  padding-top: 1.5rem;
  padding-right: 1.875rem;
  padding-bottom: 0.75rem;
  padding-left: 1.875rem;
}
</style>
