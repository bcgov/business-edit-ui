<template>
  <div id="contact-info">
    <!-- Display Contact Info -->
    <v-layout row v-if="!isEditing" class="mx-0">
      <v-flex xs3>
        <label>
          <span>Registered Office <br> Contact Information</span>
          <v-flex md1>
            <v-chip v-if="hasBusinessContactInfoChange" x-small label color="primary" text-color="white">
              {{editedLabel}}
            </v-chip>
          </v-flex>
        </label>
      </v-flex>

      <!-- Email Address -->
      <v-flex xs4>
        <label class="d-flex flex-wrap">
          <span class="subtitle mr-2">Email Address</span>
        </label>
        <div id="lbl-email" class="info-text">{{ !!contactInfo.email ? contactInfo.email : "(Not entered)" }}</div>
      </v-flex>

      <!-- Phone Number -->
      <v-flex xs4>
        <label class="d-flex flex-wrap">
          <span class="subtitle mr-2">Phone Number</span>
        </label>
        <div id="lbl-phone" v-if="!!contactInfo.phone" class="info-text">
          {{ contactInfo.phone }}
          <span v-if="!!contactInfo.extension">Ext: {{ contactInfo.extension }}</span>
        </div>
        <div id="lbl-no-phone" v-else class="info-text">(Not entered)</div>
      </v-flex>

      <!-- Edit Actions -->
      <v-flex xs1 class="mt-n2">
        <div class="actions mr-4">
          <v-btn
            v-if="hasBusinessContactInfoChange"
            text color="primary"
            id="btn-undo-contact-info"
            @click="resetContactInfo()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
          <v-btn
            v-else
            text color="primary"
            id="btn-correct-contact-info"
            @click="isEditing = true"
          >
            <v-icon small>mdi-pencil</v-icon>
            <span>{{editLabel}}</span>
          </v-btn>

          <!-- Drop Down Actions -->
          <span class="more-actions" v-if="hasBusinessContactInfoChange">
            <v-menu
              offset-y left nudge-bottom="4"
              v-model="dropdown"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text small color="primary"
                  id="btn-more-actions"
                  v-on="on"
                >
                  <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  class="v-list-item"
                  id="btn-more-actions-edit"
                  @click="isEditing = true; dropdown = false"
                >
                  <v-list-item-subtitle>
                    <v-icon small color="primary">mdi-pencil</v-icon>
                    <span class="drop-down-action ml-1">Change</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </v-flex>
    </v-layout>

    <!-- Edit Contact Form -->
    <template v-else id="edit-contact-form">
      <v-layout row class="mx-0">
        <v-flex xs3>
          <label><strong>Registered Office <br>Contact Information</strong></label>
        </v-flex>
      </v-layout>

      <v-layout row class="mx-0">
        <v-flex xs3></v-flex>
        <v-flex xs9 class="my-4 info-text">
          There is no fee to change Registered Contact Information. Any changes made will be applied immediately.
        </v-flex>
      </v-layout>

      <v-form
        v-model="formValid"
        ref="form"
        name="business-contact-form"
        class="business-contact-form pt-5"
      >
        <!-- Line 1 -->
        <v-layout row class="mx-0">
          <v-flex xs3>
            <label><strong>Email Address</strong></label>
          </v-flex>
          <v-flex xs9>
            <v-text-field
              filled
              label="Email Address"
              req
              persistent-hint
              :rules="emailRules"
              v-model="contactInfo.email"
              id="txt-email"
            >
            </v-text-field>
          </v-flex>
        </v-layout>

        <!-- Line 2 -->
        <v-layout row class="mx-0">
          <v-flex xs3>
            <label><strong>Confirm Email</strong></label>
          </v-flex>
          <v-flex xs9>
            <v-text-field
              filled
              label="Confirm Email Address"
              req
              persistent-hint
              v-model="contactInfo.confirmEmail"
              id="txt-confirm-email"
            >
            </v-text-field>
          </v-flex>
        </v-layout>

        <!-- Line 3 -->
        <v-layout row class="mx-0">
          <v-flex xs3>
            <label><strong>Phone Number</strong></label>
          </v-flex>
          <v-flex s4 class="mr-1">
            <v-text-field
              filled
              label="Phone Number"
              persistent-hint
              hint="Example: (555) 555-5555"
              type="tel"
              v-mask="['(###) ###-####']"
              v-model="contactInfo.phone"
              :rules="phoneRules"
              id="txt-phone"
            >
            </v-text-field>
          </v-flex>
          <v-flex s4>
            <v-text-field
              filled
              label="Extension"
              persistent-hint
              v-mask="'#####'"
              v-model="contactInfo.extension"
              id="txt-phone-extension"
            >
            </v-text-field>
          </v-flex>
        </v-layout>

        <!-- Form Actions -->
        <v-layout row class="mx-0 pt-3">
          <v-flex xs12>
            <div class="action-btns">
              <v-btn
                id="done-btn"
                large color="primary"
                :disabled="!formValid"
                @click="updateContactInfo()"
              >
                <span>Done</span>
              </v-btn>
              <v-btn
                id="cancel-btn"
                large outlined color="primary"
                @click="resetContactInfo()"
              >
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-form>
    </template>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

// Interfaces & enums
import { BusinessContactIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'

@Component({
  directives: { mask }
})
export default class BusinessContactInfoShared extends Mixins(CommonMixin) {
  @Prop()
  private businessContact!: BusinessContactIF

  @Prop()
  private originalBusinessContact!: any

  // Properties
  private isEditing: boolean = false
  private contactInfo: BusinessContactIF
  private formValid: boolean = false

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  // Rules
  private emailRules = [
    (v: string) => !!v || 'Email address is required',
    (v: string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(v) || 'Valid email is required'
    }
  ]

  private confirmEmailRules = [
    (v: string) => !!v || 'Confirm email address',
    (v: string) => v?.toString() === this.contactInfo?.email || 'Email addresses must match'
  ]

  private phoneRules = [
    (v: any) => !v || (v.length === 0 || v.length === 14) || 'Phone number is invalid'
  ]

  private get hasBusinessContactInfoChange () {
    return !this.isSame(this.businessContact, this.originalBusinessContact)
  }

  private updateContactInfo (): void {
    this.emitContactInfo(this.contactInfo)
    this.isEditing = false
  }

  private resetContactInfo (): void {
    this.contactInfo = { ...this.originalBusinessContact }
    this.emitContactInfo(this.contactInfo)
    this.isEditing = false
  }

  /** Initialize the contact info. */
  @Watch('businessContact', { deep: true, immediate: true })
  private initializeContactInfo () {
    this.contactInfo = { ...this.businessContact }
  }

  @Emit('contactInfoChange')
  private emitContactInfo (contactInfo: BusinessContactIF): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}

.action-btns {
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  #done-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

::v-deep .v-text-field .v-label {
  font-weight: normal;
  color: $gray7;
}
</style>
