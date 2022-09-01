<template>
  <div id="company-provisions">
    <v-container class="pa-0 ma-0" v-if="!isEditing">
      <v-row no-gutters>
        <v-col class="pr-0 pl-0 pt-0" cols="3">
          <label class="define-company-provisions-title">Pre-existing<br>Company Provisions</label>
          <v-chip v-if="hasProvisionsRemovedPropsChanged" x-small label color="primary" text-color="white">
            {{ editedLabel }}
          </v-chip>
        </v-col>
        <v-col id="none-of-provisions-apply-text" cols="7" class="pt-0 pl-0 info-text" v-if="provisionsRemoved">
          The company has resolved that none of the Pre-existing Company Provisions are to apply to this company.
        </v-col>
        <v-col id="has-pre-existing-provisions-text" cols="7" class="pt-0 pl-0 info-text" v-else>
          This company has Pre-existing Company Provisions.
        </v-col>
        <v-col cols="2" class="pt-0 mt-n2 align-right" v-if="!hasProvisionsRemovedPropsChanged">
          <v-btn id="change-company-provisions" text color="primary" @click="isEditing = true">
            <v-icon small>mdi-pencil</v-icon>
            <span>{{ editLabel }}</span>
          </v-btn>
        </v-col>
        <v-col cols="2" class="pt-0 mt-n2 align-right" v-else>
          <v-btn
            id="undo-company-provisions"
            text
            color="primary"
            class="undo-company-provisions"
            @click="resetCompanyProvisions"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>

          <!-- More Actions Menu -->
          <span class="more-actions">
            <v-menu
              offset-y left nudge-bottom="4"
              v-model="dropdown"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text small color="primary"
                  class="more-actions-btn"
                  v-on="on"
                >
                  <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  class="v-list-item"
                  @click="isEditing = true; dropdown = false"
                >
                  <v-list-item-subtitle>
                    <v-icon small color="primary">mdi-pencil</v-icon>
                    <span class="drop-down-action ml-1">{{ editLabel }}</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="pa-0 ma-0" v-else>
      <v-row no-gutters>
        <v-col class="pr-0 pl-0 pt-0" cols="3">
          <label class="font-weight-bold">Pre-existing Company Provisions</label>
        </v-col>
        <v-col class="pt-0 pl-0" cols="8">
          <v-row no-gutters class="pa-0 ma-0">
            <p id="company-provisions-user-instructions" class="info-text mb-0">
              Complete this item only if the company has resolved that none of the Pre-existing Company Provisions
              are to apply to this company (refer to Part 17 and Table 3 of the Regulation under the Business
              Corporations Act).
            </p>
            <div id="checkbox-div" class="d-flex align-start">
                <v-checkbox
                  id="cp-checkbox"
                  :class="{ 'invalid': isInvalid }"
                  label="The company has resolved that none of the Pre-existing Company Provisions are to apply to this
                    company."
                  v-model="draftProvisionsRemoved"
                />
            </div>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-container class="pt-10">
          <v-row>
            <v-spacer></v-spacer>
            <div class="action-btns">
              <v-btn
                large
                color="primary"
                id="company-provisions-done"
                @click="setCompanyProvisionsDone()"
              >
                <span>Done</span>
              </v-btn>
              <v-btn
                large
                outlined
                color="primary"
                id="company-provisions-cancel"
                @click="cancelCompanyProvisionChange()"
              >
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Mixins, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins/'

@Component({})
export default class CompanyProvisions extends Mixins(CommonMixin) {
  private draftProvisionsRemoved = false
  private isEditing = false
  private haveChanges = false
  private originalProvisionsRemovedValue = false
  private isInvalid = false
  private dropdown = false

  // Props
  @Prop({ default: false })
  readonly provisionsRemoved: boolean

  // Emitters
  @Emit('isChanged')
  private emitIsChanged (provisionsremoved: boolean): void {}

  @Watch('isEditing')
  @Emit('isEditing')
  private emitIsEditing (): boolean {
    return this.isEditing
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}

  // Watchers
  @Watch('provisionsRemoved')
  private onProvisionsRemovedPropValueChanged (): void {
    if (!this.haveChanges) {
      this.draftProvisionsRemoved = this.provisionsRemoved
      this.emitHaveChanges(this.haveChanges)
    }
  }

  @Watch('draftProvisionsRemoved')
  private onDraftProvisionsRemovedPropValueChanged (): void {
    this.isInvalid = false
  }

  private setCompanyProvisionsDone (): void {
    if (!this.haveChanges && this.draftProvisionsRemoved === this.originalProvisionsRemovedValue) {
      this.isInvalid = true
    } else {
      this.isEditing = false
      if (this.hasDraftProvisionsRemovedChanged) {
        this.haveChanges = true
      } else {
        this.haveChanges = false
      }
      this.emitHaveChanges(this.haveChanges)
      this.emitIsChanged(this.draftProvisionsRemoved)
      this.isInvalid = false
    }
  }

  get hasProvisionsRemovedPropsChanged (): boolean {
    return this.provisionsRemoved !== this.originalProvisionsRemovedValue
  }

  get hasDraftProvisionsRemovedChanged (): boolean {
    return this.draftProvisionsRemoved !== this.originalProvisionsRemovedValue
  }

  private cancelCompanyProvisionChange () {
    this.draftProvisionsRemoved = this.provisionsRemoved
    this.isInvalid = false
    this.isEditing = false
  }

  private resetCompanyProvisions () {
    this.haveChanges = false
    this.draftProvisionsRemoved = this.originalProvisionsRemovedValue
    this.emitIsChanged(this.draftProvisionsRemoved)
    this.emitHaveChanges(false)
    this.isEditing = false
    this.dropdown = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.action-btns {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 1rem;
  padding-right: 0.875rem;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  .v-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

.undo-company-provisions {
  border-right: 1px solid $gray1;
}

::v-deep .v-input--checkbox .theme--light.v-icon {
  margin-top: 0;
  margin-left: 0;
}

::v-deep .invalid.v-input--checkbox .theme--light.v-icon {
  color: $app-red;
  margin-top: 0;
  margin-left: 0;
}

::v-deep .v-input--checkbox .theme--light.v-label {
  line-height: 1.375rem;
  font-size: $px-14;
  font-weight: normal;
}

::v-deep .invalid.v-input--checkbox .theme--light.v-label {
  color: $app-red;
}

::v-deep #checkbox-div .v-input__slot {
  align-items: start;
  justify-content: start;
}

::v-deep .v-input--selection-controls {
  margin-top: 1.875rem;
  padding: 0;
}

.invalid {
  color: $app-red;
}
</style>
