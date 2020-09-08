<template>
  <v-container id="name-options-container">
    <h4 class="name-options-info mb-3">You can correct the company name in one of the following ways:</h4>
    <v-expansion-panels v-model="panel">
      <v-expansion-panel
        v-for="(item,i) in displayedOptions"
        :key="i"
      >
        <v-expansion-panel-header class="name-options-header">{{item.description}}</v-expansion-panel-header>
        <v-expansion-panel-content class="name-options-content">
          <v-container>
            <component
              :is="item.component"
              :key="item.id"
              :submit="submit"
              @save="emitSave"
              @isDone="isLoading = false"
              @isValid="isFormValid = $event"
            />
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="action-btns my-3">
      <v-btn
        id="done-btn"
        large color="primary"
        @click="submitNameCorrection"
        :disabled="!isFormValid"
        :loading="isLoading"
      >
        <span>Done</span>
      </v-btn>

      <v-btn id="cancel-btn" large @click="emitCancel"><span>Cancel</span></v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

// Components
import CorrectNameRequest from './CorrectNameRequest.vue'

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
    CorrectNameRequest
  }
})
export default class CorrectNameOptions extends Vue {
  /** The options to display */
  @Prop() correctionNameChoices: Array<string>

  // local properties
  private displayedOptions: Array<CorrectNameOptionIF> = []
  private panel = null as number
  private submit = false
  private isLoading = false
  private isFormValid = false
  private correctionNameOptions: Array<CorrectNameOptionIF> = [
    {
      id: CorrectionTypes.CORRECT_NAME,
      description: 'Edit the company name',
      component: ''// CorrectName
    },
    {
      id: CorrectionTypes.CORRECT_NAME_TO_NUMBER,
      description: 'Use the incorporation number as the name',
      component: '' // CorrectNameToNumber
    },
    {
      id: CorrectionTypes.CORRECT_NEW_NR,
      description: 'Use a new name request number',
      component: CorrectNameRequest
    }
  ]

  mounted () {
    // Filter the options to be displayed by what id's were passed from the parent component
    this.displayedOptions = this.correctionNameOptions.filter(
      option => this.correctionNameChoices.includes(option.id)
    )
    if (this.correctionNameChoices.length === 1) this.panel = 0 // open by default if only 1 option
  }

  /** Request the child to submit it's form */
  private submitNameCorrection (): void {
    this.isLoading = true
    this.submit = !this.submit
  }

  /** Pass event to parent to handle updates */
  @Emit('save')
  private emitSave (): void {
    this.panel = null
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

    .action-btns {
      display: flex;
      justify-content: flex-end;

      .v-btn + .v-btn {
        margin-left: 0.5rem;
      }
    }
  }
</style>
