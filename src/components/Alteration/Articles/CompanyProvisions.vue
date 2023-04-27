<template>
  <div id="company-provisions">
    <template v-if="!isEditing">
      <v-row no-gutters>
        <v-col cols="3">
          <label class="define-company-provisions-title">Pre-existing<br>Company Provisions</label>
          <v-chip
            v-if="hasProvisionsRemovedPropsChanged"
            x-small
            label
            color="primary"
            text-color="white"
          >
            {{ getEditedLabel }}
          </v-chip>
        </v-col>

        <v-col
          v-if="provisionsRemoved"
          id="none-of-provisions-apply-text"
          cols="7"
          class="info-text"
        >
          {{ companyResolvedText }}
        </v-col>
        <v-col
          v-else
          id="has-pre-existing-provisions-text"
          cols="7"
          class="info-text"
        >
          This company has Pre-existing Company Provisions.
        </v-col>

        <v-col
          v-if="!hasProvisionsRemovedPropsChanged"
          cols="2"
          class="mt-n2 align-right"
        >
          <v-btn
            id="change-company-provisions"
            variant="text"
            color="primary"
            @click="isEditing = true"
          >
            <v-icon size="small">
              mdi-pencil
            </v-icon>
            <span>{{ getEditLabel }}</span>
          </v-btn>
        </v-col>
        <v-col
          v-else
          cols="2"
          class="pt-0 mt-n2 align-right"
        >
          <v-btn
            id="undo-company-provisions"
            variant="text"
            color="primary"
            class="undo-company-provisions"
            @click="resetCompanyProvisions"
          >
            <v-icon size="small">
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>

          <!-- More Actions Menu -->
          <span class="more-actions">
            <v-menu
              v-model="dropdown"
              offset-y
              location="left"
              nudge-bottom="4"
            >
              <template #activator="{ on }">
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  class="more-actions-btn"
                  v-on="on"
                >
                  <v-icon>{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  class="v-list-item"
                  @click="isEditing = true; dropdown = false"
                >
                  <v-list-item-subtitle>
                    <v-icon
                      size="small"
                      color="primary"
                    >mdi-pencil</v-icon>
                    <span class="drop-down-action ml-1">Change</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row no-gutters>
        <v-col cols="3">
          <label class="font-weight-bold">Pre-existing Company Provisions</label>
        </v-col>
        <v-col cols="9">
          <p
            id="company-provisions-user-instructions"
            class="info-text mb-0"
          >
            Complete this item only if the company has resolved that none of the Pre-existing Company Provisions
            are to apply to this company (refer to Part 17 and Table 3 of the Regulation under the Business
            Corporations Act).
          </p>
          <div id="checkbox-div">
            <v-checkbox
              id="cp-checkbox"
              v-model="draftProvisionsRemoved"
              :class="{ 'invalid': isInvalid }"
              :label="companyResolvedText"
            />
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-spacer />
        <div class="action-btns">
          <v-btn
            id="company-provisions-done"
            size="large"
            color="primary"
            @click="setCompanyProvisionsDone()"
          >
            <span>Done</span>
          </v-btn>
          <v-btn
            id="company-provisions-cancel"
            size="large"
            variant="outlined"
            color="primary"
            @click="cancelCompanyProvisionChange()"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { Getter } from '@/store/PiniaClass'
import { CommonMixin } from '@/mixins/'
import { useStore } from '@/store/store'

@Component({
  mixins: [CommonMixin]
})
export default class CompanyProvisions extends Vue {
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string

  private draftProvisionsRemoved = false
  private isEditing = false
  private haveChanges = false
  private originalProvisionsRemovedValue = false
  private isInvalid = false
  private dropdown = false

  // Props
  @Prop({ default: false }) readonly provisionsRemoved!: boolean

  // Emitters
  @Emit('isChanged')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitIsChanged (provisionsremoved: boolean): void {}

  @Watch('isEditing')
  @Emit('isEditing')
  private emitIsEditing (): boolean {
    return this.isEditing
  }

  @Emit('haveChanges')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  readonly companyResolvedText =
    'The company has resolved that the Pre-existing Company Provisions no longer apply to this company.'

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

:deep() {
  .v-input--checkbox .theme--light.v-icon {
    margin-top: 0;
    margin-left: 0;
  }

  .invalid.v-input--checkbox .theme--light.v-icon {
    color: $app-red;
    margin-top: 0;
    margin-left: 0;
  }

  .v-input--checkbox .theme--light.v-label {
    line-height: 1.375rem;
    font-size: $px-14;
    font-weight: normal;
  }

  .invalid.v-input--checkbox .theme--light.v-label {
    color: $app-red;
  }

  #checkbox-div .v-input__slot {
    align-items: start;
    justify-content: start;
  }

  .v-input--selection-controls {
    margin-top: 1.875rem;
    padding: 0;
  }
}

.invalid {
  color: $app-red;
}
</style>
