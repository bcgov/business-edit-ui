<template>
  <div id="current-officers">
    <v-card flat>
      <!-- Header -->
      <article class="header-container section-container">
        <v-icon color="appDkBlue">
          mdi-account-supervisor
        </v-icon>
        <label class="font-weight-bold pl-2">Officers</label>
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
                <a
                  class="officers-change disabled-link"
                  @click.prevent
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
                </a>
              </span>
            </template>
            <span>To manage officers, submit or discard any other changes to business information.</span>
          </v-tooltip>
        </template>

        <template v-else>
          <a
            :href="officerChangeUrl"
            class="officers-change"
            @click="handleClick"
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
          </a>
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
          class="no-officers-header"
        >
          There are currently no officers. You can add officers if you are required to do so.
        </thead>
        <tbody v-if="officers.length > 0">
          <!-- List Content -->
          <tr
            v-for="(orgPerson, index) in officers"
            :key="`officer.officer.id:${index}`"
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
              <span v-if="orgPerson.roles.length > 0">
                <v-col
                  v-for="(role, key) in orgPerson.roles"
                  :key="key"
                  class="roles-detail"
                >
                  <span class="roles-detail">{{ role.roleType }}</span>
                </v-col>
              </span>
            </td>
            <!-- Delivery Address -->
            <td class="px-0">
              <template v-if="IsSame(orgPerson.mailingAddress, orgPerson.deliveryAddress, ['id'])">
                <span class="officers-detail">Same as Mailing Address</span>
              </template>
              <template v-else>
                <DeliveryAddress
                  class="officers-detail"
                  :address="orgPerson.deliveryAddress"
                />
              </template>
            </td>
            <!-- Mailing Address -->
            <td class="px-0">
              <MailingAddress
                class="officers-detail"
                :address="orgPerson.mailingAddress"
              />
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
import { CommonMixin, OrgPersonMixin } from '@/mixins/'
import { IsSame } from '@/utils/'
import { BaseAddress } from '@bcrs-shared-components/base-address'

import { useStore } from '@/store/store'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class CurrentOfficers extends Mixins(CommonMixin, OrgPersonMixin) {
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
      .filter(person => !this.wasRemoved(person))
  }

  /** URL to officer change page */
  get officerChangeUrl (): string {
    return sessionStorage.getItem('PERSON_ROLES_URL') + 'officer-change/' + this.getBusinessId
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
  .officers-change {
    margin-left: auto;
    display: flex;
    align-items: center;
    align-self: stretch;
    gap: 10px;
    text-decoration: none;
  }
  .officers-change-text {
    color: #1669BB;
    text-align: center;

    font-family: "BC Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
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

.instructional-text {
  color: $gray7;
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

.no-officers-header {
  color: var(--Text-Text-Mid-Gray, #495057);
  align-self: stretch;
  /* Paragraph regular/Paragraph regular */
  font-family: "BC Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

</style>
