<template>
  <div flat id="list-people-roles" class="mt-0">
    <!-- conditionally render add component -->
    <div id="people-roles-add" v-if="renderOrgPersonForm && isNaN(activeIndex)">
      <v-divider class="px-4" />
      <org-person
        :currentOrgPerson="currentOrgPerson"
        :activeIndex="activeIndex"
        :nextId="nextId"
        :currentCompletingParty="currentCompletingParty"
        @addEdit="emitAddEdit($event)"
        @remove="emitRemove($event)"
        @reset="emitReset()"
        @removeCompletingPartyRole="emitRemoveCompletingPartyRole()"
      />
      <v-divider class="px-4 mt-2 mb-4" />
    </div>

    <!-- List Display Section -->
    <div id="people-roles-list" v-if="peopleAndRoles.length > 0">
      <!-- List Headers -->
      <v-row class="people-roles-list-header list-item__subtitle pb-3" no-gutters>
        <v-col v-for="(title, index) in tableHeaders" :key="index">
          <span>{{ title }}</span>
        </v-col>
        <!-- Spacer Column for Actions -->
        <v-col lg="1"></v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="people-roles-content list-item__subtitle py-3"
        v-for="(orgPerson, index) in peopleAndRoles"
        :key="index"
        no-gutters
      >
        <!-- conditionally render edit component instead of table row -->
        <div id="people-roles-edit" v-if="renderOrgPersonForm && orgPerson.officer.id === activeIndex">
          <org-person
            :currentOrgPerson="currentOrgPerson"
            :activeIndex="activeIndex"
            :nextId="nextId"
            :currentCompletingParty="currentCompletingParty"
            @addEdit="emitAddEdit($event)"
            @remove="emitRemove($event)"
            @reset="emitReset()"
            @removeCompletingPartyRole="emitRemoveCompletingPartyRole()"
          />
        </div>

        <template v-else>
          <!-- Name + Badge -->
          <v-col class="text-truncate">
            <!-- provide tooltip to display full name if name is longer than 25 chars -->
            <v-tooltip top :disabled="formatName(orgPerson).length < 25" color="primary">
              <template v-slot:activator="{ on }">
                <span v-on="on" class="people-roles-title">{{ formatName(orgPerson) }}</span>
              </template>
              <span>{{ formatName(orgPerson) }}</span>
            </v-tooltip>

            <br v-if="orgPerson.action">
            <v-chip v-if="wasAdded(orgPerson)"
              x-small label color="#1669BB" text-color="white">ADDED</v-chip>
            <v-chip v-if="wasEdited(orgPerson)"
              x-small label color="#1669BB" text-color="white">CORRECTED</v-chip>
            <v-chip v-if="wasRemoved(orgPerson)"
              x-small label color="#E0E0E0" text-color="grey darken-1">REMOVED</v-chip>
          </v-col>

          <!-- Mailing Address -->
          <v-col>
            <base-address class="peoples-roles-mailing-address" :address="orgPerson.mailingAddress" />
          </v-col>

          <!-- Delivery Address (for directors only) -->
          <v-col>
            <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)"
              class="peoples-roles-delivery-address">Same as Mailing Address
            </p>
            <base-address v-else class="peoples-roles-delivery-address" :address="orgPerson.deliveryAddress"/>
          </v-col>

          <!-- Roles -->
          <v-col>
            <!-- Warning if orgPerson has no roles -->
            <div v-if="orgPerson.roles.length > 0">
              <v-col v-for="(role, index) in orgPerson.roles" :key="index" class="col-roles">
                <span>{{ role.roleType }}</span>
              </v-col>
            </div>
            <div v-else>
              <v-icon color="red darken-3" small>mdi-alert</v-icon>
              <span class="warning-text">Missing Role</span>
            </div>
          </v-col>

          <!-- Actions Buttons -->
          <v-col lg="1">
            <div v-if="orgPerson.action" class="actions">
              <span class="undo-action mr-4">
                <v-btn
                  text color="primary"
                  :id="'officer-' + orgPerson.officer.id + '-undo-btn'"
                  @click="emitUndo(index)"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>
            </div>

            <div v-else class="actions">
              <span class="edit-action">
                <v-btn
                  text color="primary"
                  :id="'officer-' + orgPerson.officer.id + '-edit-btn'"
                  @click="emitInitEdit(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Correct</span>
                </v-btn>
              </span>

              <!-- More Actions Menu -->
              <span class="more-actions mr-4">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text small color="primary"
                      class="more-actions-btn"
                      v-on="on"
                    >
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      class="actions-dropdown_item"
                      :id="'officer-' + orgPerson.officer.id + '-remove-btn'"
                      @click="emitRemove(index)"
                    >
                      <v-list-item-subtitle>
                        <v-icon small>mdi-delete</v-icon>
                        <span class="ml-1">Remove</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </v-col>
        </template>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Emit } from 'vue-property-decorator'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { OrgPerson } from '.'
