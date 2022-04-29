import { Component, Vue } from 'vue-property-decorator'
import { GetCorpInfoObject, GetCorpFullDescription, GetCorpNumberedDescription }
  from '@bcrs-shared-components/corp-type-module'

/**
 * Mixin that provides access to shared functions.
 */
@Component({})
export default class SharedMixin extends Vue {
  // from external module
  getCorpTypeInfo = GetCorpInfoObject
  getCorpTypeDescription = GetCorpFullDescription
  getCorpTypeNumberedDescription = GetCorpNumberedDescription
}
