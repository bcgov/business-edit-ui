import { Certify } from './index'

export default {
  title: 'component/Certify',
  component: Certify,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Certify },
  template: '<certify v-bind="$props" />' // $props comes from args below
})

export const Default = Template.bind({})
Default.args = {
  currentDate: '2020-01-17',
  isStaff: false,
  certifiedBy: '',
  isCertified: false,
  message: 'Note: It is an offence to make a false or misleading statement in respect of a material fact in a \n' +
    'record submitted to the Corporate Registry for filing. See section 427 of the Business Corporations Act.',
  entityDisplay: 'BC Company',
  disableEdit: false
}
