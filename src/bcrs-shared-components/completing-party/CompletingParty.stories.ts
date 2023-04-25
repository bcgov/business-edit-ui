import { CompletingParty } from './index'
import Vuetify from 'vuetify'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  title: 'component/CompletingParty',
  component: CompletingParty,
  argTypes: {
  }
}

const PersonAddressSchema = {
  streetAddress: {
    required,
    maxLength: maxLength(50)
  },
  streetAddressAdditional: {
    maxLength: maxLength(50)
  },
  addressCity: {
    required,
    maxLength: maxLength(40)
  },
  addressCountry: {
    required
  },
  addressRegion: {
    maxLength: maxLength(2)
  },
  postalCode: {
    required,
    maxLength: maxLength(15)
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

const Template = (args, { argTypes }) => ({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  props: Object.keys(argTypes),
  components: { CompletingParty },
  template: '<v-card flat ><completing-party v-bind="$props" /></v-card>'
})

export const Default = Template.bind({})
Default.args = {
  completingParty: {
    firstName: 'Cameron',
    middleName: 'D',
    lastName: 'Bowler',
    mailingAddress: {
      addressCity: 'Victoria',
      addressCountry: 'Canada',
      addressRegion: 'BC',
      deliveryInstructions: 'Test test test',
      postalCode: 'V8V 1s8',
      streetAddress: '1234',
      streetAddressAdditional: 'Test Street Additional'
    }
  },
  enableAddEdit: false,
  addressSchema: PersonAddressSchema,
  validate: false,
  invalidSection: false
}
