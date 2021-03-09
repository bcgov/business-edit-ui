<template>
  <section id="document-delivery-section">
    <header>
      <h2>X. Alteration Documents Delivery</h2>
    </header>
    <div class="pt-4">Copies of the alteration documents will be sent to the following email address listed below.</div>
    <div class="pl-8 pt-8 pr-8">
      <v-layout row pb-6>
        <v-flex xs3 md2 class="registered">
          <label><strong>Registered Office</strong></label>
        </v-flex>
        <v-flex xs9 md10 pl-4>
          {{getBusinessContact.email || '(Not entered)'}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs3 md2>
          <label><strong>User Account</strong></label>
        </v-flex>
        <v-flex xs9 md10 pl-4>
          {{ getUserEmail }}
        </v-flex>
      </v-layout>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class DocumentsDelivery extends Mixins(CommonMixin) {
  // Global getters
  @Getter getUserEmail!: string
  @Getter getBusinessContact!: ContactPointIF
}
</script>
