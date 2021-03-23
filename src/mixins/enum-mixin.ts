import { Component, Vue } from 'vue-property-decorator'
import { GetCorpInfoObject, GetCorpFullDescription, GetCorpNumberedDescription }
  from '@bcrs-shared-components/corp-type-module'

/**
 * Mixin that provides some useful enum-related utilities.
 */
@Component({})
export default class EnumMixin extends Vue {
  // from external module
  getCorpTypeInfo = GetCorpInfoObject
  getCorpTypeDescription = GetCorpFullDescription
  getCorpTypeNumberedDescription = GetCorpNumberedDescription
}
