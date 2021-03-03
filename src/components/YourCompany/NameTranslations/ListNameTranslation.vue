<template>
  <v-card flat id="name-translations-list" :style="{opacity: isAddingNameTranslation ? '0.4' : '1.0'}">
      <!-- List Headers -->
      <v-row class="name-translation-title list-item__subtitle" no-gutters>
        <v-col>
          <h3>Name Translations</h3>
        </v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="names-translation-content"
        v-for="(translation, index) in translationList"
        :key="`name_translation_${index}`"
        no-gutters>
        <v-col class="text-truncate">
         <span class="name-title">{{translation.name}}</span>

        <br v-if="translation.action">
        <v-chip v-if="translation.action === ActionTypes.ADDED"
          x-small label color="#1669BB" text-color="white">ADDED</v-chip>
        <v-chip v-if="translation.action === ActionTypes.EDITED"
          x-small label color="#1669BB" text-color="white">CORRECTED</v-chip>
        <v-chip v-if="translation.action === ActionTypes.REMOVED"
          x-small label color="#E0E0E0" text-color="grey darken-1">REMOVED</v-chip>
        </v-col>

        <!-- Actions Column -->
        <v-col v-if="translation.action === ActionTypes.EDITED || translation.action === ActionTypes.REMOVED">
          <div class="actions">
            <span class="edit-action">
              <v-btn
                small
                text
                color="primary"
                :disabled="isAddingNameTranslation"
                @click="emitNameUndo(index)">
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
              </v-btn>
            </span>
            <!-- more actions menu -->
            <span class="actions__more" v-if="translation.action !== ActionTypes.REMOVED">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    small
                    v-on="on"
                    color="primary"
                    class="actions__more-actions__btn"
                    :disabled="isAddingNameTranslation">
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list class="actions__more-actions">
                  <v-list-item  @click="emitNameEdit(index)">
                    <v-list-item-subtitle>
                      <v-icon small>mdi-pencil</v-icon>
                      <span class="ml-1">Correct</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item  @click="emitRemoveName(index)">
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
        <v-col v-else>
          <div class="actions">
            <span class="edit-action">
              <v-btn
                small
                text
                color="primary"
                :disabled="isAddingNameTranslation"
                @click="emitNameEdit(index)">
                  <v-icon small>mdi-pencil</v-icon>
                  <span v-if="isCorrectionView()">Correct</span>
                  <span v-else>Edit</span>
              </v-btn>
            </span>
            <!-- more actions menu -->
            <span class="actions__more">
              <v-menu offset-y left nudge-bottom="4">
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    small
                    v-on="on"
                    color="primary"
                    class="actions__more-actions__btn"
                    :disabled="isAddingNameTranslation">
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list class="actions__more-actions">
                  <v-list-item  @click="emitRemoveName(index)">
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
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue, Emit, Mixins } from 'vue-property-decorator'

// Interfaces
import { NameTranslationIF } from '@/interfaces'

// Enums
import { ActionTypes } from '@/enums'

import { CommonMixin } from '@/mixins'

@Component({})
export default class ListNameTranslation extends Mixins(CommonMixin) {
  @Prop({ default: () => { return [] as [] } })
  private translationList: NameTranslationIF[]

  @Prop({ default: false })
  private isAddingNameTranslation: boolean

  private ActionTypes = ActionTypes

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editNameTranslation')
  private emitNameEdit (index: number): void {}

  /**
   * Emit an index and event to the parent to handle undo.
   * @param index The active index which is subject to undo.
   */
  @Emit('nameUndo')
  private emitNameUndo (index: number): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeNameTranslation')
  private emitRemoveName (index: number): void {}
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  #name-translations-list {
    padding-right: 0.5rem;

    .name-translation-title {
      display: flex;
      background-color: $BCgovBlue5O;
      padding: .5rem 1.25rem .5rem 1.25rem;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    .names-translation-content {
      padding: .5rem 1.25rem .5rem 1.25rem;
      border-top: 1px solid $gray1;
      font-size: 0.875rem;

      .name-title {
        color: $gray7;
      }

      .actions {
        position: absolute;
        right: 0;

        .actions__more {
          border-left: 1px solid $gray1;
        }

        .v-btn {
          min-width: .5rem;
        }

        .v-btn + .v-btn {
          margin-left: 0.5rem;
        }

        .actions__more-actions__btn {
          margin-right: 0.5rem;
        }
      }
    }
  }

  .v-list-item {
    min-height: 0;
    padding: 0 1rem 0 0.5rem;
  }
  .v-list-item__subtitle {
  color: $app-blue !important;

  .v-icon {
    color: var(--v-primary-base) !important;
  }
}
</style>
