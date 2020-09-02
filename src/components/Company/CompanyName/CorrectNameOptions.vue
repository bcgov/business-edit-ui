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
            <component :is="item.component" :key="item.id" />
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="action-btns my-3">
      <v-fade-transition hide-on-leave>
        <v-btn id="done-btn" large color="primary" @click="emitSave()"><span>Done</span></v-btn>
      </v-fade-transition>

      <v-btn id="cancel-btn" large @click="emitCancel"><span>Cancel</span></v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

// Interfaces & Enums
import { CorrectNameOptionIF } from '@/interfaces/correction-interfaces'
import { CorrectionTypes } from '@/enums'

/**
 * Operation:
 * 1. To initialize this component option list, pass in an array of id's of the components you want to display.
 *    ie..[''correct-new-nr', 'correct-name', 'correct-name-to-number']
 * 2. If this options list is only passed one value the option panel will be open by default.
 * 3. The parent component will have to watch for the 'save' and 'cancel' events and handle them accordingly.
 */
@Component({})
export default class CorrectNameOptions extends Vue {
  /** The options to display */
  @Prop() private correctionNameChoices: Array<string>

  // local properties
  private displayedOptions: Array<CorrectNameOptionIF> = []
  private panel = null as number
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
      component: '' // CorrectNameRequest
    }
  ]

  mounted () {
    // Filter the options to be displayed by what id's were passed from the parent component
    this.displayedOptions = this.correctionNameOptions.filter(
      option => this.correctionNameChoices.includes(option.id)
    )
    if (this.correctionNameChoices.length === 1) this.panel = 0 // open by default if only 1 option
  }

  /** save name correction */
  @Emit('save')
  private emitSave (): void {
    // Pass up event data for parent to handle setting to store etc
  }

  /** cancel name correction */
  @Emit('cancel')
  private emitCancel (): void {
    this.panel = 0
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
