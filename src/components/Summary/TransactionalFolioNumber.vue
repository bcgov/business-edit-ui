<template>
  <div class="pb-6" id="transactional-folio-number-section">
    <h2>{{sectionNumber}} Folio or Reference Number for this Filing</h2>

    <div class="pt-4 pb-4">
      Enter the folio or reference number you want to use for this filing for your own tracking purposes. The
      Business Folio or Reference Number is displayed below (if available). Entering a different value below
      will not change the Business Folio or Reference Number. Only the number below will appear on the transaction
      report and receipt for this filing.
    </div>

    <div :class="{ 'invalid-section': sectionInvalid }">
      <v-card flat class="pt-4 pr-8">
        <v-container>
          <v-row class="pl-4">
            <v-col cols="3" class="px-0">
              <label :class="{ 'error-text': sectionInvalid }">
                <strong>Folio or Reference<br>Number</strong>
              </label>
            </v-col>
            <v-col cols="9" class="px-0">
              <v-text-field
                filled persistent-hint
                id="folio-number-input"
                autocomplete="chrome-off"
                label="Folio or Reference Number (Optional)"
                validate-on-blur
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
import { Component, Mixins, Emit, Vue, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF, ValidFlagsIF } from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

@Component({})
export default class TransactionalFolioNumber extends Mixins(CommonMixin) {
  // Global getters
  @Getter getUserEmail!: string
  @Getter getBusinessContact!: ContactPointIF
  @Getter getDocumentOptionalEmail!: string
  @Getter getAlterationValidFlags!: ValidFlagsIF

  // Global actions
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  /** Prop to perform validation. */
  @Prop({ default: false }) readonly validate: boolean

  // Local properties
  private folioNumber = ''

  // Validation rules
  private readonly rules: Array<Function> = [
    (v: string) => (!v || v.length <= 30) || 'Maximum 30 characters reached'
  ]

  mounted () {
    // TODO: implement
    // this.folioNumber = this.getDocumentOptionalEmail
  }

  /** True if this section is invalid. */
  get sectionInvalid (): boolean {
    // TODO: implement
    return false
    // return (this.validate && !this.getAlterationValidFlags.isValidDocumentOptionalEmail)
  }

  @Watch('folioNumber')
  onFolioNumberChanged (val: string): void {
    // this.setDocumentOptionalEmail(val)
    // this.setDocumentOptionalEmailValidity(true)
  }

  @Emit('valid')
  private async emitValid (): Promise<boolean> {
    // wait for form to update itself before checking validity
    await Vue.nextTick()
    // TODO: use form or element validity instead?
    return true
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
