<template>
  <v-card
    id="list-name-translations"
    flat
    :style="{opacity: isAddingNameTranslation ? '0.4' : '1.0'}"
  >
    <!-- List Headers -->
    <v-row
      class="name-translation-title list-item__subtitle"
      no-gutters
    >
      <v-col>
        <h3>Name Translations</h3>
      </v-col>
    </v-row>

    <!-- List Content -->
    <v-row
      v-for="(translation, index) in translationsList"
      :key="`name_translation_${index}`"
      class="names-translation-content gray-background"
      no-gutters
    >
      <v-col class="text-truncate">
        <span class="name-title text-uppercase">{{ translation.name }}</span>

        <br v-if="!!translation.action">

        <v-chip
          v-if="translation.action === ActionTypes.ADDED"
          x-small
          label
          color="primary"
          text-color="white"
        >
          <span>ADDED</span>
        </v-chip>

        <v-chip
          v-if="translation.action === ActionTypes.EDITED"
          x-small
          label
          color="primary"
          text-color="white"
        >
          <span v-if="isCorrectionFiling">CORRECTED</span>
          <span v-else>CHANGED</span>
        </v-chip>

        <v-chip
          v-if="translation.action === ActionTypes.REMOVED"
          x-small
          label
          color="grey lighten-2"
          text-color="grey darken-4"
        >
          <span>REMOVED</span>
        </v-chip>
      </v-col>

      <!-- Actions Column - Edited or Removed-->
      <v-col v-if="translation.action === ActionTypes.EDITED || translation.action === ActionTypes.REMOVED">
        <!--  -->
        <div class="actions mt-n1 float-right">
          <span class="edit-action">
            <v-btn
              text
              small
              color="primary"
              :disabled="isAddingNameTranslation"
              @click="undoTranslation(index)"
            >
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
          </span>

          <!-- more actions menu -->
          <template v-if="translation.action !== ActionTypes.REMOVED">
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn
                  text
                  small
                  color="primary"
                  class="more-actions-btn"
                  :disabled="isAddingNameTranslation"
                  v-on="on"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>

              <v-list class="more-actions-list">
                <v-list-item @click="editTranslation(index)">
                  <v-list-item-title>
                    <v-icon small>
                      mdi-pencil
                    </v-icon>
                    <span class="ml-2">Correct</span>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="removeTranslation(index)">
                  <v-list-item-title>
                    <v-icon small>
                      mdi-delete
                    </v-icon>
                    <span class="ml-2">Remove</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </div>
      </v-col>

      <!-- Actions Column - Not Edited or Removed -->
      <v-col
        v-else
        class="col-auto"
      >
        <div class="actions mt-n1 float-right">
          <span class="edit-action">
            <v-btn
              text
              small
              color="primary"
              :disabled="isAddingNameTranslation"
              @click="editTranslation(index)"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
          </span>

          <!-- more actions menu -->
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn
                text
                small
                color="primary"
                class="more-actions-btn"
                :disabled="isAddingNameTranslation"
                v-on="on"
              >
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list class="more-actions-list">
              <v-list-item @click="removeTranslation(index)">
                <v-list-item-title>
                  <v-icon small>
                    mdi-delete
                  </v-icon>
                  <span class="ml-2">Remove</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { Getter } from '@/utils/'
import { NameTranslationIF } from '@/interfaces/'
import { ActionTypes } from '@/enums/'
import { CommonMixin } from '@/mixins/'
import { useStore } from '@/store/store'

@Component({
  mixins: [CommonMixin]
})
export default class ListNameTranslation extends Vue {
  @Getter(useStore) isCorrectionFiling!: boolean

  @Prop({ default: () => [] }) readonly translationsList!: NameTranslationIF[]
  @Prop({ default: false }) readonly isAddingNameTranslation!: boolean

  // Declaration for template
  readonly ActionTypes = ActionTypes

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected editTranslation (index: number): void {}

  /**
   * Emit an index and event to the parent to handle undo.
   * @param index The active index which is subject to undo.
   */
  @Emit('undoTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected undoTranslation (index: number): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected removeTranslation (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.name-translation-title {
  background-color: $BCgovBlue5O;
  padding: 0.5rem 1.25rem;
  font-size: $px-14;
}

.names-translation-content {
  padding: 0.5rem 1.25rem;
  border-top: 1px solid $gray4;
  font-size: $px-14;

  .name-title {
    color: $gray7;
  }

  .actions {
    .edit-action {
      border-right: 1px solid $gray4;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }

    .more-actions-btn {
      padding: 0;
      min-width: 28px;
    }
  }
}

// style the more actions buttons
.v-list-item {
  min-height: 0;
  padding: 0.5rem 1rem;

  .v-list-item__title {
    color: $app-blue;
    font-size: $px-14;
  }
}

.v-icon {
      color: $app-blue !important;
    }

// move icon up a bit to line up with text
.v-icon.mdi-delete {
  margin-top: -2px;
}
</style>
