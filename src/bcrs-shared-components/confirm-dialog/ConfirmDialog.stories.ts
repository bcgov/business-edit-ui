import Vue from 'vue'
import Vuetify from 'vuetify'
import { ConfirmDialog } from './index'

export default {
  title: 'component/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  props: Object.keys(argTypes),
  components: { ConfirmDialog },
  template: '<confirm-dialog v-bind="$props" @hook:mounted="externalMount" />',
  methods: {
    async externalMount () {
      const vm = this.$children[0] // target the component confirm-dialog
      await this.$nextTick() // wait that mounted() finished
      vm.open(
        'Confirm Dialog Title',
        'Confirm dialog message. Ask your confirmation question here.',
        {
          width: '30rem',
          persistent: true,
          yes: 'Yes',
          no: 'No',
          cancel: 'Cancel'
        })
    }
  }
})

// Passing an ID that doesn't exist to attach the dialog throws an error in StoryBook
export const base = Template.bind({})
base.args = {}
