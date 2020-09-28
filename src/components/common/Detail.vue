<template>
  <section>
    <header>
      <h2>1. Detail</h2>
    </header>

    <span>Enter a Detail that will appear on the ledger for this entity.</span>
    <v-card flat class="mt-4">
      <div class="pl-8 pt-8 pr-8">
        <v-layout row>
          <v-flex md2>
            <label><strong>Detail</strong></label>
          </v-flex>
          <v-flex md10>
            <div>
              <label>
                <strong>Correction for Incorporation Application. Filed on {{getOriginalIAFilingDate}}</strong>
                </label>
            </div>
            <div class="pt-2">
              <detail-comment
                v-model="comment"
                placeholder="Add a Detail that will appear on the ledger for this entity."
                :maxLength="maxLength"
                @valid="onValidityChange($event)"/>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { DetailComment } from '@bcrs-shared-components/detail-comment'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'

@Component({
  components: { DetailComment }
})
export default class Detail extends Vue {
  @Getter getOriginalIAFilingDate!: string
  @Getter getDetailComment!: string

  @Action setDetailComment: ActionBindingIF
  @Action setDetailValidity: ActionBindingIF

  private comment: string = null
  private maxLength: number = 4038

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
</style>
