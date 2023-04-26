import { FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const CccRestorationResource: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BC_CCC),
  addressLabel: 'Registered Office',
  showEmailUnderName: false,
  userEmailOptional: false,
  userEmailLabel: 'Applicant',
  filingData: {
    entityType: CorpTypeCd.BC_CCC,
    filingTypeCode: FilingCodes.RESTORATION_LTD_EXTEND,
    priority: false
  },
  changeData: {
    orgPersonInfo: {
      orgPersonLabel: 'Applicant',
      orgTypesLabel: 'Business or Corporation',
      subtitle: null // not used
    },
    nameChangeOptions: []
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under the BC Corporations Act. ' +
    'A person who commits this offence is subject to a maximum fine of $5000.',
  certifyText: 'BC Corporations Act'
}
