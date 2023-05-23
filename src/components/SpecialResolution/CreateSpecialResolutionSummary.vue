<template>
  <div id="create-special-resolution-summary">
    <v-divider class="mx-4" />
    <section
      id="resolution-date-section"
      class="section-container"
    >
      <header
        id="resolution-date-header"
        class="mt-3"
      >
        <h2>Special Resolution</h2>
      </header>

      <div class="mt-8">
        <v-row
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4 d-none d-sm-block resolution-date-label"
          >
            <label><strong> Resolution Date</strong></label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="resolution-date"
          >
            {{ resolutionDateText }}
          </v-col>
        </v-row>
        <v-row
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4 d-none d-sm-block resolution-text-label"
          >
            <label><strong>Resolution Text</strong></label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="resolution-text"
          >
            <div
              v-if="getSpecialResolution"
              v-sanitize="getSpecialResolution.resolution"
              class="resizable"
            />
          </v-col>
        </v-row>
        <v-row
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4 d-none d-sm-block siging-party-label"
          >
            <label><strong> Signing Party</strong></label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="siging-party"
          >
            {{ signingParty }}
          </v-col>
        </v-row>

        <v-row
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4 siging-date-label"
          >
            <label><strong> Date Signed</strong></label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0 siging-date"
          >
            {{ signingDate }}
          </v-col>
        </v-row>

        <!-- Confirm Resolution -->
        <v-row
          id="special-resolution-confirm"
          no-gutters
          class="mt-6 section-confirm-resolution"
          :class="{ 'invalid-section': invalidSpecialResolutionConfirmSection }"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label :class="{ 'error-text': invalidSpecialResolutionConfirmSection }">
              <strong>Confirm Special Resolution</strong></label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0 ml-n5"
          >
            <v-form ref="confirmResolutionChkFormRef">
              <v-checkbox
                id="chk-confirm-resolution"
                ref="confirmResolutionChkRef"
                v-model="resolutionConfirmed"
                class="chk-resolution mt-0 pt-0"
                hide-details
                :rules="confirmCompletionResolution"
                @change="onResolutionConfirmedChange($event)"
              >
                <template #label>
                  <div>I confirm the following:</div>
                </template>
              </v-checkbox>
              <ul>
                <li class="mt-4">
                  The special resolution was passed by <strong>{{ companyName }}.</strong>
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
import { Action, Getter } from 'pinia-class'
import { ActionBindingIF, FormIF, EntitySnapshotIF } from '@/interfaces/'
import { CommonMixin, DateMixin } from '@/mixins/'
import { HelpSection } from '@/components/common/'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces'
import { useStore } from '@/store/store'

@Component({
  components: {
    HelpSection,
    DatePickerShared
  }
})
export default class CreateSpecialResolutionSummary extends Mixins(CommonMixin, DateMixin) {
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getSpecialResolutionConfirmValid!: boolean
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF

  @Action(useStore) setSpecialResolution!: ActionBindingIF
  @Action(useStore) setSpecialResolutionConfirmStateValidity!: ActionBindingIF

  // Refs
  $refs!: {
    confirmResolutionChkFormRef: FormIF
  };

  resolutionConfirmed = false

  /** Validation rule for checkbox. */
  confirmCompletionResolution = [
    v => {
      return !!v
    }
  ];

  async onResolutionConfirmedChange (resolutionConfirmed: boolean): Promise<void> {
    // This is required as there are timing issues between this component and the CompleteResolutionSummary
    // component.  The CompleteResolutionSummary isn't always able to detect that the confirm checkbox
    // value has changed without using nextTick()
    await this.$nextTick()
    this.setSpecialResolution({
      ...this.getSpecialResolution,
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
    return this.yyyyMmDdToPacificDate(this.getSpecialResolution.resolutionDate, true)
  }

  /** The signing date in readable. */
  get signingDate (): string {
    return this.yyyyMmDdToPacificDate(this.getSpecialResolution.signingDate, true)
  }

  /** The signing person details. */
  get signingParty (): string {
    if (this.getSpecialResolution.signatory) {
      const { givenName, additionalName = '', familyName } = this.getSpecialResolution.signatory
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
  updateResolutionStepValidationDetail (): void {
    // don't call validation during Jest tests because we are setting app valid
    !this.isJestRunning && this.$refs.confirmResolutionChkFormRef.validate()
  }

  /** Called when component is mounted. */
  mounted () {
    this.resolutionConfirmed = this.getSpecialResolution.resolutionConfirmed || false
    this.setSpecialResolutionConfirmStateValidity(this.resolutionConfirmed)
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

:deep(.chk-resolution) {
  label {
    font-weight: normal;
    color: $gray9;
  }
}

.resizable {
  background: #f1f3f5;
  overflow-y: auto;
  resize: vertical;
  min-width: 100%;
  max-width: 400px;
  min-height: 90px;
  height: 425px;
  max-height: 800px;
}
</style>
