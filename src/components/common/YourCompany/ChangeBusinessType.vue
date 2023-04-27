<template>
  <div id="change-business-type">
    <v-row no-gutters>
      <!-- Row Title -->
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}"><strong>Business Type</strong></label>
        <v-col md="1">
          <v-chip
            v-if="hasBusinessTypeChanged"
            x-small
            label
            color="primary"
            text-color="white"
          >
            {{ getEditedLabel }}
          </v-chip>
        </v-col>
      </v-col>

      <!-- Display Mode -->
      <v-col
        v-if="!isEditingType"
        cols="7"
      >
        <span
          class="info-text"
          :class="{ 'has-conflict': isConflictingLegalType && isNewName}"
        >
          {{ GetCorpFullDescription(getEntityType) }}
        </span>

        <!-- Type change tooltip -->
        <v-tooltip
          v-if="typeChangeInfo"
          top
          content-class="top-tooltip"
          transition="fade-transition"
          nudge-right="3"
        >
          <template #activator="{ on }">
            <v-icon
              class="info-icon"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ typeChangeInfo }}</span>
        </v-tooltip>

        <!-- Type mismatch tooltip -->
        <v-tooltip
          v-if="isConflictingLegalType && isNewName"
          top
          content-class="top-tooltip"
          transition="fade-transition"
          nudge-right="3"
        >
          <template #activator="{ on }">
            <v-icon
              color="error"
              small
              v-on="on"
            >
              mdi-alert
            </v-icon>
          </template>
          <span>
            Business Types do not match. The Name Request type must match the business type before you can continue.
          </span>
        </v-tooltip>

        <template v-if="hasBusinessTypeChanged">
          <p class="subtitle mt-2 pt-2">
            Benefit Company Articles
          </p>
          <div class="confirmed-msg">
            <v-icon
              color="success"
              class="confirmed-icon"
            >
              mdi-check
            </v-icon>
            <span class="info-text text-body-3 confirmed-icon ml-2">
              The company has completed a set Benefit Company Articles containing a benefit provision, and a copy of
              these articles has been added to the company's record book.
            </span>
          </div>
        </template>
      </v-col>

      <!-- Editing Mode -->
      <v-col
        v-if="isEditingType"
        cols="9"
        class="pr-4"
      >
        <v-select
          id="business-type-selector"
          v-model="selectedEntityType"
          :items="entityTypeOptions"
          hint="Select a New Business Type"
          persistent-hint
          filled
        >
          <template #item="data">
            <span class="list-item">{{ data.item.text }}</span>
          </template>
        </v-select>
        <div class="my-6">
          <p class="info-text">
            Businesses can only be altered to specific types. If the business type you want is
            not listed, contact BC Registry staff:
          </p>
        </div>

        <!-- BC Registry Contacts -->
        <BcRegContacts :direction="'col'" />

        <template v-if="isBenefit">
          <div class="my-6">
            <p class="subtitle">
              Benefit Company Articles
            </p>
            <p class="info-text">
              Before submitting your alteration notice you <span class="font-weight-bold">must
                change your company's articles to include a set of Benefit Company Articles</span> OR draft new articles
              containing a benefit provision.
            </p>
          </div>

          <section class="text-body-3">
            <!-- Help Section Toggle -->
            <div
              class="info-text help-toggle pt-2"
              @click="helpToggle = !helpToggle"
            >
              <v-icon
                class="pr-2 mt-n2"
                color="primary"
              >
                mdi-help-circle-outline
              </v-icon>
              <span v-if="!helpToggle">Learn More</span>
              <span v-else>Hide Learn More</span>
            </div>

            <!-- Help Section -->
            <section
              v-show="helpToggle"
              class="mx-8 my-7"
            >
              <p class="subtitle mb-2">
                Benefit Provision
              </p>
              <p class="info-text">
                A benefit company must include a benefit provision (a statement by the company of its public benefits
                and its commitments to promote those public benefits and to conduct business in a responsible and
                sustainable manner) in the company's articles. The benefit provision can be added as part of the
                company's existing articles or as part of new articles.
              </p>
              <div class="provision-help">
                <p class="subtitle">
                  Part 1 - Benefit Provision
                </p>
                <ol class="info-text ml-2 pl-0">
                  <li style="list-style:none;">
                    <ol>
                      <li class="mb-4">
                        <span class="ml-4">The Company commits to promote the following public benefits:</span><br>
                        <span class="ml-2">[List your public benefits in this section]</span>
                      </li>
                      <li>
                        <span class="ml-4">The Company commits</span>
                        <br>
                        <div class="ml-5">
                          <span class="ml-n3">i) to conduct the benefit company's business in a responsible and
                            sustainable manner;</span>
                          <br>
                          <span class="ml-n3">ii) to promote the public benefits specific in paragraph 1.1</span>
                        </div>
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>
            </section>

            <!-- Confirm Articles Checkbox -->
            <div class="pr-2">
              <v-checkbox
                id="confirm-articles-checkbox"
                v-model="confirmArticles"
                :label="confirmLabel"
              />
            </div>
          </section>
        </template>

        <!-- Done Actions -->
        <div class="action-btns">
          <v-btn
            id="done-btn"
            large
            color="primary"
            :disabled="!confirmArticles"
            @click="submitTypeChange()"
          >
            <span>Done</span>
          </v-btn>

          <v-btn
            id="cancel-btn"
            large
            outlined
            color="primary"
            @click="isEditingType = false"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-col>

      <!-- Edit Actions -->
      <v-col
        v-if="!isEditingType"
        cols="2"
        class="mt-n2"
      >
        <div class="actions mr-4">
          <v-btn
            v-if="hasBusinessTypeChanged"
            id="btn-undo-business-type"
            text
            color="primary"
            class="undo-action"
            @click="resetType()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
          <v-btn
            v-else-if="isBcCompany"
            id="btn-correct-business-type"
            text
            color="primary"
            @click="isEditingType = true"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
            <span>{{ getEditLabel }}</span>
          </v-btn>
          <span
            v-if="hasBusinessTypeChanged"
            class="more-actions"
          >
            <v-menu
              v-model="dropdown"
              offset-y
              left
              nudge-bottom="4"
            >
              <template #activator="{ on }">
                <v-btn
                  id="btn-more-actions"
                  text
                  small
                  color="primary"
                  v-on="on"
                >
                  <v-icon>{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  id="btn-more-actions-edit"
                  class="v-list-item"
                  @click="isEditingType = true; dropdown = false"
                >
                  <v-list-item-subtitle>
                    <v-icon
                      small
                      color="primary"
                    >mdi-pencil</v-icon>
                    <span class="drop-down-action ml-1">Change</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { BcRegContacts } from '@/components/common/'
import { CommonMixin } from '@/mixins/'
import { CorpTypeCd, GetCorpFullDescription } from '@/bcrs-shared-components/corp-type-module/'
import { ActionBindingIF, EntitySnapshotIF, ResourceIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({
  components: { BcRegContacts },
  mixins: [CommonMixin]
})
export default class ChangeBusinessType extends Vue {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  @Prop({ default: false }) readonly invalidSection!: boolean

  // Global getters
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) hasBusinessTypeChanged!: boolean
  @Getter(useStore) isBcCompany!: boolean
  @Getter(useStore) isConflictingLegalType!: boolean

  @Action(useStore) setEntityType!: ActionBindingIF

  protected selectedEntityType = null as CorpTypeCd
  protected confirmArticles = false
  protected helpToggle = false
  protected isEditingType = false
  protected dropdown: boolean = null

  readonly confirmLabel = `The company has completed a set Benefit Company Articles containing a benefit
    provision, and a copy of these articles has been added to company's record book.`

  /** Called when component is mounted. */
  mounted (): void {
    this.initializeEntityType()
  }

  /** Define the entity type locally once the value has been populated in the store. */
  @Watch('getEntityType')
  private initializeEntityType (): void {
    this.selectedEntityType = this.getEntityType
  }

  /** Clear the articles confirm checkbox whenever the selected entity type changes. */
  @Watch('selectedEntityType')
  private clearConfirmArticles (): void {
    this.confirmArticles = false
  }

  /** Entity Options. */
  readonly entityTypeOptions = [
    {
      value: 'BC',
      SHORT_DESC: 'BC Limited Company',
      text: 'BC Limited Company'
    },
    {
      value: 'BEN',
      SHORT_DESC: 'BC Benefit Company',
      text: 'BC Benefit Company'
    }
  ]

  /** Verify New Business name. */
  get isNewName (): boolean {
    return this.getNameRequestLegalName &&
      (this.getNameRequestLegalName !== this.getEntitySnapshot?.businessInfo?.legalName)
  }

  /** Check if current entity selection is a Benefit Company */
  get isBenefit (): boolean {
    return (this.selectedEntityType === CorpTypeCd.BENEFIT_COMPANY)
  }

  /** Type change helper information */
  get typeChangeInfo (): string {
    return this.getResource.changeData?.typeChangeInfo
  }

  /** Reset company type values to original. */
  protected resetType () {
    this.setEntityType(this.getEntitySnapshot?.businessInfo?.legalType)
    this.isEditingType = false
    this.confirmArticles = false
  }

  /** Submit new company type. */
  protected submitTypeChange () {
    this.setEntityType(this.selectedEntityType)
    this.isEditingType = false
  }

  @Watch('isEditingType')
  @Emit('isEditingBusinessType')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitIsEditingType (isEditing: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-icon {
  line-height: 1.5rem
}

ol {
  counter-reset: item;

  > li {
    counter-increment: item;
  }

  ol > li {
    display: block;
  }

  ol > li:before {
    content: counters(item, ".");
    margin-left: -32px;
  }
}

.confirmed-msg {
  display: flex;
  .confirmed-icon, .confirmed-note {
    display: block;
  }
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

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.action-btns {
  margin: 15px 0;
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

:deep(.theme--light.v-label) {
  font-size: .875rem;
  color: $gray7;
  font-weight: normal;
}

:deep(.v-input__slot) {
  align-items: flex-start;
}
</style>
