<template>
  <div id="folio-number">
    <!-- Display Folio Number -->
    <v-row v-if="!isEditing" id="display-folio-number" no-gutters>
      <v-col cols="3">
        <label>
          <strong>Business Folio or<br>Reference Number</strong>
          <v-chip v-if="hasFolioNumberChanged" x-small label color="primary" text-color="white">
            {{editedLabel}}
          </v-chip>
        </label>
      </v-col>

      <v-col :cols="hideActions ? '9' : '7'">
        <div id="folio-number-readonly">{{ !!folioNumber ? folioNumber : 'None' }}</div>
      </v-col>

      <!-- Edit Actions -->
      <v-col cols="2" class="mt-n2" v-if="!hideActions">
        <div class="edit-actions mr-4">
          <v-btn
            v-if="hasFolioNumberChanged"
            text color="primary"
            class="undo-button"
            @click="onUndoClicked()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>

          <v-tooltip
            v-else
            top nudge-right="3"
            content-class="top-tooltip"
            transition="fade-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                text color="primary"
                class="edit-button"
                @click="isEditing = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>{{editLabel}}</span>
              </v-btn>
            </template>
            <span>No fee to change</span>
          </v-tooltip>

          <!-- Drop Down Actions -->
          <span class="drop-down-actions" v-if="hasFolioNumberChanged">
            <v-menu
              offset-y left nudge-bottom="4"
              v-model="dropdown"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text small color="primary"
                  class="more-button"
                  v-on="on"
                >
                  <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  class="v-list-item change-button"
                  @click="isEditing = true; dropdown = false"
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
      </v-col>
    </v-row>

    <!-- Edit Folio Number -->
    <v-form v-else id="edit-folio-number" v-model="formValid" @submit.prevent="onFormSubmit()">
      <!-- Line 1 -->
      <v-row no-gutters>
        <v-col cols="3">
          <label :class="{'error-text': invalidSection}">
            <strong>Business Folio or<br>Reference Number</strong>
          </label>
        </v-col>
        <v-col cols="9" />
      </v-row>

      <!-- Line 2 -->
      <v-row no-gutters>
        <v-col cols="3" />
        <v-col cols="9" class="my-4">
          <p>This is the Folio or Reference Number for this business for your own tracking purposes.
            There is no fee to change this number. Any changes made will be applied immediately.</p>
        </v-col>
      </v-row>

      <!-- Line 3 -->
      <v-row no-gutters>
        <v-col cols="3" />
        <v-col cols="9">
            <v-text-field
              filled persistent-hint
              id="folio-number-input"
              autocomplete="chrome-off"
              label="Folio or Reference Number (Optional)"
              v-model="folioNumber"
              :name="Math.random()"
              :rules="rules"
            />
        </v-col>
      </v-row>

      <!-- Form Actions -->
      <v-row no-gutters>
        <v-col>
          <div class="form-actions">
            <v-btn
              large color="primary"
              class="save-button"
              type="submit"
              value="Submit"
            >
              <span>Save</span>
            </v-btn>
            <v-btn
              large outlined color="primary"
              class="cancel-button"
              @click="onCancelClicked()"
            >
              <span>Cancel</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class FolioNumber extends Vue {
  // Props
  @Prop({ default: null }) readonly initialValue: string
  @Prop({ default: null }) readonly originalValue: string
  @Prop({ default: false }) readonly hideActions: boolean
  @Prop() readonly editLabel: string
  @Prop() readonly editedLabel!: string
  @Prop({ default: false }) readonly invalidSection!: boolean

  // Local properties
  private isEditing = false
  private formValid = false
  private folioNumber = ''
  private dropdown = false

  // Validation rules
  private readonly rules: Array<Function> = [
    (v: string) => (!v || v.length <= 30) || 'Maximum 30 characters reached'
  ]

  /** Whether folio number has changed from original value. */
  private get hasFolioNumberChanged (): boolean {
    const fn = this.folioNumber || null
    const ov = this.originalValue || null
    return (fn !== ov)
  }

  /** When Undo is clicked, restores the folio number to the original value. */
  private onUndoClicked (): void {
    this.folioNumber = this.originalValue
    this.emitNewFolioNumber()
    this.emitHaveChanges()
    this.isEditing = false
  }

  /** When form is submitted, accepts the entered folio number. */
  private onFormSubmit (): void {
    if (this.formValid) {
      this.emitNewFolioNumber()
      this.emitHaveChanges()
      this.isEditing = false
    }
  }

  /** When Cancel is clicked, undoes the current change. */
  private onCancelClicked (): void {
    this.folioNumber = this.initialValue
    this.isEditing = false
  }

  /** Updates local value initially and when prop has changed. */
  @Watch('initialValue', { deep: true, immediate: true })
  private onInitialValueChanged (): void {
    this.folioNumber = this.initialValue
  }

  /** Informs parent of new folio number. */
  @Emit('newFolioNumber')
  private emitNewFolioNumber (): string {
    return this.folioNumber
  }

  /** Informs parent whether we have changes. */
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return this.hasFolioNumberChanged
  }

  /** Informs parent whether we are in editing mode. */
  @Watch('isEditing')
  @Emit('isEditing')
  private emitIsEditing (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

::v-deep .v-input .v-label {
  font-weight: normal;
  color: $gray7;
}

#folio-number-readonly {
  color: $gray7;
}

.edit-actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }

  .undo-button {
    border-right: 1px solid $gray1;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }
}
</style>
