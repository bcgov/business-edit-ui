<template>
  <div v-if="isAlteration()" id="business-type">
    <v-layout>
      <!-- Row Title -->
      <v-flex xs3>
        <label><strong>Business Type</strong></label>
        <v-flex md1>
          <v-chip v-if="false" x-small label color="#1669BB" text-color="white">
            Corrected
          </v-chip>
        </v-flex>
      </v-flex>

      <!-- Display Mode -->
      <v-flex xs6 v-if="!isEditingType">
        <template>
          <span>{{getEntityDesc(getEntityType)}}</span>
        </template>
      </v-flex>

      <!-- Editing Mode -->
      <v-flex xs9 v-if="isEditingType">
        <template>
          <v-select :items="entityTypeOptions"
                    v-model="getEntityType"
                    hint="Select a New Business Type"
                    persistent-hint
                    filled>
            <template slot="item" slot-scope="data">
            <span class="list-item" :class="{ 'last-select-item': data.item.value === 'FD' }">
              {{ data.item.text }}
            </span>
            </template>
          </v-select>
        </template>
      </v-flex>

      <!-- Actions -->
      <v-flex v-if="!isEditingType" xs1 class="mt-n2">
        <div class="actions mr-4">
          <v-btn
            v-if="false"
            text color="primary"
            id="btn-undo-business-type"
            @click="resetType()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
          <v-btn
            v-else
            text color="primary"
            id="btn-correct-business-type"
            @click="isEditingType = true"
          >
            <v-icon small>mdi-pencil</v-icon>
            <span>{{editLabel}}</span>
          </v-btn>
          <span class="more-actions" v-if="false">
                <v-menu
                  offset-y left nudge-bottom="4"
                  v-model="dropdown"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text small color="primary"
                      id="btn-more-actions"
                      v-on="on"
                    >
                      <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      class="v-list-item"
                      id="btn-more-actions-edit"
                      @click="isEditingType = true; dropdown = false"
                    >
                      <v-list-item-subtitle>
                        <v-icon small color="primary">mdi-pencil</v-icon>
                        <span class="drop-down-action ml-1">Change</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Mixins
import { CommonMixin } from '@/mixins'

// Enums
import { EntityTypes } from '@/enums'

@Component({
  components: {}
})
export default class CorrectBusinessType extends Mixins(CommonMixin) {
  @Getter getEntityType!: EntityTypes

  private isEditingType = false
  private entityTypeOptions = [
    {
      value: 'BEN',
      SHORT_DESC: 'BC Benefit Company',
      text: 'BC Benefit Company'
    },
    {
      value: 'CR',
      SHORT_DESC: 'BC Limited Company',
      text: 'BC Limited Company'
    }
  ]

  /** Reset company type values to original. */
  private resetType () {
    console.log('reset Type')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}
</style>
