import {
  AlterationResourceBc,
  AlterationResourceBen,
  AlterationResourceCc,
  AlterationResourceUlc,
  AlterationResourceCul,
  AlterationResourceC,
  AlterationResourceCben,
  AlterationResourceCcc
} from '@/resources/Alteration'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

export class ResourceUtilities {
    private static entityTypeToResourceMap = {
      [CorpTypeCd.BC_COMPANY]: AlterationResourceBc,
      [CorpTypeCd.BENEFIT_COMPANY]: AlterationResourceBen,
      [CorpTypeCd.BC_CCC]: AlterationResourceCc,
      [CorpTypeCd.BC_ULC_COMPANY]: AlterationResourceUlc,
      [CorpTypeCd.CONTINUE_IN]: AlterationResourceC,
      [CorpTypeCd.BEN_CONTINUE_IN]: AlterationResourceCben,
      [CorpTypeCd.CCC_CONTINUE_IN]: AlterationResourceCcc,
      [CorpTypeCd.ULC_CONTINUE_IN]: AlterationResourceCul
    }

    /**
      * Returns the updated article Info for the selected entity type.
      */
    static articleInfo (selectedEntityType: CorpTypeCd): string {
      const resource = ResourceUtilities.entityTypeToResourceMap[selectedEntityType]
      return resource ? resource.changeData?.articleInfo : null
    }

    /**
      * Returns the updated article title for the selected entity type.
      */
    static articleTitle (selectedEntityType: CorpTypeCd): string {
      const resource = ResourceUtilities.entityTypeToResourceMap[selectedEntityType]
      return resource ? resource.changeData?.articleTitle : null
    }
}
