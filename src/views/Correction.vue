<template>
  <div>
    <template v-if="isTypeBcomp || true">
      <BenCorrection
        :appReady="appReady"
        @fetchError="emitFetchError($event)"
        @haveData="emitHaveData($event)"
      />
    </template>
    <template v-if="isTypeFirm && false">
      <FmCorrection
        :appReady="appReady"
        @fetchError="emitFetchError($event)"
        @haveData="emitHaveData($event)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BenCorrection from '@/views/Correction/BenCorrection.vue'
import FmCorrection from '@/views/Correction/FmCorrection.vue'

@Component({
  components: {
    BenCorrection,
    FmCorrection
  }
})
export default class Correction extends Vue {
  // Global getters
  @Getter isTypeBcomp!: boolean
  @Getter isTypeFirm!: boolean

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}
}
</script>
