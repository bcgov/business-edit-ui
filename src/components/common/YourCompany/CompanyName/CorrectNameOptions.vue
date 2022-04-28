<template>
  <v-container id="name-options-container" class="pa-0 pr-4">
    <p class="info-text mb-5 pb-5 bottom-border" v-if="!isOneOption">
      You can correct the company name in one of the following ways:
    </p>
    <v-expansion-panels v-model="panel" class="bottom-border" accordion>
      <v-expansion-panel
        v-for="(item,i) in displayedOptions"
        class="mb-4"
        :id="`x-panel-${item.id}`"
        :key="i"
        :disabled="isOneOption"
        @click="identifyForm(item.id)"
      >
        <v-expansion-panel-header :class="{'name-options-header': isOneOption}">
          <span class="names-option-title">{{item.title}}</span>
          <template v-slot:actions>
            <v-icon color="primary">mdi-menu-down</v-icon>
          </template>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="name-options-content pt-4">
          <div v-if="item.description" class="info-text mb-4" color="primary">{{item.description}}</div>
          <component
            :is="item.component"
            :key="item.id"
            :formType="formType"
            :validate="validateNameChange"
            @done="emitDone($event)"
            @isValid="isFormValid = $event"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="action-btns">
      <v-btn
        id="done-btn"
        large color="primary"
        :loading="isLoading"
        @click="submitNameCorrection()"
      >
        <span>Done</span>
      </v-btn>

      <v-btn
        id="cancel-btn"
        large outlined color="primary"
        @click="emitCancel()"
      >
        <span>Cancel</span>
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { CorrectNameOptionIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

// for some reason, CorrectXXX cannot be imported from ./
// (it breaks a bunch of unit tests)
import { CorrectCompanyName, CorrectNameToNumber, CorrectNameRequest } from '@/components/common'

/**
 * Operation:
 * 1. To initialize this component option list, pass in an array of id's of the components you want to display.
 *    I.e., ['correct-new-nr', 'correct-name', 'correct-name-to-number']
 * 2. If this options list is only passed one value the option panel will be open by default.
 * 3. The parent component will have to watch for the 'save' and 'cancel' events and handle them accordingly.
 */
@Component({
  components: {
    CorrectCompanyName,
    CorrectNameToNumber,
    CorrectNameRequest
  }
})
export default class CorrectNameOptions extends Vue {
  /** The options to display */
  @Prop() readonly correctionNameChoices: Array<string>

  // local properties
  private displayedOptions: Array<CorrectNameOptionIF> = []
  private panel: number = null
  private formType: CorrectionTypes = null
  private currentFormType: CorrectionTypes = null
  private isLoading = false
  private isFormValid = false
  private validateNameChange = false
  private correctionNameOptions: Array<CorrectNameOptionIF> = [
    {
      id: CorrectionTypes.CORRECT_NAME,
      title: 'Edit the company name',
      description: 'Correct typographical errors in the existing company name.',
      component: CorrectCompanyName
    },
    {
      id: CorrectionTypes.CORRECT_NAME_TO_NUMBER,
      title: 'Use the incorporation number as the name',
      description: null,
      component: CorrectNameToNumber
    },
    {
      id: CorrectionTypes.CORRECT_NEW_NR,
      title: 'Use a new name request number',
      description: 'Enter the new Name Request Number (e.g., NR1234567) and either the applicant phone number OR ' +
        'the applicant email that was used when the name was requested.',
      component: CorrectNameRequest
    }
  ]

  mounted () {
    // Filter the options to be displayed by what id's were passed from the parent component
    this.displayedOptions = this.correctionNameOptions.filter(
      option => this.correctionNameChoices.includes(option.id)
    )
    // open by default and assign id if only 1 option
    if (this.isOneOption) {
      this.panel = 0
      this.currentFormType = this.displayedOptions[0].id
    }
  }

  get isOneOption (): boolean {
    return this.correctionNameChoices.length === 1
  }

  /** Trigger form submission */
  private submitNameCorrection (): void {
    if (this.isFormValid) {
      this.isLoading = true
      this.formType = this.currentFormType
    } else this.validateNameChange = true
  }

  /** Identify the current form */
  private identifyForm (type: CorrectionTypes) {
    this.currentFormType = type
    this.isFormValid = false
  }

  /** Inform Parent name correction process is done. */
  @Emit('done')
  private emitDone (isSaved: boolean): boolean {
    this.isLoading = false
    this.formType = null
    if (isSaved) this.panel = null
    return isSaved
  }

  /** cancel name correction */
  @Emit('cancel')
  private emitCancel (): void {
    this.panel = null
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.name-options-header {
  align-items: start;
}

.bottom-border {
  border-color: rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid;
}

.v-expansion-panel:not(:first-child) {
  padding-top: 1.25rem;
}

.names-option-title {
  font-size: 1rem;
  color: $app-blue;
}

.v-expansion-panel-content ::v-deep .v-expansion-panel-content__wrap {
  padding: 0;
}

.v-expansion-panel-header {
  padding: .25rem 0 0;
  color: $app-blue;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  font-weight: bold;
  min-height: 3rem;

  .names-option-title {
    color: $gray9 !important;
  }
}

.action-btns {
  margin: 30px 0;
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
</style>
