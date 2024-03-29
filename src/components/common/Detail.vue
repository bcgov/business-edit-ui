<template>
  <section id="detail-section">
    <header>
      <h2>{{ sectionNumber }} Detail</h2>
    </header>

    <div class="py-4">
      Enter a Detail that will appear on the ledger for this entity.
    </div>

    <div :class="{ 'invalid-section': invalidSection }">
      <v-card
        flat
        class="detail-card"
      >
        <v-row no-gutters>
          <v-col
            cols="3"
            sm="3"
          >
            <label><strong>Detail</strong></label>
          </v-col>
          <v-col
            cols="10"
            sm="9"
          >
            <label><strong>{{ defaultCorrectionDetailComment }}</strong></label>
            <div class="pt-2">
              <DetailCommentShared
                v-model="comment"
                placeholder="Add a Detail that will appear on the ledger for this entity."
                :textAreaStyle="'filled'"
                :maxLength="maxLength"
                :rowCount="rowCount"
                @valid="setDetailValidity($event)"
              />
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { DetailComment as DetailCommentShared } from '@bcrs-shared-components/detail-comment/'
import { Action } from 'pinia-class'
import { FilingTemplateMixin } from '@/mixins'

import { useStore } from '@/store/store'

@Component({
  components: {
    DetailCommentShared
  }
})
export default class Detail extends Mixins(FilingTemplateMixin) {
  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  @Prop({ default: 2 }) readonly rowCount!: number

  @Action(useStore) setDetailValidity!: (x: boolean) => void

  protected comment = null as string

  get maxLength (): number {
    // = (max size in db) - (default comment length) - (Carriage Return)
    return (2000 - this.defaultCorrectionDetailComment.length - 1)
  }

  get isValid (): boolean {
    return !!this.comment
  }

  /** True if invalid class should be set for certify section container. */
  get invalidSection (): boolean {
    return (this.validate && !this.isValid)
  }

  @Watch('comment')
  private onCommentChanged (): void {
    this.setDetailComment(this.comment)
    this.setDetailValidity(this.isValid)
  }

  @Watch('getDetailComment', { immediate: true })
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
