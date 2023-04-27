<template>
  <v-card>
    <header class="font-weight-bold px-3 py-3">
      <slot name="header">Fee Summary</slot>
    </header>

    <div v-show="fetchError">
      <v-alert color="error" icon="warning" outlined>{{fetchError}}</v-alert>
    </div>

    <v-slide-y-transition group tag="ul" class="fee-list" v-show="!fetchError">
      <template
        v-show="(totalFilingFees > 0 && lineItem.fee) || (totalFilingFees == 0)"
        v-for="lineItem in fees"
        >
        <li class="container fee-list__item"
          :key="lineItem.filingType"
          >
          <div class="fee-list__item-name">{{filingLabel ? filingLabel : lineItem.filingType}}</div>
          <div class="fee-list__item-value" v-if="lineItem.fee > 0">{{lineItem.fee | currency}}</div>
          <div class="fee-list__item-value" v-else>No Fee</div>
        </li>
        <li class="container fee-list__item"
          v-if="lineItem.priorityFees"
          :key="lineItem.filingType+'-priority'"
          >
          <div class="fee-list__item-name pl-3">Priority Fee</div>
          <div class="fee-list__item-value">{{lineItem.priorityFees | currency}}</div>
        </li>
        <li class="container fee-list__item"
          v-if="lineItem.futureEffectiveFees"
          :key="lineItem.filingType+'-futureEffective'"
          >
          <div class="fee-list__item-name pl-3">Future Effective Fee</div>
          <div class="fee-list__item-value">{{lineItem.futureEffectiveFees | currency}}</div>
        </li>
        <li class="container fee-list__item"
          v-if="lineItem.serviceFees"
          :key="lineItem.filingType+'-transaction'"
          >
          <div class="fee-list__item-name pl-3">Service Fee</div>
          <div class="fee-list__item-value">{{lineItem.serviceFees | currency}}</div>
        </li>
      </template>
    </v-slide-y-transition>

    <div class="container fee-total" v-show="!fetchError">
      <div class="fee-total__name">Total Fees</div>
      <div class="fee-total__currency">CAD</div>
      <div class="fee-total__value">
        <v-slide-y-reverse-transition name="slide" mode="out-in">
          <div>{{totalFilingFees | currency}}</div>
        </v-slide-y-reverse-transition>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import '../plugins/vuetify'
import FeeServices from '../services/fee.services'
import { Fee, FilingData } from '../models'

@Component({})
export default class SbcFeeSummary extends Vue {
  /* This prop is an array of filing data. See model for details. */
  @Prop({ default: [] })
  private filingData!: Array<FilingData>

  @Prop({ default: '' })
  private payURL!: string

  @Prop()
  private filingLabel!: string

  /* class properties */
  private fees: Fee[] = []
  private fetchError: string = ''

  /* lifecycle event */
  private mounted (): void {
    // console.log('%c FeeModule-Data Received on Mount as %s %s', 'color: blue; font-size: 12px',
    //   JSON.stringify(this.filingData), this.payURL)

    FeeServices.getFee(this.filingData, this.payURL)
      .then(data => {
        this.fetchError = ''
        this.fees = data
        this.emitTotalFee(this.totalFilingFees)
      })
      .catch((error: any) => {
        this.fetchError = 'Error fetching fees' + error
      })
  }

  /* getter */
  private get totalFilingFees (): number {
    return this.fees.reduce((acc: number, item: Fee) => acc + item.total, 0)
  }

  /* watcher */
  @Watch('filingData')
  private onFilingDataChanged (val: string, oldVal: string): void {
    // console.log('%c FeeModule-Watch Activated as %s', 'color: blue; font-size: 12px',
    //   JSON.stringify(this.filingData))

    FeeServices.getFee(this.filingData, this.payURL).then((data: any) => {
      this.fetchError = ''
      this.fees = data
      this.emitTotalFee(this.totalFilingFees)
    }).catch((error: any) => {
      this.fetchError = 'Error fetching fees' + error
    })
  }

  /* emitter */
  @Emit('total-fee')
  private emitTotalFee (val: number): void {}
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

header {
  color: #fff;
  background: $BCgovBlue5;
}

ul {
    padding: 0;
    list-style-type: none;
}

.container {
  display: flex;
  flex-flow: row nowrap;
  line-height: 1.2rem;
  font-size: 0.875rem;
}

.fee-list {
  border-bottom: 1px solid $gray3;
}

.fee-list__item {
  &-name, &-value {
    font-weight: 700;
  }

  &-name {
    flex: 1 1 auto;
    margin-right: 2rem;
  }

  &-value {
    flex: 0 0 auto;
    text-align: right;
  }
}

.fee-list__item + .fee-list__item {
  border-top: 1px solid $gray3;
}

.fee-total {
  align-items: center;
  letter-spacing: -0.01rem;
  line-height: auto;

  &__name {
    flex: 1 1 auto;
    margin-right: auto;
    font-weight: 700;
  }

  &__currency {
    margin-right: 0.5rem;
    color: $gray5;
    font-weight: 500;
  }

  &__value {
    font-size: 1.65rem;
    font-weight: 700;
  }
}
</style>
