import { HelpBusinessNumber } from './index'

export default {
  title: 'component/HelpBusinessNumber',
  component: HelpBusinessNumber,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HelpBusinessNumber },
  template: '<help-business-number v-bind="$props" />' // $props comes from args below
})

export const Default = Template.bind({})
Default.args = {
  isTypeSoleProp: false,
  isTypePartnership: false
}
