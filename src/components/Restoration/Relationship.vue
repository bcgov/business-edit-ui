<template>
  <v-card flat id="relationships-panel" class="pb-4 pl-4">
    <v-card flat rounded="sm" class="relationships-vcard px-4 mt-3 mr-9 ml-4">
      <v-row no-gutters class="align-center mt-5">
        <v-col cols="4">
          <SingleCheckbox v-for="(item, idx) in checkboxes"
            :item="item"
            :id="idx"
            :key="idx"
            :store-location="storeLocation"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { RelationshipTypes } from '@bcrs-shared-components/enums'
import  SingleCheckbox from '../common/Fields/SingleCheckbox.vue'

export default {
  name: 'Relationship',
  components: { SingleCheckbox },
  props: {
    storeLocation: {
      type: String,
      default: null
    },
    checkboxes: {
      type: Object,
      default () {
        return {
          'heir-legal-rep-checkbox': {
            'value': RelationshipTypes.HEIR_LEGAL_REP,
            'label': RelationshipTypes.HEIR_LEGAL_REP
          },
          'officer-checkbox': {
            'value': RelationshipTypes.OFFICER,
            'label': RelationshipTypes.OFFICER
          },
          'director-checkbox': {
            'value': RelationshipTypes.DIRECTOR,
            'label': RelationshipTypes.DIRECTOR
          },
          'shareholder-checkbox': {
            'value': RelationshipTypes.SHAREHOLDER,
            'label': RelationshipTypes.SHAREHOLDER
          },
          'court-ordered-party-checkbox': {
            'value': RelationshipTypes.COURT_ORDERED_PARTY,
            'label': RelationshipTypes.COURT_ORDERED_PARTY
          }
        }
      }
    }
  }
}
</script>
