import { ApprovalType } from './index'

export default {
  title: 'component/ApprovalType',
  component: ApprovalType,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ApprovalType },
  template: '<approval-type v-bind="$props" />' // $props comes from args below
})

export const Default = Template.bind({})
Default.args = {}

export const defaultCourtOrderOnly = Template.bind({})
defaultCourtOrderOnly.args = {
  isCourtOrderOnly: true
}

export const conversionToFullRestoration = Template.bind({})
conversionToFullRestoration.args = {
  filingType: 'conversion to full restoration'
}

export const draftViaRegistrar = Template.bind({})
draftViaRegistrar.args = {
  approvedByRegistrar: true
}

export const draftViaCourtOrder = Template.bind({})
draftViaCourtOrder.args = {
  courtOrderNumber: '99-1234567'
}

export const draftViaRegistrarWithDates = Template.bind({})
draftViaRegistrarWithDates.args = {
  approvedByRegistrar: true,
  noticeDate: '2023-02-02',
  applicationDate: '2023-01-15'
}

export const draftExtensionWithCourtOrder = Template.bind({})
draftExtensionWithCourtOrder.args = {
  courtOrderNumber: '99-1234567',
  isExtension: true,
  isCourtOrderOnly: true,
  isCourtOrderRadio: false
}
