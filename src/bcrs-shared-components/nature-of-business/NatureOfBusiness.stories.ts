import { NatureOfBusiness } from './index'

export default {
  title: 'component/NatureOfBusiness',
  component: NatureOfBusiness,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NatureOfBusiness },
  template: '<nature-of-business v-bind="$props" />' // $props comes from args below
})

// sample NAICS result
const naicsResult = {
  code: '12345',
  classTitle: 'Sample NAICS title',
  classDefinition: 'This is a sample NAICS definition.',
  naicsElements: [
    {
      elementDescription: 'a NAICS description'
    },
    {
      elementDescription: 'another NAICS description'
    }
  ]
}

// mock NAICS Services class
class NaicsServices {
  static async search (searchTerm: string): Promise<any[]> {
    return Promise.resolve([naicsResult])
  }
}

export const Default = Template.bind({})
Default.args = {
  showErrors: false,
  naics: {
    naicsCode: naicsResult.code,
    naicsDescription: naicsResult.classTitle
  },
  NaicsServices,
  editLabel: 'Edit',
  editedLabel: 'Edited'
}

export const hasChanges = Template.bind({})
hasChanges.args = {
  showErrors: false,
  naics: {
    naicsCode: naicsResult.code,
    naicsDescription: naicsResult.classTitle
  },
  NaicsServices,
  hasNaicsChanges: true,
  editLabel: 'Edit',
  editedLabel: 'Edited'
}
