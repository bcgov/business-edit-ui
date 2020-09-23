<template>
  <div flat id="list-people-roles" class="mt-0">
    <!-- List Display Section -->
    <div id="people-roles-list" v-if="getPeopleAndRoles.length > 0">
      <!-- List Headers -->
      <v-row class="people-roles-list-header list-item__subtitle pb-3" no-gutters>
        <v-col v-for="(title, index) in tableHeaders" :key="index">
          <span>{{ title }}</span>
        </v-col>
        <!-- Spacer Column for Actions -->
        <v-col lg="1"></v-col>
      </v-row>

      <!-- List Content -->

      <!-- FUTURE: either show the item or show the edit component -->
      <!-- "if (edit_me) then ... else ..." -->
      <!-- <template v-for="(orgPerson, index) in getPeopleAndRoles">
        <v-row
          class="people-roles-content list-item__subtitle"
          :key="index"
          no-gutters
        >
          <v-col>this row is to edit {{formatName(orgPerson)}}</v-col>
        </v-row>
      </template> -->

      <v-row
        class="people-roles-content list-item__subtitle py-3"
        v-for="(orgPerson, index) in getPeopleAndRoles"
        :key="index"
        no-gutters
      >
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
          <v-chip v-if="orgPerson.action === ActionTypes.ADDED"
            x-small label color="#1669BB" text-color="white">ADDED</v-chip>
          <v-chip v-if="orgPerson.action === ActionTypes.EDITED"
            x-small label color="#1669BB" text-color="white">CORRECTED</v-chip>
          <v-chip v-if="orgPerson.action === ActionTypes.REMOVED"
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
            <v-icon color="$BCgovGold9" small>mdi-alert</v-icon>
            <span class="warning-text">Add Role</span>
          </div>
        </v-col>

        <!-- Actions Buttons -->
        <v-col lg="1">
          <div v-if="orgPerson.action" class="actions">
            <span class="undo-action mr-4">
              <v-btn
                text small color="primary"
                :id="'officer-' + orgPerson.officer.id + '-undo-btn'"
                @click="emitUndoOrgPerson(index)"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
            </span>
          </div>

          <div v-else class="actions">
            <span class="edit-action">
              <v-btn
                text small color="primary"
                :id="'officer-' + orgPerson.officer.id + '-edit-btn'"
                @click="emitEditPerson(index)"
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
                    @click="emitRemoveOrgPerson(index)"
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
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { CommonMixin } from '@/mixins'
import { OrgPersonIF } from '@/interfaces'
import { ActionTypes } from '@/enums'

@Component({
  components: {
    BaseAddress
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin) {
  // Enum for template
  readonly ActionTypes = ActionTypes

  // Getter
  @Getter getPeopleAndRoles!: Array<OrgPersonIF>

  /** Headers for the person table. */
  readonly tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']

  /**
   * Formats the org or person name for display.
   * @param filing The filing body which contains the name/title.
   * @returns The formatted org/person name.
   */
  private formatName (filing: any): string {
    return filing?.officer?.orgName ? filing?.officer?.orgName
      : `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
  }

  /**
   * Emits an event and index to the parent to handle undoing.
   * @param index The index of the org/person to undo.
   */
  @Emit('undoOrgPerson')
  private emitUndoOrgPerson (index: number): void {}

  /**
   * Emits an event and index to the parent to handle editing.
   * @param index The index of the org/person to edit.
   */
  @Emit('editOrgPerson')
  private emitEditPerson (index: number): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index The index of the org/person to remove.
   */
  @Emit('removeOrgPerson')
  private emitRemoveOrgPerson (index: number): void {}
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
  color: $BCgovGold9
}
</style>
