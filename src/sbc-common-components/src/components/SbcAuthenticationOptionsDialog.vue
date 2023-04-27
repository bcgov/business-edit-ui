<template>
  <v-dialog v-model="showModal" max-width="850px" :attach="attach" persistent>
    <v-card class="pa-4">
      <sbc-authentication-options :is-dialog="true" :redirect-url="redirectUrl" @close="emitClose()"/>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import SbcAuthenticationOptions from './SbcAuthenticationOptions.vue'

@Component({
  components: {
    SbcAuthenticationOptions
  }
})
export default class SbcAuthenticationOptionsDialog extends Vue {
  @Prop({ default: false }) inAuth!: boolean
  @Prop({ default: false }) showModal!: boolean
  @Prop({ default: '' }) attach!: string
  @Prop({ default: '' }) redirectUrl!: string

  /**
   * Emits an event to the parent to close.
   */
  @Emit('close')
  private emitClose (): void {}
}
</script>

<style lang="scss" scoped>
  .v-dialog > .v-card {
    border-radius: 4px!important;
  }
</style>
