import Vuetify from 'vuetify'
import { mount, shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BcRegEntityDetails from '@/components/Alteration/BcRegEntityDetails.vue'

const vuetify = new Vuetify({})

setActivePinia(createPinia())

describe('BC Reg Comments component', () => {
  it('renders itself', () => {
    const wrapper = mount(BcRegEntityDetails, { vuetify })

    expect(wrapper.findComponent(BcRegEntityDetails).exists()).toBe(true)

    wrapper.destroy()
  })

  it('toggles the help section when clicked', async () => {
    const wrapper = shallowMount(BcRegEntityDetails, {
      propsData: {
        confirmArticles: true,
        isBenefit: true,
        selectedEntityType: 'BC'
      }
    })

    expect(wrapper.find('.mx-8.my-7').isVisible()).toBe(false)
    await wrapper.find('.help-toggle').trigger('click')
    expect(wrapper.find('.mx-8.my-7').isVisible()).toBe(true)
  })

  const typeCommentTests: [Record<string, unknown>, string][] = [
    [{
      confirmArticles: false,
      isBenefit: true,
      selectedEntityType: 'BEN'
    }, 'Benefit Company Articles'],
    [{
      confirmArticles: false,
      isUnlimitedLiability: true,
      selectedEntityType: 'ULC'
    }, 'Unlimited Liability Company Articles'],
    [{
      confirmArticles: false,
      isCommunityContribution: true,
      selectedEntityType: 'CC'
    }, 'Community Contribution Company Articles'],
    [{
      confirmArticles: false,
      isBcLimited: true,
      selectedEntityType: 'BC'
    }, 'Limited Company Articles']
  ]
  test.each(typeCommentTests)(
    'renders the component correctly for different entity types',
    (propsData, expectedTitle) => {
      const wrapper = shallowMount(BcRegEntityDetails, { propsData })

      expect(wrapper.find('.subtitle').text()).toBe(expectedTitle)
      expect(wrapper.find('.info-text').exists()).toBe(true)
      expect(wrapper.find('#confirm-articles-checkbox').exists()).toBe(true)
    }
  )
})
