import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import ListNameTranslation from '@/components/common/YourCompany/NameTranslations/ListNameTranslation.vue'
import flushPromises from 'flush-promises'
import { NameTranslationIF } from '@/interfaces/store-interfaces/state-interfaces/name-translation-interface'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

function resetStore (): void {
  store.state.stateModel.nameTranslations = []
}

// Local references
const nameTranslationsUi = '#name-translations-list'
const nameTranslationsList: NameTranslationIF[] = [
  { name: 'First mock name translation ltd.' },
  { name: 'Second mock name translation inc' },
  { name: 'Third mock name translation ltd.' },
  { name: 'Quatrième nom simulé' }
]

describe('List Name Translation component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    // Init Store
    store.state.stateModel.nameTranslations = []

    wrapperFactory = (propsData: any) => {
      return mount(ListNameTranslation, {
        localVue,
        router,
        store,
        vuetify,
        propsData: { ...propsData }
      })
    }
  })

  it('displays the list of name translations and action btns', async () => {
    const wrapper = wrapperFactory({ translationList: nameTranslationsList })
    await flushPromises()

    // Verify list exists
    expect(wrapper.find(nameTranslationsUi).exists()).toBeTruthy()

    // Verify list title
    expect(wrapper.find('.name-translation-title').text()).toContain('Name Translations')

    // Verify list items
    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    // Verify edit btn and default state
    expect(wrapper.find('.edit-action .v-btn').exists()).toBeTruthy()
    expect(wrapper.find('.edit-action .v-btn').attributes('disabled')).toBeUndefined()

    // Verify more actions drop down
    expect(wrapper.find('.actions__more-actions__btn').exists()).toBeTruthy()
    await wrapper.find('.actions__more-actions__btn').trigger('click')

    // Verify 'Remove' btn
    expect(wrapper.find('.actions__more-actions').exists()).toBeTruthy()

    wrapper.destroy()
  })

  it('disables the edit and drop down btns when editing a name translation', async () => {
    const wrapper = wrapperFactory({ translationList: nameTranslationsList, isAddingNameTranslation: true })
    await Vue.nextTick()

    // Verify edit btn and default state
    expect(wrapper.find('.edit-action .v-btn').exists()).toBeTruthy()
    expect(wrapper.find('.edit-action .v-btn').attributes('disabled')).toBeTruthy()

    // Verify more actions drop down
    expect(wrapper.find('.actions__more-actions__btn').exists()).toBeTruthy()
    expect(wrapper.find('.actions__more-actions__btn').attributes('disabled')).toBeTruthy()
    await wrapper.find('.actions__more-actions__btn').trigger('click')

    // Verify 'Remove' btn
    expect(wrapper.find('.actions__more-actions').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('emits the correct name index when selected for edit', async () => {
    const wrapper = wrapperFactory({ translationList: nameTranslationsList })
    await Vue.nextTick()

    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    const editBtns = wrapper.findAll('.edit-action .v-btn')

    // Select the first name to edit
    await editBtns.at(0).trigger('click')
    expect(wrapper.emitted('editNameTranslation').pop()).toEqual([0])

    // Select the third name to edit
    await editBtns.at(2).trigger('click')
    expect(wrapper.emitted('editNameTranslation').pop()).toEqual([2])

    wrapper.destroy()
  })

  it('emits the correct name index when selected for removal', async () => {
    const wrapper = wrapperFactory({ translationList: nameTranslationsList })
    await Vue.nextTick()

    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    // Open the first list item dropdown
    const actionsDropdown = wrapper.findAll('.actions__more-actions__btn')
    await actionsDropdown.at(0).trigger('click')

    // Select the first item for removal
    const removeBtns = wrapper.findAll('.actions__more-actions .v-list-item')
    expect(removeBtns.at(0).exists()).toBeTruthy()
    expect(removeBtns.at(0).attributes('disabled')).toBeUndefined()
    await removeBtns.at(0).trigger('click')

    expect(wrapper.emitted('removeNameTranslation').pop()).toEqual([0])

    wrapper.destroy()
  })
})
