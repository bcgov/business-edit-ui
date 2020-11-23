<template>
  <name-translation
    :nameTranslations="getNameTranslations"
    @nameTranslationsChange="updateNameTranslations($event)"
    @haveChanges="emitHaveChanges($event)"
  />
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'

// Components
import { NameTranslation } from '.'

// Interfaces
import { ActionBindingIF, IncorporationFilingIF, NameTranslationIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'
import { Action, Getter } from 'vuex-class'

@Component({
  components: {
    NameTranslation
  }
})
export default class CorrectNameTranslation extends Vue {
  // Getters
  @Getter getNameTranslations!: NameTranslationIF[]

  // Setters
  @Action setNameTranslations!: ActionBindingIF

  private updateNameTranslations (nameTranslations: NameTranslationIF[]): void {
    this.setNameTranslations(nameTranslations)
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>

</style>
