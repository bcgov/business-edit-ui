<template>
  <section id="document-delivery-section">
    <header>
      <h2>1. Alteration Documents Delivery</h2>
    </header>
    <div class="pt-4">Copies of the alteration documents will be sent to the following email address listed below.</div>
    <div class="pt-8 pr-8">
      <v-container pb-6>
        <v-row class="pl-4">
          <v-col cols="2" sm="3" md="2" class="firstCol">
            <label><strong>Registered Office</strong></label>
          </v-col>
          <v-col cols="10" sm="9" md="10" class="secondCol">
            {{getBusinessContact.email || '(Not entered)'}}
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="isRoleStaff">
        <v-row class="pl-4">
          <v-col cols="2" sm="3" md="2" class="firstCol">
            <label><strong>User Account</strong></label>
          </v-col>
          <v-col cols="10" sm="9" md="10" class="secondCol">
            {{ getUserEmail }}
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row class="pl-4">
          <v-col cols="2" sm="3" md="2" class="firstCol">
            <label><strong>Optional Email</strong></label>
          </v-col>
          <v-col cols="10" sm="9" md="10" class="secondCol">
            <v-text-field
              v-model="optionalEmail"
              id="optionalEmail"
              class="text-input-field"
              filled
              label="Optional Email"
              hint="Example: name@email.com"
              persistent-hint
              :rules="entityEmailRules"
            >
          </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Emit, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF } from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class DocumentsDelivery extends Mixins(CommonMixin) {
  // Global getters
  @Getter getUserEmail!: string
  @Getter getBusinessContact!: ContactPointIF
  @Getter isRoleStaff!: boolean
  @Getter getDocumentOptionalEmail!: string

  // Global actions
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  private optionalEmail: string = ''

  private entityEmailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.validateEmailFormat(v) || 'Email is Invalid'
  ]

  mounted () {
    this.optionalEmail = this.getDocumentOptionalEmail
  }

  private validateEmailFormat (value: string): boolean {
    // allow empty as the email is optional
    if (value === '') {
      return true
    } else {
      const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      return VALID_FORMAT.test(value)
    }
  }

  @Watch('optionalEmail')
  onEmailChanged (val: string): void {
    if (this.validateEmailFormat) {
      this.setDocumentOptionalEmail(val)
    }
  }

  @Emit('valid')
  private async emitValid (): Promise<boolean> {
    // wait for form to update itself before checking validity
    await Vue.nextTick()
    return (this.validateEmailFormat(this.optionalEmail))
  }
}
</script>
<style lang="scss" scoped>
  .firstCol, .secondCol {
    padding-left: 0px;
  }
</style>