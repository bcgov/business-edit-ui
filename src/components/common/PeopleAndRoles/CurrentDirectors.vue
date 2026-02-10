<template>
  <div id="current-directors">
    <v-card flat>
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">
          mdi-account-multiple-plus
        </v-icon>
        <label class="font-weight-bold pl-2">Directors</label>
      </article>

      <!-- Instructional Text -->
      <article class="instructional-text section-container">
        To change directors, please use the Change feature in the Current Directors list on your business dashboard.
      </article>

      <v-simple-table class="director-table section-container">
        <!-- List Display Section -->
        <thead v-if="getOrgPeople.length > 0">
          <!-- List Headers -->
          <tr class="director-list-header pb-3">
            <th
              v-for="(title, index) in tableHeaders"
              :key="index"
              class="px-0"
            >
              <span class="directors-title">{{ title }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- List Content -->
          <tr
            v-for="(orgPerson, index) in directors"
            :key="`director:${index}`"
            class="director-content py-3"
          >
            <!-- Name + Badge -->
            <td class="text-truncate px-0">
              <!-- provide tooltip to display full name if name is longer than 25 chars -->
              <v-tooltip
                top
                :disabled="formatFullName(orgPerson.officer).length < 25"
                color="primary"
              >
                <template #activator="{ on }">
                  <span
                    class="director-name"
                    v-on="on"
                  >{{ formatFullName(orgPerson.officer) }}</span>
                </template>
                <span class="director-name">{{ formatFullName(orgPerson.officer) }}</span>
              </v-tooltip>
            </td>

            <!-- Mailing Address -->
            <td class="px-0">
              <MailingAddress
                class="director-detail"
                :address="orgPerson.mailingAddress"
              />
            </td>

            <!-- Delivery Address -->
            <td class="px-0">
              <template v-if="IsSame(orgPerson.mailingAddress, orgPerson.deliveryAddress, ['id'])">
                <span class="director-detail">Same as Mailing Address</span>
              </template>
              <DeliveryAddress
                v-else
                class="director-detail"
                :address="orgPerson.deliveryAddress"
              />
            </td>

            <!-- Appointment Date -->
            <td class="px-0">
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
import { Getter } from 'pinia-class'
import { OrgPersonIF } from '@/interfaces/'
import { RoleTypes } from '@/enums/'
import { CommonMixin } from '@/mixins/'
import { IsSame } from '@/utils/'
import { BaseAddress } from '@bcrs-shared-components/base-address'

import { useStore } from '@/store/store'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class CurrentDirectors extends Mixins(CommonMixin) {
  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly IsSame = IsSame

  // Store getters
  @Getter(useStore) getOrgPeople!: OrgPersonIF[]

  /** Headers for the person table. */
  readonly tableHeaders = ['Name', 'Mailing Address', 'Delivery Address', 'Effective Dates']

  /** Strip out all but directors */
  get directors (): OrgPersonIF[] {
    return this.getOrgPeople.filter(person =>
      person.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
    )
  }
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
    font-size: $px-14;
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
    min-width: 10rem; // same as officers-content
  }

  .director-detail {
    font-size: $px-14;
    color: $gray7;
    font-weight: normal;
  }
}

.director-content:hover {
  background: none !important;
}
</style>
