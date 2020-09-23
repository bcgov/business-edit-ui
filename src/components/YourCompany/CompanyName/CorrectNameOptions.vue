<template>
  <v-container id="name-options-container">
    <p class="name-options-info mb-5" v-if="!isOneOption">
      You can correct the company name in one of the following ways:
    </p>
    <v-expansion-panels v-model="panel">
      <v-expansion-panel
        v-for="(item,i) in displayedOptions"
        :id="`x-panel: ${item.id}`"
        :key="i"
        :disabled="isOneOption"
        @click="identifyForm(item.id)"
      >
        <v-expansion-panel-header class="px-0" :class="{'name-options-header': isOneOption}">
          <span class="names-option-title">{{item.title}}</span>
          <template v-slot:actions>
            <v-icon color="primary">mdi-menu-down</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="name-options-content">
          <v-label class="name-content-label" color="primary">{{item.description}}</v-label>
          <v-container>
            <component
              :is="item.component"
              :key="item.id"
              :formType="formType"
              @done="emitDone($event)"
              @isValid="isFormValid = $event"
            />
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="action-btns my-3">
      <v-btn
        id="done-btn"
        large
        color="primary"
        @click="submitNameCorrection"
        :disabled="!isFormValid"
        :loading="isLoading"
      >
        <span>Done</span>
      </v-btn>

      <v-btn id="cancel-btn" large outlined color="primary" @click="emitCancel"><span>Cancel</span></v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

// Components
import CorrectNameRequest from '@/components/YourCompany/CompanyName/CorrectNameRequest.vue'
import CorrectCompanyName from '@/components/YourCompany/CompanyName/CorrectCompanyName.vue'
import CorrectNameToNumber from '@/components/YourCompany/CompanyName/CorrectNameToNumber.vue'

// Interfaces & Enums
import { CorrectNameOptionIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

/**
 * Operation:
 * 1. To initialize this component option list, pass in an array of id's of the components you want to display.
 *    ie..[''correct-new-nr', 'correct-name', 'correct-name-to-number']
 * 2. If this options list is only passed one value the option panel will be open by default.
 * 3. The parent component will have to watch for the 'save' and 'cancel' events and handle them accordingly.
 */
@Component({
  components: {
    CorrectNameRequest,
    CorrectCompanyName
  }
})
export default class CorrectNameOptions extends Vue {
  /** The options to display */
  @Prop() correctionNameChoices: Array<string>

  // local properties
  private displayedOptions: Array<CorrectNameOptionIF> = []
  private panel = null as number
  private formType = null as CorrectionTypes
  private currentFormType = null as CorrectionTypes
  private isLoading = false
  private isFormValid = false
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
      description: 'Enter the new Name Request Number (e.g., NR1234567) and either the applicant phone number OR the ' +
        'applicant email that was used when the name was requested.',
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

  private get isOneOption (): boolean {
    return this.correctionNameChoices.length === 1
  }

  /** Trigger form submission */
  private submitNameCorrection (): void {
    this.isLoading = true
    this.formType = this.currentFormType
  }

  /** Identify the current form */
  private identifyForm (type: CorrectionTypes) {
    this.currentFormType = type
    this.isFormValid = false
  }

  /** Inform Parent name correction process is done. */
  @Emit('done')
  private emitDone (isSaved: boolean): void {
    this.isLoading = false
    this.formType = null
    if (isSaved) this.panel = null
  }

  /** cancel name correction */
  @Emit('cancel')
  private emitCancel (): void {
    this.panel = null
  }
}
</script>

<style lang="scss" scoped>
  #name-options-container {
    padding: 0;

    .name-options-header {
      align-items: start;
    }

    .names-option-title {
      color: #1669BB
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

      .v-btn[disabled] {
        color: white !important;
        background-color: #1669BB !important;
        opacity: .2;
      }
    }
  }

  .v-expansion-panel-content ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
  }

  .v-expansion-panel-header {
    padding: .25rem 0 0;
    color: #1669BB
  }

  .v-expansion-panel--active > .v-expansion-panel-header {
    font-weight: bold;
    min-height: 3rem;

    .names-option-title {
      color: #212529 !important;
    }
  }
</style>
