<template>
  <div
    id="transactional-folio-number-section"
    class="pb-6"
  >
    <h2>{{ sectionNumber }} Folio or Reference Number (Optional)</h2>

    <div class="py-4">
      This is meant for your own tracking purposes and will appear on your receipt.
    </div>

    <div :class="{ 'invalid-section': !sectionValid }">
      <v-card
        flat
        class="pt-4 pr-8"
      >
        <v-container>
          <v-row class="ml-5">
            <v-col
              cols="3"
              class="px-0"
            >
              <label :class="{ 'error-text': !sectionValid }">
                <strong>Folio or Reference<br>Number</strong>
              </label>
            </v-col>
            <v-col
              cols="9"
              class="px-0"
            >
              <v-text-field
                id="folio-number-input"
                ref="folioNumberInput"
                v-model="folioNumber"
                filled
                persistent-hint
                autocomplete="chrome-off"
                label="Folio or Reference Number (Optional)"
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
import { Action, Getter } from 'pinia-class'
import { CommonMixin } from '@/mixins/'
import { FlagsReviewCertifyIF, FormFieldType } from '@/interfaces/'
import { VuetifyRuleFunction } from '@/types'

import { useStore } from '@/store/store'

@Component({})
export default class TransactionalFolioNumber extends Mixins(CommonMixin) {
  // Add element type to refs
  $refs!: {
    folioNumberInput: FormFieldType
  }

  // Store getters
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getTransactionalFolioNumber!: string
  @Getter(useStore) getFlagsReviewCertify!: FlagsReviewCertifyIF

  // Store actions
  @Action(useStore) setTransactionalFolioNumber!: (x: string) => void
  @Action(useStore) setTransactionalFolioNumberValidity!: (x: boolean) => void

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  // Local properties
  protected folioNumber = ''

  // Validation rules
  readonly rules: Array<VuetifyRuleFunction> = [
    (v: string) => (!v || v.length <= 30) || 'Maximum 30 characters reached'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // assign transactional FN form draft if it exists, otherwise leave field empty
    this.folioNumber = this.getTransactionalFolioNumber || ''  }

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

:deep() {
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
