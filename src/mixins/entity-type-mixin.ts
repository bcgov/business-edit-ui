// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
// Resources
import {
  BcAlterationResource,
  BenAlterationResource,
  CccAlterationResource,
  UlcAlterationResource
} from '@/resources/Alteration'

/**
 * Mixin that provides some useful entity type utilities.
 */
@Component({})
export default class EntityTypeMixin extends Vue {
  /**
   * Map of entity types to their corresponding resources.
   */
  private entityTypeToResourceMap = {
    [CorpTypeCd.BC_COMPANY]: BcAlterationResource,
    [CorpTypeCd.BENEFIT_COMPANY]: BenAlterationResource,
    [CorpTypeCd.BC_CCC]: CccAlterationResource,
    [CorpTypeCd.BC_ULC_COMPANY]: UlcAlterationResource
  }

  /**
   * Returns the updated article Info for the selected entity type.
   */
  articleInfo (selectedEntityType: CorpTypeCd): string {
    const resource = this.entityTypeToResourceMap[selectedEntityType]
    return resource ? resource.changeData?.articleInfo : null
  }

  /**
   * Returns the updated article title for the selected entity type.
   */
  articleTitle (selectedEntityType: CorpTypeCd): string {
    const resource = this.entityTypeToResourceMap[selectedEntityType]
    return resource ? resource.changeData?.articleTitle : null
  }
}
