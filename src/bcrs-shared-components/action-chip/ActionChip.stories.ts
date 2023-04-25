import { ActionChip } from './index'
import { ActionableItemIF } from '@/bcrs-shared-components/interfaces'
import { ActionTypes } from '@/bcrs-shared-components/enums'
import Vuetify from 'vuetify'

export default {
  title: 'component/ActionChip',
  component: ActionChip,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  props: Object.keys(argTypes),
  components: { ActionChip },
  template: '<action-chip v-bind="$props" />' // $props comes from args below
})

const addedAction: ActionableItemIF = { action: ActionTypes.ADDED }
const removedAction: ActionableItemIF = { action: ActionTypes.REMOVED }
const editedAction: ActionableItemIF = { action: ActionTypes.EDITED }

export const added = Template.bind({})
added.args = {
  actionableItem: addedAction
}

export const removed = Template.bind({})
removed.args = {
  actionableItem: removedAction
}

export const editedAlteration = Template.bind({})
editedAlteration.args = {
  actionableItem: editedAction,
  editedLabel: 'CHANGED'
}

export const editedCorrection = Template.bind({})
editedCorrection.args = {
  actionableItem: editedAction,
  editedLabel: 'CORRECTED'
}
