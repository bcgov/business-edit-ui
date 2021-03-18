<template>
  <div id="current-directors">

    <v-card flat>
      <!-- Header -->
      <div class="header-container">
        <v-icon color="app-dk-blue">mdi-account-multiple-plus</v-icon>
        <label class="font-weight-bold pl-2">Directors</label>
      </div>

      <!-- Instructional Text -->
      <div class="instructional-text pt-10 px-4">
        To change directors, please use the Change feature in the Current Directors list on your business dashboard.
      </div>

      <v-simple-table class="director-table pt-15">
        <!-- List Display Section -->
        <thead v-if="currentDirectors.length > 0">
          <!-- List Headers -->
          <tr class="director-list-header pb-3">
            <th v-for="(title, index) in tableHeaders" :key="index">
              <span class="directors-title">{{ title }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- List Content -->
          <tr
            class="director-content py-3"
            v-for="(orgPerson, index) in currentDirectors"
            :key="`director:${index}`"
          >
            <!-- Name + Badge -->
            <td class="text-truncate">
              <!-- provide tooltip to display full name if name is longer than 25 chars -->
              <v-tooltip top :disabled="formatFullName(orgPerson.officer).length < 25" color="primary">
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="director-name">{{ formatFullName(orgPerson.officer) }}</span>
                </template>
                <span class="director-name">{{ formatFullName(orgPerson.officer) }}</span>
              </v-tooltip>
            </td>

            <!-- Mailing Address -->
            <td class="pr-5">
              <base-address class="director-detail" :address="orgPerson.mailingAddress" />
            </td>

            <!-- Delivery Address -->
            <td class="pr-5">
              <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)"
                class="director-detail">Same as Mailing Address
              </p>
              <base-address v-else class="director-detail" :address="orgPerson.deliveryAddress"/>
            </td>

            <!-- Appoinment Date -->
            <td class="pr-5">
              <span class="director-detail">{{ orgPerson.roles[0].appointmentDate }} to Current</span>
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

  /**
   * Returns the current directors from the people and roles.
   * @returns array of directors
   */
  private get currentDirectors () : OrgPersonIF[] {
    const directors = this.getPeopleAndRoles
      .filter(people => people.roles.some(role =>
        role.roleType === RoleTypes.DIRECTOR && !role.cessationDate))
    for (const director of directors) {
      director.roles = director.roles.filter(role => role.roleType === RoleTypes.DIRECTOR)
    }
    return directors
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.instructional-text {
  color: $gray7;
}

.director-list-header th {
  border-bottom: thin solid rgba(0, 0, 0, 0.12)!important;

  .directors-title {
    font-size: 0.875rem;
    color: $gray9;
    font-weight: bold;
  }
}

.director-table tbody .director-content {
  td {
    border-bottom: thin solid rgba(0, 0, 0, 0.12)!important;
    font-size: 1rem;
    color: $gray9;
    font-weight: bold;
    padding-top: 1rem;
    padding-bottom: 1rem;
    vertical-align: text-top;
  }

  td:not(:first-child){
    border-top: 1px solid $gray1;
    font-size: 0.875rem;
    color: $gray7;
    font-weight: normal;
  }
}

</style>
