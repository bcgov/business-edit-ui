import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// Define a map of entity types to titles and info strings
export const entityTypeInfo = {
  [CorpTypeCd.BENEFIT_COMPANY]: {
    title: 'Benefit Company Articles',
    info: `The company has completed a set Benefit Company Articles containing a benefit provision, 
      and a copy of these articles has been added to the company's record book.`
  },
  [CorpTypeCd.BC_ULC_COMPANY]: {
    title: 'Unlimited Liability Company Articles',
    info: `The company has completed a set of Unlimited Liability Company Articles containing a liability
      provision, and a copy of these articles has been added to company's record book.`
  },
  [CorpTypeCd.BC_CCC]: {
    title: 'Community Contribution Company Articles',
    info: `The company has completed a set of Community Contribution Company Articles
      containing a community provision, and a copy of these articles has been added to company's record book.`
  },
  [CorpTypeCd.BC_COMPANY]: {
    title: 'Limited Company Articles',
    info: `The company has completed a set of BC LTD Company Articles, and a copy of these articles has been
      added to company's record book.`
  }
}
