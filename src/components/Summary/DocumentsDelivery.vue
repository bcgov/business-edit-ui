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
      <v-layout row v-if="isRoleStaff">
        <v-flex xs3 md2>
          <label><strong>User Account</strong></label>
        </v-flex>
        <v-flex xs9 md10 pl-4>
          {{ getUserEmail }}
        </v-flex>
      </v-layout>
      <v-layout row v-else>
        <v-flex xs3 md2>
          <label><strong>Optional Email</strong></label>
        </v-flex>
        <v-flex xs9 md10 pl-4>
          <v-text-field
          v-model="optionalEmail"
          class="text-input-field"
          filled
          label="Optional Email"
          hint="Example: name@email.com"
          persistent-hint
          :rules="entityEmailRules"
          data-test="entity-email"
        >
        </v-text-field>
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
  @Getter isRoleStaff!: boolean

  private optionalEmail: string = ''

  private entityEmailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.validateEmailFormat(v) || 'Email is Invalid'
  ]

  private validateEmailFormat (value: string): boolean {
    // allow empty as the email is optional
    if (value === '') {
      return true
    } else {
      const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      return VALID_FORMAT.test(value)
    }
  }
}
</script>
