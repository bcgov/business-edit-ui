<template>
  <div>
    <div id="agreement-summary" v-if="isSummary">
      <v-card flat>
        <!-- Summary Header -->
        <div class="agreement-summary-header">
          <v-icon>mdi-handshake</v-icon>
          <label class="agreement-summary-title">
            <strong>Incorporation Agreement and Benefit Company Articles</strong>
          </label>
        </div>

        <!-- Summary Content -->
        <div v-if="!showAgreementTypeForm" class="summary-desc">
          <div><v-icon color="green" class="agreement-valid-icon">mdi-check</v-icon></div>
          <div>
            <div>
              {{ selectedAgreementDescription }}
            </div>
            <div v-if="hasAgreementTypeChange">
              <v-chip x-small label color="blue" text-color="white">
                Corrected
              </v-chip>
            </div>
          </div>
          <div>
            <v-flex md2 class="align-right">
              <v-btn
                v-if="!hasAgreementTypeChange"
                text
                color="primary"
                id="btn-correct-agreement-type"
                @click="showAgreementTypeForm = true">
                <v-icon small>mdi-pencil</v-icon>
                <span>Correct</span>
              </v-btn>
              <v-btn
                v-if="hasAgreementTypeChange"
                text
                color="primary"
                id="btn-undo-agreement-type"
                @click="resetAgreementType">
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
            </v-flex>
          </div>
        </div>
        <div v-else>
          <v-card flat>
            <v-radio-group v-model="agreementType" class="agreement-option-list">
              <v-radio
                v-for="(item, index) in incorporationAgreementTypeResource"
                :key="index"
                :value="item.code"
                :id="`agreement-type-${item.code}`">
                <template slot="label">
                  <div v-html="item.description" class="agreement-option" />
                </template>
              </v-radio>
            </v-radio-group>
            <div class="action-btns">
              <v-btn id="done-btn" large color="primary" @click="setAgreementType">
                <span>Done</span>
              </v-btn>

              <v-btn v-btn id="cancel-btn" large outlined color="primary" @click="resetAgreementType">
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Vue, Prop, Watch } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF, IncorporationFilingIF } from '@/interfaces'
import { AgreementTypeResource } from '@/resources'

@Component
export default class AgreementType extends Vue {
  private incorporationAgreementTypeResource = AgreementTypeResource

  // State
  @State(state => state.stateModel.incorporationAgreementStep.agreementType)
  readonly agreementTypeState: string | null

  @State(state => state.stateModel.originalIA)
  readonly originalIA!: IncorporationFilingIF

  @Prop({ default: false })
  private isSummary: boolean

  // Global setters
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF

  // Local properties
  private agreementType: string | null = null
  private showAgreementTypeForm = false

  // Lifecycle methods
  private created (): void {
    this.agreementType = this.agreementTypeState
  }

  mounted (): void {
    this.setIncorporationAgreementStepData({
      valid: !!this.agreementType,
      agreementType: this.agreementType
    })

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveChanges(false))
  }

  private setAgreementType (): void {
    this.setIncorporationAgreementStepData({
      valid: !!this.agreementType,
      agreementType: this.agreementType
    })
    this.emitHaveChanges()
    this.showAgreementTypeForm = false
  }

  private resetAgreementType (): void {
    this.agreementType = this.originalIA.incorporationApplication.incorporationAgreement.agreementType
    this.setAgreementType()
  }

  private get hasAgreementTypeChange (): boolean {
    return this.agreementType !== this.originalIA.incorporationApplication.incorporationAgreement.agreementType
  }

  private get selectedAgreementDescription () : string {
    if (this.agreementTypeState) {
      return this.incorporationAgreementTypeResource.find(item => item.code === this.agreementTypeState)
        .summaryDescription
    } else { return '' }
  }

  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return (
      this.hasAgreementTypeChange
    )
  }

  @Watch('agreementTypeState')
  private onAgreementTypeStateChange () {
    this.agreementType = this.agreementTypeState
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.agreement-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .agreement-summary-title {
    padding-left: .5rem;
  }
}

#agreement-summary {
    margin-top: 1rem;
}

.summary-desc {
    padding: 1rem;
    font-size: 0.875rem;
    display: flex;
    justify-content: center;
}

.agreement-valid-icon {
    padding-right: 0.5rem;
}

.agreement-option-list {
  padding: 1.5rem;
}

.agreement-option {
  padding-top: 1rem;
  color: $gray7;
}

.action-btns {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 1rem;
      padding-right:0.5rem;

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

.v-size--x-small {
  display: table;
  margin-top: 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
}
</style>
