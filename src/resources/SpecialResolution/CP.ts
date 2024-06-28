import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const SpecialResolutionResourceCp: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.SPECIAL_RESOLUTION,
    entityType: CorpTypeCd.COOP,
    priority: false
  },
  // Conditionally used with the filingData above for special resolution name changes.
  additionalFilingData: {
    filingTypeCode: FilingCodes.SPECIAL_RESOLUTION_NAME_CHANGE,
    entityType: CorpTypeCd.COOP,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'You cannot change the business type of a Cooperative Association. You must form a new' +
    'business and dissolve this business once the new business is registered.',
    addressChangeInfo: 'To change addresses, please use the Change feature in the' +
    ' Office Addresses list on your business dashboard.',
    nameRequestTypes: [
      NrRequestActionCodes.CHANGE_NAME
    ],
    specialResolution: {
      helpSection: {
        header: 'Help with Special Resolution',
        helpText: [
          'If you require assistance with adding a business partner please contact us.'
        ]
      },
      sampleFormSection: {
        header: 'Special Resolution (Form 06 COO)',
        text: `For your convenience, we have provided the special resolution form (Form 06 COO).  This form should be
          completed, signed and a printed copy retained with your other Cooperative Association records.
          Do not mail the paper form to BC Registries.  Once you have completed this form, enter the details
          from the paper form into this filing.`,
        label: 'Download the Special Resolution Form 06 COO',
        path: '/files/cooperative_sample_special_resolution_form_06.pdf'
      }
    }
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 200 of the Cooperative Association Act.'
}
