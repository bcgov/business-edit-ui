import { FolioNumber } from './index'

export default {
  title: 'component/FolioNumber',
  component: FolioNumber,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FolioNumber },
  // $props comes from args below
  template: `
    <div class="pa-4" style="background-color: #f1f3f5">
      <folio-number v-bind="$props" class="pa-4" style="background-color: white" />
    </div>
  `
})

export const folioNumberNoProps = Template.bind({})
folioNumberNoProps.args = {
  editLabel: 'Edit',
  editedLabel: 'Edited'
}

export const folioNumberWithData = Template.bind({})
folioNumberWithData.args = {
  editLabel: 'Edit',
  editedLabel: 'Edited',
  initialValue: 'ABC-123',
  originalValue: 'DEF-456'
}

export const folioNumberHideActions = Template.bind({})
folioNumberHideActions.args = {
  editLabel: 'Edit',
  editedLabel: 'Edited',
  hideActions: true
}
