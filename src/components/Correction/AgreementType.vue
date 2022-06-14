<template>
  <div id="agreement-summary">
    <v-card flat>
      <!-- Summary Header -->
      <div class="agreement-summary-header">
        <v-icon color="appDkBlue">mdi-handshake</v-icon>
        <label class="agreement-summary-title font-weight-bold">
          Incorporation Agreement and Benefit Company Articles
        </label>
      </div>

      <!-- Summary Content -->
      <div v-if="!showAgreementTypeForm" class="summary-desc">
        <div><v-icon color="green darken-2" class="agreement-valid-icon">mdi-check</v-icon></div>
        <div>
          <div>
            {{ selectedAgreementDescription }}
          </div>
          <div v-if="hasAgreementTypeChange">
            <v-chip x-small label color="primary" text-color="white" id="corrected-lbl">
              Corrected
            </v-chip>
          </div>
        </div>
        <div>
          <v-flex md2 class="align-right">
            <v-btn v-if="!hasAgreementTypeChange"
              text
              color="primary"
              id="btn-correct-agreement-type"
              @click="showAgreementTypeForm = true">
              <v-icon small>mdi-pencil</v-icon>
              <span>Correct</span>
            </v-btn>
            <v-btn v-if="hasAgreementTypeChange"
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
              v-for="(item, index) in AgreementTypeResource"
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
            <v-btn id="cancel-btn" large outlined color="primary" @click="resetAgreementType">
              <span>Cancel</span>
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, IncorporationApplicationIF } from '@/interfaces/'
import { AgreementTypeResource } from '@/resources/Correction/'

@Component
export default class AgreementType extends Vue {
  // declaration for template
  readonly AgreementTypeResource = AgreementTypeResource

  // Global getters
  @Getter getAgreementType!: string
  @Getter getOriginalIA!: IncorporationApplicationIF

  // Global actions
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setEditingIncorporationAgreement!: ActionBindingIF

  // Local properties
  private agreementType: string = null
  private showAgreementTypeForm = false

  get hasAgreementTypeChange (): boolean {
    return (
      this.agreementType !== this.getOriginalIA?.incorporationAgreement.agreementType
    )
  }

  get selectedAgreementDescription () : string {
    if (this.getAgreementType) {
      return AgreementTypeResource.find(item => item.code === this.getAgreementType)
        .summaryDescription
    }
    return ''
  }

  private setAgreementType (): void {
    this.setIncorporationAgreementData()
    this.showAgreementTypeForm = false
  }

  private setIncorporationAgreementData (): void {
    this.setIncorporationAgreementStepData({
      valid: !!this.agreementType,
      changed: this.hasAgreementTypeChange,
      agreementType: this.agreementType
    })
  }

  private resetAgreementType (): void {
    this.agreementType = this.getOriginalIA?.incorporationAgreement.agreementType
    this.setAgreementType()
  }

  @Watch('getAgreementType', { immediate: true })
  private onAgreementTypeStateChange () {
    this.agreementType = this.getAgreementType
    this.setIncorporationAgreementData()
  }

  /** Updates store when local Editing property has changed. */
  @Watch('showAgreementTypeForm', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingIncorporationAgreement(val)
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

.summary-desc {
  padding: 1rem;
  font-size: $px-14;
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
  padding-right: 0.5rem;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  .v-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}
</style>
