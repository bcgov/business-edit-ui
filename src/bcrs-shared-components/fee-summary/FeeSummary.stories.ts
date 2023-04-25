import Vue from 'vue'
import { FeeSummary } from './index'
import { FilingCodes, CorpTypeCd } from '@/bcrs-shared-components/enums/'
import { FilingDataIF } from '@/bcrs-shared-components/interfaces/'

// for SbcFeeSummary
Vue.filter('currency', x => `$${x}`)

export default {
  title: 'component/FeeSummary',
  component: FeeSummary,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FeeSummary },
  template: '<div style="max-width: 350px"><fee-summary v-bind="$props" /></div>' // $props comes from args below
})

const filingData = [{
  filingTypeCode: FilingCodes.ALTERATION,
  entityType: CorpTypeCd.BC_CORPORATION,
  priority: false
}] as FilingDataIF[]

export const Default = Template.bind({})
Default.args = {
  filingData: filingData,
  payApiUrl: 'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/',
  hasConflicts: false,
  isLoading: false,
  confirmLabel: 'Continue',
  errorMessage: ''
}

export const summaryMode = Template.bind({})
summaryMode.args = {
  filingData: filingData,
  payApiUrl: 'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/',
  hasConflicts: false,
  isLoading: false,
  confirmLabel: 'File and Pay',
  errorMessage: '',
  isSummaryMode: true
}
