import { ContactInfo } from './index'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

export default {
  title: 'component/ContactInfo',
  component: ContactInfo,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ContactInfo },
  template: '<contact-info v-bind="$props" />' // $props comes from args below
})

const ContactData: ContactPointIF = {
  email: 'mock@email.com',
  confirmEmail: 'mock@email.com',
  phone: '2501234567',
  extension: null
}

const ContactDataChanged: ContactPointIF = {
  email: 'newMock@email.com',
  confirmEmail: 'newMock@email.com',
  phone: '2509876543',
  extension: 123
}

const ContactDataOptionalPhone: ContactPointIF = {
  email: 'mock@email.com',
  confirmEmail: 'mock@email.com',
  phone: '',
  extension: null
}

export const FiledAlteration = Template.bind({})
FiledAlteration.args = {
  businessContact: ContactData,
  originalBusinessContact: ContactData,
  hasBusinessContactInfoChange: false,
  editLabel: 'Change',
  editedLabel: 'Changed'
}

export const ChangedAlteration = Template.bind({})
ChangedAlteration.args = {
  businessContact: ContactDataChanged,
  originalBusinessContact: ContactDataChanged,
  hasBusinessContactInfoChange: true,
  editLabel: 'Change',
  editedLabel: 'Changes Saved'
}

export const FiledCorrection = Template.bind({})
FiledCorrection.args = {
  businessContact: ContactData,
  originalBusinessContact: ContactData,
  hasBusinessContactInfoChange: false,
  editLabel: 'Correct',
  editedLabel: 'Corrected'
}

export const ChangeFirm = Template.bind({})
ChangeFirm.args = {
  contactLabel: 'Business',
  disableActionTooltip: true,
  businessContact: ContactData,
  originalBusinessContact: ContactData,
  hasBusinessContactInfoChange: false,
  editLabel: 'Change',
  editedLabel: 'Changes Saved'
}

export const ChangedFirm = Template.bind({})
ChangedFirm.args = {
  contactLabel: 'Business',
  disableActionTooltip: true,
  businessContact: ContactDataChanged,
  originalBusinessContact: ContactData,
  hasBusinessContactInfoChange: true,
  editLabel: 'Change',
  editedLabel: 'Changes Saved'
}

export const OptionalPhone = Template.bind({})
OptionalPhone.args = {
  contactLabel: 'Business',
  disableActionTooltip: true,
  businessContact: ContactDataOptionalPhone,
  originalBusinessContact: ContactDataOptionalPhone,
  hasBusinessContactInfoChange: false,
  editLabel: 'Change',
  editedLabel: 'Changes Saved',
  optionalPhone: true
}
