<template>
  <div>
    <v-chip
      v-if="actionableItem.action === ActionTypes.ADDED"
      id="added-chip"
      x-small
      label
      color="primary"
      text-color="white"
    >
      ADDED
    </v-chip>
    <v-chip
      v-if="actionableItem.action === ActionTypes.EDITED"
      id="edited-chip"
      x-small
      label
      color="primary"
      text-color="white"
    >
      {{ editedLabel }}
    </v-chip>
    <v-chip
      v-if="actionableItem.action === ActionTypes.REMOVED"
      id="removed-chip"
      x-small
      label
      color="#E0E0E0"
      text-color="#212529"
    >
      REMOVED
    </v-chip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ActionTypes } from '@/bcrs-shared-components/enums'
import { ActionableItemIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class ActionChip extends Vue {
  @Prop({ default: {} }) readonly actionableItem!: ActionableItemIF

  @Prop({ default: 'EDITED' }) readonly editedLabel!: string

  // Declaration for template
  readonly ActionTypes = ActionTypes
}
</script>
