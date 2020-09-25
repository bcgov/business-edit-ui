<template>
  <div>
    <v-chip v-if="actionableItem.action === ActionTypes.ADDED"
            x-small label color="#1669BB" text-color="white">ADDED</v-chip>
    <v-chip v-if="actionableItem.action === ActionTypes.EDITED"
            x-small label color="#1669BB" text-color="white">CORRECTED</v-chip>
    <v-chip v-if="actionableItem.action === ActionTypes.REMOVED"
            x-small label color="#E0E0E0" text-color="grey darken-1">REMOVED</v-chip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ActionTypes } from '@/enums'

@Component({})
export default class ActionChip extends Vue {
  @Prop({ default: {} })
  private actionableItem: {}

  // Enum for template
  readonly ActionTypes = ActionTypes
}
</script>

<style lang="scss" scoped>
</style>
