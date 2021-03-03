<template>
  <v-card flat id="articles">
    <confirm-dialog ref="confirm" attach="#app" />

    <div class="define-article-header">
      <v-icon color="app-dk-blue">mdi-handshake</v-icon>
      <label class="define-article-title">Articles</label>
    </div>

    <div class="section-container">
      <company-provisions class="sub-section" @haveChanges="nameTranslationChanges = $event" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins'
import { ConfirmDialog } from '@/components/dialogs'
import CompanyProvisions from './CompanyProvisions.vue'

@Component({
  components: {
    ConfirmDialog,
    CompanyProvisions
  }
})
export default class Articles extends Mixins(CommonMixin) {}
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
