<template>
  <div id="current-directors">

    <v-card flat>
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
        <label class="font-weight-bold pl-2">Directors</label>
      </article>

      <!-- Instructional Text -->
      <article class="instructional-text section-container">
        To change directors, please use the Change feature in the Current Directors list on your business dashboard.
      </article>

      <v-simple-table class="director-table section-container">
        <!-- List Display Section -->
        <thead v-if="getPeopleAndRoles.length > 0">
          <!-- List Headers -->
          <tr class="director-list-header pb-3">
            <th v-for="(title, index) in tableHeaders" :key="index" class="px-0">
              <span class="directors-title">{{ title }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- List Content -->
          <tr
            class="director-content py-3"
            v-for="(orgPerson, index) in getPeopleAndRoles"
            :key="`director:${index}`"
          >
            <!-- Name + Badge -->
            <td class="text-truncate px-0">
              <!-- provide tooltip to display full name if name is longer than 25 chars -->
              <v-tooltip top :disabled="formatFullName(orgPerson.officer).length < 25" color="primary">
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="director-name">{{ formatFullName(orgPerson.officer) }}</span>
                </template>
                <span class="director-name">{{ formatFullName(orgPerson.officer) }}</span>
              </v-tooltip>
            </td>

            <!-- Mailing Address -->
            <td class="px-0">
              <base-address class="director-detail" :address="orgPerson.mailingAddress" />
            </td>

            <!-- Delivery Address -->
            <td class="px-0">
              <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)"
                class="director-detail">Same as Mailing Address
              </p>
              <base-address v-else class="director-detail" :address="orgPerson.deliveryAddress"/>
            </td>

            <!-- Appointment Date -->
            <td class="px-0">
              <span class="director-detail">{{ orgPerson.appointmentDate }} to Current</span>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { OrgPersonIF } from '@/interfaces'
import { RoleTypes } from '@/enums'
import { CommonMixin } from '@/mixins'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

@Component({
  components: {
    BaseAddress
  }
})
export default class CurrentDirectors extends Mixins(CommonMixin) {
  // Declarations for template
  readonly RoleTypes = RoleTypes

  // Global getters
  @Getter getPeopleAndRoles!: OrgPersonIF[]

  /** Headers for the person table. */
  readonly tableHeaders = ['Name', 'Mailing Address', 'Delivery Address', 'Effective Dates']
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.instructional-text {
  color: $gray7;
}

.director-list-header th {
  .directors-title {
    font-size: 0.875rem;
    color: $gray9;
    font-weight: bold;
  }
}

.director-table tbody .director-content {
  td {
    font-size: 1rem;
    color: $gray9;
    font-weight: bold;
    padding-top: 1rem;
    padding-bottom: 1rem;
    vertical-align: text-top;
  }

  td:not(:first-child){
    font-size: 0.875rem;
    color: $gray7;
    font-weight: normal;
  }
}

.director-content:hover {
  background: none !important;
}

</style>
