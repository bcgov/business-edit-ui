<template>
  <div id="agreement-summary">
    <v-card flat>
      <!-- Title -->
      <div class="agreement-summary-header pa-5">
        <v-icon color="appDkBlue">mdi-handshake</v-icon>
        <label class="pl-2 font-weight-bold">
          Incorporation Agreement and Benefit Company Articles
        </label>
      </div>

      <!-- Summary -->
      <div v-if="!showAgreementTypeForm && getAgreementType" class="summary-desc pa-4">
        <div>
          <v-icon color="green darken-2" class="pr-2">mdi-check</v-icon>
        </div>
        <div>
          <div class="pr-2">
            {{ selectedAgreementDescription }}
          </div>
          <div v-if="hasAgreementTypeChange">
            <v-chip x-small label color="primary" text-color="white" id="corrected-lbl">
              Corrected
            </v-chip>
          </div>
        </div>
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

      <!-- Edit -->
      <v-card flat v-else :class="{ 'invalid-section': !agreementType }">
        <v-radio-group v-model="agreementType" class="agreement-option-list mt-0 pa-6">
          <v-radio
            v-for="(item, index) in AgreementTypeResource"
            :key="index"
            :value="item.code"
            :id="`agreement-type-${item.code}`">
            <template slot="label">
              <div v-html="item.description" class="agreement-option pt-4" />
            </template>
          </v-radio>
        </v-radio-group>
        <div class="action-btns pr-2 pb-4">
          <v-btn id="done-btn" large color="primary" @click="setAgreementType">
            <span>Done</span>
          </v-btn>
          <v-btn id="cancel-btn" large outlined color="primary" @click="resetAgreementType">
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, EntitySnapshotIF } from '@/interfaces/'
import { AgreementTypeResource } from '@/resources/Correction/'

@Component
export default class AgreementType extends Vue {
  // Declaration for template
  readonly AgreementTypeResource = AgreementTypeResource

  // Global getters
  @Getter getAgreementType!: string
  @Getter getEntitySnapshot!: EntitySnapshotIF

  // Global actions
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setEditingIncorporationAgreement!: ActionBindingIF

  // Local properties
  private agreementType: string = null
  private showAgreementTypeForm = false

  get originalAgreementType (): string {
    return this.getEntitySnapshot?.businessInfo?.incorporationAgreementType
  }

  get hasAgreementTypeChange (): boolean {
    return (this.agreementType !== this.originalAgreementType)
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
    this.agreementType = this.originalAgreementType
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
}

.summary-desc {
  font-size: $px-14;
  display: flex;
  justify-content: center;
}

.agreement-option {
  color: $gray7;
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
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}
</style>
