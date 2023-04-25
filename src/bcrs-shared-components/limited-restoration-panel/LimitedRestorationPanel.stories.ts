import { LimitedRestorationPanel } from './index'

export default {
  title: 'component/LimitedRestorationPanel',
  component: LimitedRestorationPanel,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LimitedRestorationPanel },
  template: '<limited-restoration-panel v-bind="$props" />' // $props comes from args below
})

export const Default = Template.bind({})
Default.args = {
  currentDate: '2023-02-03',
  expiryDate: null
}

export const eighteenMonths = Template.bind({})
eighteenMonths.args = {
  currentDate: '2023-02-03',
  expiryDate: '2024-08-03'
}

export const fourMonths = Template.bind({})
fourMonths.args = {
  currentDate: '2023-02-03',
  expiryDate: '2023-06-03',
  maxNumberOfMonths: 36
}

export const fifteenMonths = Template.bind({})
fifteenMonths.args = {
  currentDate: '2023-02-03',
  expiryDate: '2024-05-03',
  maxNumberOfMonths: 36
}
