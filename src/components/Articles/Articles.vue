<template>
  <v-card flat id="articles">
    <confirm-dialog ref="confirm" attach="#app" />

    <div class="define-article-header">
      <v-icon color="app-dk-blue">mdi-handshake</v-icon>
      <label class="define-article-title">Articles</label>
    </div>

    <div class="section-container">
      <company-provisions
        class="sub-section"
        :provisionsRemoved="getProvisionsRemoved"
        @companyProvisionsChanged="updateProvisionsRemoved($event)"
        @haveChanges="emitHaveChanges($event)"/>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins'
import { ConfirmDialog } from '@/components/dialogs'
import CompanyProvisions from './CompanyProvisions.vue'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'

@Component({
  components: {
    ConfirmDialog,
    CompanyProvisions
  }
})
export default class Articles extends Mixins(CommonMixin) {
  // whether components have changes
  private companyProvisionsChanges = false

  @Getter getProvisionsRemoved!: boolean

  // Setters
  @Action setProvisionsRemoved!: ActionBindingIF

  private updateProvisionsRemoved (provisionsRemoved: boolean): void {
    this.setProvisionsRemoved(provisionsRemoved)
  }

  private setDataChanges (): void {
    const haveChanges: boolean = this.companyProvisionsChanges
    this.emitHaveChanges(haveChanges)
  }

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.25rem 1rem;

  .sub-section {
    margin-top: 1.5rem;
  }
}

.define-article-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-article-title {
  padding-left: 0.5rem;
}
</style>
