<template>
  <name-translation
        :nameTranslations="getNameTranslations"
        :originalNameTranslations="originalNameTranslations"
        @nameTranslationsChange="setNameTranslations"
        @haveChanges="emitHaveChanges($event)"
      />
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'

// Components
import { NameTranslation } from '.'

// Interfaces
import { ActionBindingIF, IncorporationFilingIF } from '@/interfaces'

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
  @Getter getNameTranslations!: Array<string>
  @Getter getOriginalIA!: IncorporationFilingIF

  // Setters
  @Action setNameTranslations!: ActionBindingIF

  private get originalNameTranslations () {
    return this.getOriginalIA.incorporationApplication.nameTranslations?.new
  }

  private updateNameTranslations (nameTranslations: Array<string>): void {
    this.setNameTranslations(nameTranslations)
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>

</style>
