<template>
  <section>
    <header>
      <h2>1. Detail</h2>
    </header>

    <span>Enter a Detail that will appear on the ledger for this entity.</span>

    <detail-comment
      v-model="comment"
      placeholder="Add a Detail that will appear on the ledger for this entity."
      :maxLength="maxLength"
      @valid="emitValid($event)"
    />
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import { DetailComment } from '@bcrs-shared-components/detail-comment'

@Component({
  components: { DetailComment }
})
export default class Detail extends Vue {
  private comment: string = null
  private maxLength: number = 1000
  private valid: boolean = null

  /** Emits Valid event. */
  @Emit('emitValid')
  private emitValid (): void { }
}
</script>

<style lang="scss" scoped>
</style>
