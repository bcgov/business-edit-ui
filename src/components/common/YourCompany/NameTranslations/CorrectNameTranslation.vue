<template>
  <NameTranslation
    :invalidSection="invalidSection"
    :nameTranslations="getNameTranslations"
    @nameTranslationsChange="updateNameTranslations($event)"
    @haveChanges="emitHaveChanges($event)"
    @isEditingTranslations="isEditingTranslations = $event"
  />
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator'
import { NameTranslation } from './'
import { ActionBindingIF, NameTranslationIF } from '@/interfaces/'
import { Action, Getter } from 'vuex-class'

@Component({
  components: {
    NameTranslation
  }
})
export default class CorrectNameTranslation extends Vue {
  @Prop({ default: false })
  readonly invalidSection: boolean

  // Global getter
  @Getter getNameTranslations!: NameTranslationIF[]

  // Global action
  @Action setNameTranslations!: ActionBindingIF

  private isEditingTranslations = false

  private updateNameTranslations (nameTranslations: NameTranslationIF[]): void {
    this.setNameTranslations(nameTranslations)
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}

  @Watch('isEditingTranslations')
  @Emit('isEditingTranslations')
  private emitIsEditingTranslations (isEditing: boolean): void {}
}
</script>

<style lang="scss" scoped>

</style>
