import { BusinessLookup } from './index'

export default {
  title: 'component/BusinessLookup',
  component: BusinessLookup,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BusinessLookup },
  template: '<business-lookup v-bind="$props" />' // $props comes from args below
})

// sample Business Lookup result
const result = {
  identifier: 'BC1234567',
  name: 'Test Business Name'
}

// mock Business Lookup Services class
class BusinessLookupServices {
  static async search (query: string): Promise<any[]> {
    return Promise.resolve([result])
  }
}

export const Default = Template.bind({})
Default.args = {
  showErrors: false,
  businessLookup: {
    identifier: result.identifier,
    name: result.name
  },
  BusinessLookupServices,
  hasBusinessLookupChanges: true
}
