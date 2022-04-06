<template>
  <div class="help-section-component">
    <div class="help-btn top" @click="helpToggle = !helpToggle">
      <v-icon color="primary">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle" class="pl-2">{{ header }}</span>
      <span v-else class="pl-2">Hide Help</span>
    </div>

    <v-expand-transition v-if="helpToggle">
      <section class="help-section info-text">
        <header class="help-header mt-4">
          <h2>Contact BC Registries</h2>
        </header>

        <p v-for="(item, index) in items" :key="index" class="mt-4 py-1" v-html="item" />

        <!-- BC Registry Contacts -->
        <BcRegContacts class="mb-6" :direction="'col'"/>

        <label>Hours of Operation:</label>
        <p>Monday to Friday, 8:30am - 4:30pm Pacific Time</p>
        <div class="help-btn bottom" @click="helpToggle = !helpToggle">Hide Help</div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BcRegContacts } from '@/components/common'
import { HelpSectionIF } from '@/interfaces'

@Component({
  components: {
    BcRegContacts
  }
})
export default class HelpSection extends Vue {
  @Prop({ default: () => {} })
  readonly helpSection: HelpSectionIF

  helpToggle = false

  get header (): string {
    return this.helpSection?.header || 'this section'
  }

  get items (): string[] {
    return this.helpSection?.helpText || []
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.v-icon {
  margin-top: -3px;
}

.help-section {
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  margin: 1.5rem 0;
  padding: 1rem 0;
}

.help-header {
  display: flex;
  justify-content: center;
}

.help-btn.bottom {
  font-size: $px-13;
  text-decoration: underline;
  display: flex;
  direction: rtl;
}
</style>
