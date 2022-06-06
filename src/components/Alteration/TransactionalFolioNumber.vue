<template>
  <div class="pb-6" id="transactional-folio-number-section">
    <h2>{{sectionNumber}} Folio or Reference Number for this Filing</h2>

    <div class="py-4">
      Enter the folio or reference number you want to use for this filing for your own tracking purposes. The
      Business Folio or Reference Number is displayed below (if available). Entering a different value below
      will not change the Business Folio or Reference Number. Only the number below will appear on the transaction
      report and receipt for this filing.
    </div>

    <div :class="{ 'invalid-section': !sectionValid }">
      <v-card flat class="pt-4 pr-8">
        <v-container>
          <v-row class="pl-4">
            <v-col cols="3" class="px-0">
              <label :class="{ 'error-text': !sectionValid }">
                <strong>Folio or Reference<br>Number</strong>
              </label>
            </v-col>
            <v-col cols="9" class="px-0">
              <v-text-field
                filled persistent-hint
                id="folio-number-input"
                ref="folioNumberInput"
                autocomplete="chrome-off"
                label="Folio or Reference Number (Optional)"
                v-model="folioNumber"
                :name="Math.random()"
                :rules="rules"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins/'
import { ActionBindingIF, FlagsReviewCertifyIF, FormFieldType } from '@/interfaces/'

@Component({})
export default class TransactionalFolioNumber extends Mixins(CommonMixin) {
  // Add element type to refs
  $refs!: {
    folioNumberInput: FormFieldType
  }

  // Global getters
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF

  // Global actions
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumberValidity!: ActionBindingIF

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate: boolean

  // Local properties
  private folioNumber = ''

  // Validation rules
  readonly rules: Array<Function> = [
    (v: string) => (!v || v.length <= 30) || 'Maximum 30 characters reached'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // assign transactional FN if it exists, otherwise business FN
    this.folioNumber = this.getTransactionalFolioNumber || this.getFolioNumber
  }

  /** True if this section is valid. */
  get sectionValid (): boolean {
    return (!this.validate || this.getFlagsReviewCertify.isValidTransactionalFolioNumber)
  }

  @Watch('folioNumber')
  private async onFolioNumberChanged (val: string): Promise<void> {
    this.setTransactionalFolioNumber(val)
    // wait for form field to update itself before checking validity
    await this.$nextTick()
    this.setTransactionalFolioNumberValidity(this.$refs.folioNumberInput.valid)
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

#transactional-folio-number-section {
  &.invalid {
    border-left: 4px solid $BCgovInputError;
    padding-left: calc(2rem - 4px);
    h2 {
      color: $BCgovInputError;
    }
  }
}
</style>
