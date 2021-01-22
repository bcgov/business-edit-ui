<template>
  <div v-if="isAlteration()" id="business-type">
    <v-layout>
      <!-- Row Title -->
      <v-flex xs3>
        <label><strong>Business Type</strong></label>
        <v-flex md1>
          <v-chip v-if="isNewBusinessType" x-small label color="primary" text-color="white">
            {{editedLabel}}
          </v-chip>
        </v-flex>
      </v-flex>

      <!-- Display Mode -->
      <v-flex xs8 v-if="!isEditingType">
        <template>
          <span class="info-text"
                :class="{ 'hasConflict': isConflictingLegalType && !isNewBusinessType}"
          >{{getEntityDesc(getEntityType)}}
          </span>
          <v-tooltip v-if="isConflictingLegalType && !isNewBusinessType"
                     top
                     content-class="top-tooltip"
                     transition="fade-transition"
                     nudge-right="3"
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" color="error" small>mdi-alert</v-icon>
            </template>
            <span>
              Business Types do not match. The Name Request type must match the business type before you can continue.
            </span>
          </v-tooltip>
          <template v-if="isNewBusinessType && confirmArticles">
            <p class="subtitle pt-2">Benefit Company Articles</p>
            <p class="info-text">
              <v-icon color="success">mdi-check</v-icon>
              The company has completed a set Benefit Company Articles containing a benefit provision, and a copy of
              these articles has been added to the company's record book.
            </p>
          </template>
        </template>
      </v-flex>

      <!-- Editing Mode -->
      <v-flex xs9 v-if="isEditingType" class="pr-4">
        <v-select :items="entityTypeOptions"
                  v-model="selectedEntityType"
                  hint="Select a New Business Type"
                  persistent-hint
                  filled
        >
          <template slot="item" slot-scope="data">
          <span class="list-item">
            {{ data.item.text }}
          </span>
          </template>
        </v-select>
        <div class="my-6">
          <p class="info-text">Businesses can only be altered to specific types. If the business type you want is
          not listed, contact BC Registry staff:</p>
        </div>

        <!-- Contact Info -->
        <contact-info :direction="'col'"/>

        <div class="my-6">
          <p class="subtitle">Benefit Company Articles</p>
          <p class="info-text">Before submitting your alteration notice you <span class="font-weight-bold">must change
            your company's articles to include a set of Benefit Company Articles</span> OR draft new articles containing
            a benefit provision.</p>
        </div>

        <!-- Help Section Toggle -->
        <div class="info-text help-toggle pt-2" @click="helpToggle = !helpToggle">
          <v-icon class="pr-2 mt-n2" color="primary">mdi-help-circle-outline</v-icon>
          <span v-if="!helpToggle">Learn More</span>
          <span v-else>Hide Learn More</span>
        </div>

        <!-- Help Section -->
        <section v-show="helpToggle" class="mx-8 my-6">
          <p class="subtitle mb-2">Benefit Provision</p>
          <p class="info-text">
            A benefit company must include a benefit provision (a statement by the company of its public benefits and
            its commitments to promote those public benefits and to conduct business in a responsible and sustainable
            manner) in the company's articles. The benefit provision can be added as part of the company's existing
            articles or as part of new articles.
          </p>
          <div class="provision-help">
            <p class="subtitle">Part 1 - Benefit Provision</p>
            <ol class="info-text ml-2 pl-0">
              <li style="list-style:none;">
                <ol>
                  <li class="mb-4">
                    <span class="ml-4">The Company commits to promote the following public benefits:</span><br>
                    <span class="ml-2">[List your public benefits in this section]</span>
                  </li>
                  <li>
                    <span class="ml-4">The Company commits</span><br>
                    <div class="ml-5">
                      <span class="ml-n3">i) to conduct the benefit company's business in a responsible and sustainable
                      manner;</span><br>
                      <span class="ml-n3">ii) to promote the public benefits specific in paragraph 1.1</span>
                    </div>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </section>

        <!-- Confirm Articles Checkbox -->
        <div class="pt-2 pr-2">
          <v-checkbox
            v-model="confirmArticles"
            id="confirm-articles-checkbox"
            :label="`The company has completed a set Benefit Company Articles containing a benefit provision, and a copy
             of these articles has been added to company's record book.`"
          ></v-checkbox>
        </div>

        <!-- Done Actions -->
        <div class="action-btns">
          <v-btn
            id="done-btn"
            large color="primary"
            :disabled="!confirmArticles"
            @click="submitTypeChange()"
          >
            <span>Done</span>
          </v-btn>

          <v-btn
            id="cancel-btn"
            large outlined color="primary"
            @click="isEditingType = false"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-flex>

      <!-- Edit Actions -->
      <v-flex v-if="!isEditingType" xs1 class="mt-n2">
        <div class="actions mr-4">
          <v-btn
            v-if="isNewBusinessType"
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
          <span class="more-actions" v-if="isNewBusinessType">
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
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { ContactInfo } from '@/components/common'

// Mixins
import { CommonMixin } from '@/mixins'

// Enums and Interfaces
import { EntityTypes } from '@/enums'
import { ActionBindingIF, BusinessSnapshotIF } from '@/interfaces'

@Component({
  components: {
    ContactInfo
  }
})
export default class CorrectBusinessType extends Mixins(CommonMixin) {
  @Getter getEntityType!: EntityTypes
  @Getter isConflictingLegalType: boolean
  @Getter getOriginalSnapshot: BusinessSnapshotIF

  @Action setEntityType!: ActionBindingIF

  readonly EntityTypes = EntityTypes

  private selectedEntityType: EntityTypes = null
  private confirmArticles: boolean = false
  private helpToggle: boolean = false
  private isEditingType = false

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  /** Define the entity type locally once the value has been populated in the store. */
  @Watch('getEntityType')
  private initializeEntityType () {
    this.selectedEntityType = this.getEntityType
  }

  /** Entity Options. */
  private entityTypeOptions = [
    {
      value: 'CR',
      SHORT_DESC: 'BC Limited Company',
      text: 'BC Limited Company'
    },
    {
      value: 'BEN',
      SHORT_DESC: 'BC Benefit Company',
      text: 'BC Benefit Company'
    }
  ]

  /** Verify New Business type. */
  private get isNewBusinessType (): boolean {
    return this.getEntityType && this.getEntityType !== this.getOriginalSnapshot[0]?.business?.legalType
  }

  /** Reset company type values to original. */
  private resetType () {
    this.setEntityType(this.getOriginalSnapshot[0]?.business?.legalType)
    this.emitHaveChanges(false)
    this.isEditingType = false
    this.confirmArticles = false
  }

  /** Reset company type values to original. */
  private submitTypeChange () {
    this.setEntityType(this.selectedEntityType)
    this.emitHaveChanges(true)
    this.isEditingType = false
  }

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ol {
  counter-reset: item;
}

ol > li {
  counter-increment: item;
}

ol ol > li {
  display: block;
}

ol ol > li:before {
  content: counters(item, ".");
  margin-left: -32px;
}

.help-toggle {
  color: $app-blue;

  :hover {
    cursor: pointer;
  }
}

.provision-help {
  padding: 40px;
  background-color: $gray1;
}

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}

.action-btns {
  margin: 30px 0;
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  #done-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

::v-deep .theme--light.v-label {
  font-size: .875rem;
  color: $gray7;
  font-weight: normal;
}

::v-deep .v-input__slot {
  align-items: flex-start;
}
</style>
