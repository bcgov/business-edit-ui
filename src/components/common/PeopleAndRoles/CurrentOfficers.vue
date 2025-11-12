<template>
  <div id="current-officers">
    <v-card flat>
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">
          mdi-account-supervisor
        </v-icon>
        <label class="font-weight-bold pl-2">Officers</label>
        <span
          v-if="officers.length <= 0"
          class="officer-optional-text"
        >
          (Optional)
        </span>

        <template v-if="disableLinks">
          <v-tooltip
            top
            color="TextMidGray"
            content-class="top-tooltip"
          >
            <template #activator="{ on, attrs }">
              <span
                class="officers-change-wrapper"
                v-bind="attrs"
                v-on="on"
              >
                <v-btn
                  class="officers-change disabled-link"
                  text
                >
                  <v-icon
                    medium
                    class="add-officer-icon"
                    color="appDkBlue"
                    v-text="officers.length > 0 ? 'mdi-pencil-outline' : 'mdi-account-plus-outline'"
                  />
                  <span
                    v-if="officers.length > 0"
                    class="officer-change-text"
                  >
                    Manage Officers
                  </span>
                  <span
                    v-else
                    class="officer-change-text"
                  >
                    Add Officers
                  </span>
                </v-btn>
              </span>
            </template>
            <span>To manage officers, submit or discard any other changes to business information.</span>
          </v-tooltip>
        </template>

        <template v-else>
          <v-btn
            text
            class="officers-change"
            color="primary"
            @click="navigateToOfficerChange"
          >
            <v-icon
              medium
              class="add-officer-icon"
              v-text="officers.length > 0 ? 'mdi-pencil-outline' : 'mdi-account-plus-outline'"
            />
            <span
              v-if="officers.length > 0"
              class="officer-change-text"
            >
              Manage Officers
            </span>
            <span
              v-else
              class="officer-change-text"
            >
              Add Officers
            </span>
          </v-btn>
        </template>
      </article>

      <v-simple-table class="officers-table section-container">
        <!-- List Display Section -->
        <thead v-if="officers.length > 0">
          <!-- List Headers -->
          <tr class="officers-list-header pb-3">
            <th
              v-for="(title, index) in tableHeaders"
              :key="index"
              class="px-0"
            >
              <span class="officers-title">{{ title }}</span>
            </th>
          </tr>
        </thead>
        <thead
          v-else
          class="info-text"
        >
          There are currently no officers.
        </thead>
        <tbody v-if="officers.length > 0">
          <!-- List Content -->
          <tr
            v-for="(orgPerson) in officers"
            :key="orgPerson.officer?.id"
            class="officers-content py-3"
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
                    class="officers-name"
                    v-on="on"
                  >{{ formatFullName(orgPerson.officer) }}</span>
                </template>
                <span class="officers-name">{{ formatFullName(orgPerson.officer) }}</span>
              </v-tooltip>
            </td>
            <!-- Roles -->
            <td class="px-0">
              <v-col
                v-for="(role, key) in orgPerson.roles"
                :key="key"
                class="roles-detail"
              >
                <span class="roles-detail">{{ formatRoleType(role.roleType) }}</span>
              </v-col>
            </td>
            <!-- Delivery Address -->
            <td class="px-0">
              <DeliveryAddress
                class="officers-detail"
                :address="orgPerson.deliveryAddress"
              />
            </td>
            <!-- Mailing Address -->
            <td class="px-0">
              <template v-if="IsSame(orgPerson.mailingAddress, orgPerson.deliveryAddress, ['id'])">
                <span class="officers-detail">Same as Delivery Address</span>
              </template>
              <template v-else>
                <MailingAddress
                  class="officers-detail"
                  :address="orgPerson.mailingAddress"
                />
              </template>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { OrgPersonIF } from '@/interfaces/'
import { RoleClass, RoleTypes } from '@/enums/'
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
export default class CurrentOfficers extends Mixins(CommonMixin) {
  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly IsSame = IsSame

  // Store getters
  @Getter(useStore) getOrgPeople!: OrgPersonIF[]
  @Getter(useStore) getBusinessId!: string
  @Prop({ type: Boolean, default: false }) readonly disableLinks!: boolean;

  /** Headers for the person table. */
  readonly tableHeaders = ['Name', 'Roles', 'Delivery Address', 'Mailing Address']

  /** Gather all officers with appropriate roles */
  get officers (): OrgPersonIF[] {
    return this.getOrgPeople
      .filter(person =>
        person.roles?.some(role =>
          role?.roleClass === RoleClass.OFFICER
        )
      )
  }

  /** URL to officer change page */
  get officerChangeUrl (): string {
    return sessionStorage.getItem('PERSON_ROLES_URL') + 'officer-change/' + this.getBusinessId
  }

  navigateToOfficerChange () {
    if (!this.disableLinks) {
      window.location.href = this.officerChangeUrl
    }
  }

  handleClick (event: MouseEvent) {
    if (this.disableLinks) {
      event.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  align-items: center;
  background-color: $BCgovBlue5O;
  .officer-optional-text {
    color: $gray7;
    margin-left: 10px;
  }
  .officers-change {
    margin-left: auto;
    display: flex;
    align-items: center;
    align-self: stretch;
    gap: 10px;
    text-decoration: none;
  }

  /* To keep link on right when wrapped in tooltip */
  .officers-change-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  .add-officer-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .officer-change-text {
    font-size: $px-16;
  }
  .disabled-link {
    pointer-events: none;
    opacity: 0.5;
    cursor: default;
  }
}

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.officers-list-header th {
  .officers-title {
    font-size: $px-14;
    color: $gray9;
    font-weight: bold;
  }
}

.officers-table tbody .officers-content {
  td {
    font-size: 1rem;
    color: $gray9;
    font-weight: bold;
    padding-top: 1rem;
    padding-bottom: 1rem;
    vertical-align: text-top;
  }

  .officers-detail {
    font-size: $px-14;
    color: $gray7;
    font-weight: normal;
  }
  .roles-detail {
    font-size: $px-14;
    color: $gray7;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    font-weight: normal;
  }
}

.officers-content:hover {
  background: none !important;
}

</style>
