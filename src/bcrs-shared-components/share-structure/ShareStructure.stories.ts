import Vuetify from 'vuetify'
import { ShareStructure } from './index'

export default {
  title: 'component/ShareStructure',
  component: ShareStructure,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  props: Object.keys(argTypes),
  components: { ShareStructure },
  template: '<share-structure v-bind="$props" />' // $props comes from args below
})

const IA = {
  'business': {
    'identifier': 'BC1230105',
    'legalType': 'BEN'
  },
  'header': {
    'certifiedBy': 'Cameron',
    'date': '2021-03-04T16:59:54.905823+00:00',
    'effectiveDate': '2021-03-04T16:59:54.905880+00:00',
    'filingId': 111645,
    'isFutureEffective': false,
    'name': 'incorporationApplication',
    'status': 'COMPLETED'
  },
  'incorporationApplication': {
    'contactPoint': {
      'email': 'cameron@freshworks.io',
      'extension': '',
      'phone': '(123) 456-7890'
    },
    'incorporationAgreement': {
      'agreementType': 'sample'
    },
    'nameRequest': {
      'legalType': 'BEN'
    },
    'nameTranslations': [],
    'offices': {},
    'parties': [],
    'shareStructure': {
      'shareClasses': [
        {
          'currency': 'CAD',
          'hasMaximumShares': true,
          'hasParValue': true,
          'hasRightsOrRestrictions': true,
          'id': '434416',
          'maxNumberOfShares': 100,
          'name': 'Class A Shares',
          'parValue': 1,
          'priority': 1,
          'series': [
            {
              'hasMaximumShares': true,
              'hasRightsOrRestrictions': false,
              'id': '434265',
              'maxNumberOfShares': 10,
              'name': 'Series 1A Shares',
              'priority': 1,
              'type': 'Series'
            },
            {
              'hasMaximumShares': true,
              'hasRightsOrRestrictions': false,
              'id': '434266',
              'maxNumberOfShares': 2,
              'name': 'Series 2 Shares',
              'priority': 2,
              'type': 'Series'
            }
          ],
          'type': 'Class'
        },
        {
          'currency': 'CAD',
          'hasMaximumShares': true,
          'hasParValue': true,
          'hasRightsOrRestrictions': true,
          'id': '434417',
          'maxNumberOfShares': 122,
          'name': 'Class B Shares',
          'parValue': 2,
          'priority': 2,
          'series': [
            {
              'hasMaximumShares': true,
              'hasRightsOrRestrictions': false,
              'id': '434267',
              'maxNumberOfShares': 22,
              'name': 'Series b1 Shares',
              'priority': 1,
              'type': 'Series'
            }
          ],
          'type': 'Class'
        }
      ]
    }
  }
}

const businessSnapshot = [
  {
    'business': {}
  },
  {
    'aliases': []
  },
  {
    'recordsOffice': {},
    'registeredOffice': {}
  },
  {
    'directors': []
  },
  {
    'shareClasses': [
      {
        'currency': 'CAD',
        'hasMaximumShares': true,
        'hasParValue': true,
        'hasRightsOrRestrictions': true,
        'id': 434416,
        'maxNumberOfShares': 100,
        'name': 'Class A Shares',
        'parValue': 1,
        'priority': 1,
        'series': [
          {
            'hasMaximumShares': true,
            'hasRightsOrRestrictions': false,
            'id': 434265,
            'maxNumberOfShares': 10,
            'name': 'Series 1A Shares',
            'priority': 1,
            'type': 'Series'
          },
          {
            'hasMaximumShares': true,
            'hasRightsOrRestrictions': false,
            'id': 434266,
            'maxNumberOfShares': 2,
            'name': 'Series 2 Shares',
            'priority': 2,
            'type': 'Series'
          }
        ],
        'type': 'Class'
      },
      {
        'currency': 'CAD',
        'hasMaximumShares': true,
        'hasParValue': true,
        'hasRightsOrRestrictions': true,
        'id': 434417,
        'maxNumberOfShares': 122,
        'name': 'Class B Shares',
        'parValue': 2,
        'priority': 2,
        'series': [
          {
            'hasMaximumShares': true,
            'hasRightsOrRestrictions': false,
            'id': 434267,
            'maxNumberOfShares': 22,
            'name': 'Series b1 Shares',
            'priority': 1,
            'type': 'Series'
          }
        ],
        'type': 'Class'
      }
    ]
  },
  {}
]

export const correction = Template.bind({})
correction.args = {
  isEditMode: true,
  editLabel: 'Correct',
  editedLabel: 'CORRECTED',
  isCorrection: true,
  incorporationApplication: IA,
  businessSnapshot: businessSnapshot,
  shareClasses: IA.incorporationApplication.shareStructure.shareClasses,
  resolutionRequired: false
}

export const alteration = Template.bind({})
alteration.args = {
  isEditMode: true,
  editLabel: 'Change',
  editedLabel: 'CHANGED',
  isCorrection: true,
  incorporationApplication: IA,
  businessSnapshot: businessSnapshot,
  shareClasses: businessSnapshot[4].shareClasses,
  resolutionRequired: true
}
