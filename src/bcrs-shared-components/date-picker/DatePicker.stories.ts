import { DatePicker } from './index'

export default {
  title: 'component/DatePicker',
  component: DatePicker,
  argTypes: {
  }
}

const minDateStr = '2021-03-01'
const maxDateStr = '2021-06-01'

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DatePicker },
  template: '<date-picker v-bind="$props" />' // $props comes from args below
})

export const datePickerBaseline = Template.bind({})
datePickerBaseline.args = {
  title: 'Date',
  errorMsg: '',
  inputRules: [],
  disablePicker: false,
  minDate: '',
  maxDate: '',
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0
}

export const datePickerError = Template.bind({})
datePickerError.args = {
  title: 'Date',
  errorMsg: 'You have some validation errors',
  inputRules: [],
  disablePicker: false,
  minDate: '',
  maxDate: '',
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0
}

export const datePickerMinMax = Template.bind({})
datePickerMinMax.args = {
  title: 'Date with rules',
  errorMsg: '',
  inputRules: [],
  disablePicker: false,
  minDate: minDateStr,
  maxDate: maxDateStr,
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0
}

export const datePickerInitialValue = Template.bind({})
datePickerInitialValue.args = {
  title: 'Date with initial value',
  initialValue: '2021-11-18',
  errorMsg: '',
  inputRules: [],
  disablePicker: false,
  minDate: '',
  maxDate: '',
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0
}

export const datePickerHint = Template.bind({})
datePickerHint.args = {
  title: 'Date',
  errorMsg: '',
  hint: 'this is a hint.',
  inputRules: [],
  disablePicker: false,
  minDate: '',
  maxDate: '',
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0,
  persistentHint: true
}

export const datePickerClearable = Template.bind({})
datePickerClearable.args = {
  title: 'Date clearable',
  errorMsg: '',
  hint: '',
  inputRules: [],
  disablePicker: false,
  minDate: '',
  maxDate: '',
  nudgeTop: 0,
  nudgeBottom: 0,
  nudgeRight: 0,
  nudgeLeft: 0,
  persistentHint: true,
  clearable: true
}
