<template>
  <div>
    <v-form ref="addNRForm" lazy-validation>
      <fieldset>
        <v-expand-transition>
          <div class="passcode-form__alert-container" v-show="validationError">
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >{{validationError}}
            </v-alert>
          </div>
        </v-expand-transition>
        <v-text-field
          filled
          label="Enter a Name Request Number"
          hint="Example: NR 1234567"
          req
          persistent-hint
          data-test="business-identifier"
        ></v-text-field>
        <v-text-field
          filled
          label="Enter the Applicant Phone Number"
          hint="Example: 555-555-5555"
          persistent-hint
          type="tel"
          data-test="entity-phonenumber"
        ></v-text-field>
        <div class="font-weight-bold ml-3 mb-2">or</div>
        <v-text-field
          filled
          label="Enter the Applicant Email Address"
          hint="Example: name@email.com"
          persistent-hint
          data-test="entity-email"
        ></v-text-field>
      </fieldset>
      <div class="form__btns mt-8">
        <v-btn large text class="pl-2 pr-2 lost-passcode-btn" data-test="forgot-passcode-button">
          <v-icon>mdi-help-circle-outline</v-icon>
          <span>I lost or forgot my Name Request (NR) Number</span>
        </v-btn>
        <v-btn
          data-test="add-business-button"
          large color="primary"
          :loading="false"
        >
          <span>Add</span>
        </v-btn>
        <v-btn large depressed color="default" class="ml-2" data-test="cancel-button">
          <span>Cancel</span>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class CorrectNameRequest extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
