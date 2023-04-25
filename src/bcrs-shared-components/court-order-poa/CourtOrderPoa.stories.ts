import { CourtOrderPoa } from './index'

export default {
  title: 'component/CourtOrderPoa',
  component: CourtOrderPoa,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CourtOrderPoa },
  template: '<court-order-poa v-bind="$props" />' // $props comes from args below
})

export const courtOrderPoa = Template.bind({})
courtOrderPoa.args = {
  validate: false
}

export const courtOrderPoaDraft = Template.bind({})
courtOrderPoaDraft.args = {
  validate: false,
  draftCourtOrderNumber: '1234-56789',
  hasDraftPlanOfArrangement: true
}
