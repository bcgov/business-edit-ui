<template>
  <v-container id="name-options-container">
    <h4 class="name-options-info mb-3">You can correct the company name in one of the following ways:</h4>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item,i) in correctionNameOptions"
        :key="i"
      >
        <v-expansion-panel-header class="name-options-header">{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content class="name-options-content">
          <v-container>
            <component :is="item.component" :key="item[i]" />
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'

// Interfaces
import { CorrectNameOptionIF } from '@/interfaces'

@Component({
  components: {
  }
})
export default class CorrectNameOptions extends Vue {
  @Prop() private correctionNameOptions: [CorrectNameOptionIF]
}
</script>

<style lang="scss" scoped>
  #name-options-container {
    padding: 0;
    .name-options-info {

    }

    .name-options-header {
    }

    .name-options-content {
    }
  }
</style>
