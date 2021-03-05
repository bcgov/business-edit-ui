<template>
  <div id="company-provisions">
    <confirm-dialog ref="confirmCompanyProvisionsDialog" attach="#company-provisions" />
    <v-layout v-if="!isEditing">
      <v-flex xs3>
        <label><strong>Pre-existing Company Provisions</strong></label>
        <v-chip v-if="hasProvisionsRemovedPropsChanged" x-small label color="#1669BB" text-color="white">
          CHANGED
        </v-chip>
      </v-flex>
      <v-flex xs7 class="info-text" v-if="provisionsRemoved">
        The company has resolved that none of the Pre-existing Company Provisions are to apply to this company.
      </v-flex>
      <v-flex xs7 class="info-text" v-else>
        This company has Pre-existing Company Provisions
      </v-flex>
      <v-flex mt-n2 xs2 class="align-right" v-if="!hasProvisionsRemovedPropsChanged">
        <v-btn id="correct-company-provisions" text color="primary" @click="isEditing = true">
          <v-icon small>mdi-pencil</v-icon>
          <span>{{ editLabel }}</span>
        </v-btn>
      </v-flex>
      <v-flex mt-n2 xs2 class="align-right" v-else>
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
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text small color="primary" class="more-actions-btn" v-on="on">
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="actions-dropdown_item" @click="isEditing = true">
                <v-list-item-subtitle>
                  <v-icon small>mdi-pencil</v-icon>
                  <span class="ml-1">{{ editLabel }}</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs3>
        <label><strong>Pre-existing Company Provisions</strong></label>
      </v-flex>
      <v-flex xs9>
        <v-layout>
          <v-flex>
            <p class="instructions-paragraph">
              Complete this item only if the company has resolved that none of the Pre-existing Company Provisions
              are to apply to this company (refer to Part 17 and Table 3 of the Regulation under the Business
              Corporations Act).
            </p>
            <v-layout>
                <v-checkbox
                  id="cp-checkbox"
                  class="mt-1"
                  :color="isInvalid ? checkBoxColor : ''"
                  v-model="draftProvisionsRemoved"
                />
                <span class="checkbox-label" :class="{ 'invalid': isInvalid }">
                  The company has resolved that none of the Pre-existing Company Provisions are to apply to this company
                </span>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout pt-10>
          <v-flex xs12>
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
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Mixins, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins'
import { ConfirmDialog } from '@/components/dialogs'

@Component({
  components: {
    ConfirmDialog
  }
})
export default class CompanyProvisions extends Mixins(CommonMixin) {
  private draftProvisionsRemoved: boolean = false
  private isEditing: boolean = false
  private haveChanges: boolean = false
  private originalProvisionsRemovedValue: boolean = false
  private isInvalid = false
  private checkBoxColor = '#d3272c' // $app-red

  // Props
  @Prop({ default: () => { return false } })
  private provisionsRemoved!: boolean

  // Emitters
  @Emit('companyProvisionsChanged')
  private emitCompanyProvisionsChanged (provisionsremoved: boolean): void {}

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}

  // Watchers
  @Watch('provisionsRemoved', { deep: true, immediate: true })
  private onProvisionsRemovedPropValueChanged (): void {
    if (!this.haveChanges) {
      this.originalProvisionsRemovedValue = this.provisionsRemoved
      this.draftProvisionsRemoved = this.provisionsRemoved
      this.emitHaveChanges(this.haveChanges)
    }
  }

  @Watch('draftProvisionsRemoved', { deep: true, immediate: true })
  private onDraftProvisionsRemovedPropValueChanged (): void {
    this.isInvalid = false
  }

  private setCompanyProvisionsDone (): void {
    if (this.draftProvisionsRemoved !== this.provisionsRemoved) {
      this.isEditing = false
      if (this.hasDraftProvisionsRemovedChanged) {
        this.haveChanges = true
      } else {
        this.haveChanges = false
      }
      this.emitHaveChanges(this.haveChanges)
      this.emitCompanyProvisionsChanged(this.draftProvisionsRemoved)
      this.isInvalid = false
    } else {
      this.isInvalid = true
    }
  }

  private get hasProvisionsRemovedPropsChanged (): boolean {
    return this.provisionsRemoved !== this.originalProvisionsRemovedValue
  }

  private get hasDraftProvisionsRemovedChanged (): boolean {
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
    this.emitCompanyProvisionsChanged(this.draftProvisionsRemoved)
    this.emitHaveChanges(false)
    this.isEditing = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.action-btns {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 1rem;
  padding-right: 0.5rem;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  .v-btn[disabled] {
    color: white !important;
    background-color: #1669bb !important;
    opacity: 0.2;
  }
}
.instructions-paragraph {
  margin-bottom: 1.875rem;
  line-height: 1.375rem;
}
.checkbox-label {
  line-height: 1.375rem;
  font-size: 0.875rem;
}

.invalid {
  color: $app-red;
}

</style>
