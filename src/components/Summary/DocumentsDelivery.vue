<template>
  <div class="pb-6" id="document-delivery-section" :class="{ 'invalid': documentDeliveryInvalid }">
    <h2>1. Alteration Documents Delivery</h2>
    <div class="pt-4 pb-4">Copies of the alteration documents will be sent
      to the following email address listed below.</div>
    <v-card flat class="pt-4 pr-8">
      <v-container>
        <v-row class="pl-4">
          <v-col cols="3" class="px-0">
            <label><strong>Registered Office</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            {{getBusinessContact.email || '(Not entered)'}}
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="isRoleStaff">
        <v-row class="pl-4">
          <v-col cols="3" class="px-0">
            <label><strong>User Account</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            <v-text-field
              v-model="optionalEmail"
              id="optionalEmail"
              class="text-input-field"
              filled
              label="Client Email Address (optional)"
              hint="Example: name@email.com"
              persistent-hint
              validate-on-blur
              :rules="entityEmailRules"
            >
          </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row class="pl-4">
          <v-col cols="3" class="px-0">
            <label><strong>User Account</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            {{ getUserEmail }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Emit, Vue, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF, ValidFlagsIF } from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class DocumentsDelivery extends Mixins(CommonMixin) {
  // Global getters
  @Getter getUserEmail!: string
  @Getter getBusinessContact!: ContactPointIF
  @Getter isRoleStaff!: boolean
  @Getter getDocumentOptionalEmail!: string
  @Getter getAlterationValidFlags!: ValidFlagsIF

  // Global actions
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  /** Prop to perform validation. */
  @Prop() readonly validate: boolean

  private optionalEmail: string = ''

  private entityEmailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.validateEmailFormat(v) || 'Enter valid email address'
  ]

  mounted () {
    this.optionalEmail = this.getDocumentOptionalEmail
  }

  private validateEmailFormat (value: string): boolean {
    // allow empty as the email is optional
    if (!value) {
      return true
    } else {
      const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      return VALID_FORMAT.test(value)
    }
  }

  /** True if invalid class should be set for certify container. */
  get documentDeliveryInvalid (): boolean {
    return (this.validate && !this.getAlterationValidFlags.isValidDocumentOptionalEmail)
  }

  @Watch('optionalEmail')
  onOptionalEmailChanged (val: string): void {
    if (this.validateEmailFormat(val)) {
      this.setDocumentOptionalEmail(val)
      this.setDocumentOptionalEmailValidity(true)
    } else {
      this.setDocumentOptionalEmailValidity(false)
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
@import '@/assets/styles/theme.scss';
  ::v-deep {
    .container {
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .v-label {
      font-weight: normal;
    }
  }
  #document-delivery-section {
    &.invalid {
      border-left: 4px solid $BCgovInputError;
      padding-left: calc(2rem - 4px);
      h2 {
        color: $BCgovInputError;
      }
    }
  }
</style>