import { CommonMixin } from '@/mixins'
import { OrgPersonIF } from '@/interfaces'
import { ActionTypes } from '@/enums'

@Component({
  components: {
    BaseAddress,
    OrgPerson
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin) {
  // Declaration for template
  readonly ActionTypes = ActionTypes

  /** The current orgs/people list. */
  @Prop({ default: () => [] }) private peopleAndRoles!: Array<OrgPersonIF>

  /** Whether to render the OrgPersonForm (for edit or add). */
  @Prop() private renderOrgPersonForm: boolean

  /** The current org/person to edit or add. */
  @Prop() private currentOrgPerson: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() private activeIndex: number

  /** The next ID to assign to an officer being added. */
  @Prop() private nextId: number

  /** The current completing party (or undefined). */
  @Prop() private currentCompletingParty: OrgPersonIF

  /** Headers for the person table. */
  readonly tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']

  /**
   * Checks if specified org/person was added.
   * @param person The org/person to check.
   * @returns True if the org/person was added.
   */
  private wasAdded (person: OrgPersonIF): boolean {
    return (person.action === ActionTypes.ADDED)
  }

  /**
   * Checks if specified org/person was edited.
   * @param person The org/person to check.
   * @returns True if the org/person was edited.
   */
  private wasEdited (person: OrgPersonIF): boolean {
    return (person.action === ActionTypes.EDITED)
  }

  /**
   * Checks if specified org/person was removed.
   * @param person The org/person to check.
   * @returns True if the org/person was removed.
   */
  private wasRemoved (person: OrgPersonIF): boolean {
    return (person.action === ActionTypes.REMOVED)
  }

  /**
   * Formats the org or person name for display.
   * @param filing The filing body which contains the name/title.
   * @returns The formatted org/person name.
   */
  private formatName (filing: any): string {
    if (filing?.officer?.orgName) {
      return filing.officer.orgName
    }
    if (filing?.officer) {
      return `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
    }
    return ''
  }

  /**
   * Emits an event and index to the parent to handle undoing.
   * @param index the index of the org/person to undo
   */
  @Emit('undo')
  private emitUndo (index: number): void {}

  /**
   * Emits an event and index to the parent to start editing.
   * @param index the index of the org/person to edit
   */
  @Emit('initEdit')
  private emitInitEdit (index: number): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index the index of the org/person to remove
   */
  @Emit('remove')
  private emitRemove (index: number): void {}

  /**
   * Emits an event and org/person object to the parent handle adding or editing.
   * @param person the data object of the org/person to add or edit
   */
  @Emit('addEdit')
  private emitAddEdit (person: OrgPersonIF): void {}

  /**
   * Emits an event and index to the parent to reset the state.
   */
  @Emit('reset')
  private emitReset (): void {}

  /**
   * Emits an event and index to the parent to remove the Completing Party role.
   */
  @Emit('removeCompletingPartyRole')
  private emitRemoveCompletingPartyRole (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#list-people-roles {
  margin-top: 1rem;
}

.people-roles-invalid-message {
  padding: 1.25rem;
  font-weight: bold;
  color: $BCgovABlue2;
}

.people-roles-list-header {
  // NB: same styles as v-data-table header
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
  font-weight: 700;
}

.people-roles-content {
  border-top: 1px solid $gray1;
  font-size: 0.875rem;

  .people-roles-title {
    color: $gray7;
    font-weight: 700;
  }

  .actions {
    position: absolute;
    right: 0;

    .edit-action {
      border-right: 1px solid $gray1;
    }

    .v-btn {
      min-width: 0.5rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.v-list-item {
  min-height: 0;
  padding: 0 1rem 0 0.5rem;
}

.col {
  padding: 0.25rem;

  .col-roles {
    padding: 0!important;
  }
}

.warning-text {
  position: relative;
  top: 2px;
  left: 2px;
  color: $BCgovInputError;
}
</style>
