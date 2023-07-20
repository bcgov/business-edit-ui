<template>
  <div
    class="info-text help-toggle pt-2"
    @click="$emit('toggle')"
  >
    <v-icon
      class="pr-2 mt-n2"
      color="primary"
    >
      mdi-help-circle-outline
    </v-icon>
    <span v-if="!isHelpVisible">Learn More</span>
    <span v-else>Hide Learn More</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class HelpSectionToggle extends Vue {
  @Prop({ default: false }) readonly isHelpVisible!: boolean
}
</script>
