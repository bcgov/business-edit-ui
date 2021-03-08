<template>
  <section id="document-delivery-section">
    <header>
      <h2>2. Certify</h2>
    </header>
    <span>Copies of the alteration documents will be sent to the following email address listed below.</span>
    <div class="pl-8 pt-8 pr-8">
      <v-layout row>
        <v-flex xs3 md2>
          <label><strong>Registered Office</strong></label>
        </v-flex>
        <v-flex xs9 md10>
          
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs3 md2>
          <label><strong>User Account</strong></label>
        </v-flex>
        <v-flex xs9 md10>
          
        </v-flex>
      </v-layout>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class DocumentsDelivery extends Vue { }
</script>

<style lang="scss" scoped>
li {
  font-size: 0.9rem;
}

.contact-container {
  display: flex;

  .contact-icon {
    flex: 0 0 1.375rem;
    justify-content: flex-start;
  }

  .contact-key {
    width: 12rem;
  }

  .contact-value {
    flex: 1 1;
  }
}
</style>
