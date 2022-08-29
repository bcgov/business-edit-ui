<template>
  <div id="special-resolution-summary">
    <v-divider class="mx-4" />
    <section id="resolution-date-section" class="section-container">
      <header id="resolution-date-header" class="mt-3">
        <h2>Special Resolution</h2>
      </header>

      <div class="mt-8">
        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block resolution-date-label">
            <label><strong> Resolution Date</strong></label>
          </v-col>
          <v-col cols="12" sm="9" class="resolution-date">
            {{ resolutionDateText }}
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block resolution-text-label">
            <label><strong>Resolution Text</strong></label>
          </v-col>
          <v-col cols="12" sm="9" class="resolution-text">
            {{ getCreateResolution && getCreateResolution.resolution }}
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block siging-party-label">
            <label><strong> Signing Party</strong></label>
          </v-col>
          <v-col cols="12" sm="9" class="siging-party">
            {{ signingParty }}
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="3" class="pr-4 siging-date-label">
            <label><strong> Date Signed</strong></label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0 siging-date">
            {{ signingDate }}
          </v-col>
        </v-row>

        <!-- Confirm Resolution -->
        <v-row
          no-gutters
          class="mt-6 section-confirm-resolution"
          id="special-resolution-confirm"
          :class="{ 'invalid-section': invalidSpecialResolutionConfirmSection }"
        >
          <v-col cols="12" sm="3" class="pr-4">
            <label :class="{ 'error-text': invalidSpecialResolutionConfirmSection }">
              <strong>Confirm Special Resolution</strong></label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0 ml-n5">
            <v-form ref="confirmResolutionChkFormRef">
              <v-checkbox
                ref="confirmResolutionChkRef"
                id="chk-confirm-resolution"
                class="chk-resolution mt-0 pt-0"
                v-model="resolutionConfirmed"
                hide-details
                :rules="confirmCompletionResolution"
                @change="onResolutionConfirmedChange($event)"
              >
                <div slot="label">I confirm the following:</div>
              </v-checkbox>
              <ul>
                <li class="mt-4">
                  The special resolution was passed by <strong>{{ companyName }}</strong> and authorizes the
                  dissolution.
                </li>
                <li class="mt-4">
                  A printed copy of the signed special resolution (Form 06 COO) has been retained with the Cooperative
                  Association's records.
                </li>
              </ul>
            </v-form>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, FormIF, EntitySnapshotIF } from '@/interfaces/'
import { CommonMixin, DateMixin } from '@/mixins/'
import { HelpSection } from '@/components/common/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces'

@Component({
  components: {
    HelpSection,
    DatePickerShared
  }
})
export default class CreateSpecialResolutionSummary extends Mixins(CommonMixin, DateMixin) {
  @Getter getCreateResolution!: SpecialResolutionIF
  @Getter getAppValidate!: boolean
  @Getter getSpecialResolutionConfirmValid!: boolean
  @Getter getEntitySnapshot!: EntitySnapshotIF

  @Action setResolution!: ActionBindingIF
  @Action setSpecialResolutionConfirmStateValidity!: ActionBindingIF

  // Refs
  $refs!: {
    confirmResolutionChkFormRef: FormIF
  };

  protected resolutionConfirmed = false

  /** Validation rule for checkbox. */
  protected confirmCompletionResolution = [
    v => {
      return !!v
    }
  ];

  protected async onResolutionConfirmedChange (resolutionConfirmed: boolean): Promise<void> {
    // This is required as there are timing issues between this component and the CompleteResolutionSummary
    // component.  The CompleteResolutionSummary isn't always able to detect that the confirm checkbox
    // value has changed without using nextTick()
    await this.$nextTick()
    this.setResolution({
      ...this.getCreateResolution,
      resolutionConfirmed: resolutionConfirmed
    })
    this.setSpecialResolutionConfirmStateValidity(resolutionConfirmed)
  }

  /** The name section validity state (when prompted by app). */
  get invalidSpecialResolutionConfirmSection (): boolean {
    return this.getAppValidate && !this.getSpecialResolutionConfirmValid
  }
  /** The resolution date in readable. */
  get resolutionDateText (): string {
    return this.yyyyMmDdToPacificDate(this.getCreateResolution.resolutionDate, true)
  }

  /** The signing date in readable. */
  get signingDate (): string {
    return this.yyyyMmDdToPacificDate(this.getCreateResolution.signingDate, true)
  }

  /** The signing person details. */
  get signingParty (): string {
    if (this.getCreateResolution.signatory) {
      const { givenName, additionalName = '', familyName } = this.getCreateResolution.signatory
      if (additionalName !== null && additionalName !== '') {
        return `${givenName} ${additionalName} ${familyName}`
      }
      return `${givenName} ${familyName}`
    }
    return ''
  }

  /** The company name. */
  get companyName (): string {
    // old company name need show even they change it
    return this.getEntitySnapshot?.businessInfo?.legalName || ''
  }

  /** Set validate on file and pay click. */
  @Watch('getAppValidate')
  protected updateResolutionStepValidationDetail (): void {
    // don't call validation during Jest tests because we are setting app valid
    !this.isJestRunning && this.$refs.confirmResolutionChkFormRef.validate()
  }

  /** Set values if exist */
  protected mounted () {
    this.resolutionConfirmed = this.getCreateResolution.resolutionConfirmed || false
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.section-confirm-resolution {
  padding: 2rem;
  background-color: $gray1;

  &.invalid {
    border-left: 4px solid $BCgovInputError;
    padding-left: calc(2rem - 4px);

    label {
      color: $BCgovInputError;
    }
  }
}
::v-deep .chk-resolution {
  label {
    font-weight: normal;
    color: $gray9;
  }
}
</style>
