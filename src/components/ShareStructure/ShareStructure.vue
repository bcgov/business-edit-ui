<template>
  <v-card flat id="share-structure">

    <!-- Summary Section -->
    <div id="share-summary">
      <!-- Summary Header -->
      <div class="share-summary-header" >
        <v-icon>mdi-file-tree</v-icon>
        <label class="share-summary-header-title"><strong> Share Structure</strong></label>
      </div>
    </div>

    <!-- Instructional Text -->
    <div class="share-info-container pt-6 px-4">
      Legal obligations copy TBD:
    </div>

    <!-- Add Buttons -->
    <div class="btn-container py-6 px-4">
      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        :disabled="false"
        @click="initNewShareClass()"
      >
        <v-icon>mdi-plus</v-icon>
        <span>Add Share Class</span>
      </v-btn>
    </div>

    <v-card flat class="add-share-structure-container" v-if="showAddShareStructureForm">
      <edit-share-structure
        v-show="showAddShareStructureForm"
        :initialValue="currentShareStructure"
        :activeIndex="activeIndex"
        :nextId="nextId"
        :parentIndex="parentIndex"
        :shareClasses="shareClasses"
        @addEditClass="addEditShareClass($event)"
        @removeClass="removeShareClass($event)"
        @resetEvent="resetData()"/>
    </v-card>

    <v-data-table
      class="share-structure-table"
      :headers="headers"
      :items="shareClasses"
      disable-pagination
      disable-sort
      hide-default-footer
    >
<!--      EXAMPLE OF SLOTS FOR CUSTOMIZING HEADERS-->
<!--      <template v-slot:header.maxNumberOfShares="{ header }">-->
<!--        <span class="">{{ header.text }}</span>-->
<!--      </template>-->
      <template v-slot:item="row" class="share-data-table">

        <!-- Share Class Rows-->
        <tr :key="row.item.id" class="class-row" :class="{ 'class-row-has-series': row.item.series.length}">
          <td class="list-item__title">
            {{ row.item.name }}
            <action-chip v-if="row.item.action" class="mb-3" :actionable-item="row.item"/>
          </td>
          <td>{{ row.item.maxNumberOfShares ? (+row.item.maxNumberOfShares).toLocaleString() : 'No Maximum' }}</td>
          <td>{{ row.item.parValue ? row.item.parValue : 'No Par Value' }}</td>
          <td>{{ row.item.currency }}</td>
          <td>{{ row.item.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

          <!-- Share Class Action Btns -->
          <td>
            <div class="actions">
              <!-- Share Class Correct Btn -->
              <span v-if="!row.item.action" class="edit-action">
                <v-btn small text color="primary"
                  :id="'class-' + row.index + '-change-btn'"
                  @click="initShareClassForEdit(row.index)"
                  :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Correct</span>
                </v-btn>
              </span>

              <!-- Share Class Undo Btn -->
              <span v-else class="undo-action">
                <v-btn small text color="primary"
                  :id="'class-' + row.index + '-undo-btn'"
                  @click="undoCorrection(row.item.action, row.index)"
                  :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>

              <!-- Share Class Dropdown Actions -->
              <span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn text small
                           color="primary"
                           class="actions__more-actions__btn"
                           :disabled="addEditInProgress"
                           v-on="on">
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="more-actions">
<!--                    <v-list-item-->
<!--                      class="actions-dropdown_item"-->
<!--                      :class="{ 'item-disabled': !row.item.hasRightsOrRestrictions }"-->
<!--                      :disabled="!row.item.hasRightsOrRestrictions"-->
<!--                      @click="emitAddSeries(row.index)">-->
<!--                      <v-list-item-subtitle><v-icon>mdi-playlist-plus</v-icon> Add Series</v-list-item-subtitle>-->
<!--                    </v-list-item>-->
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.index, 'up') }"
                      @click="moveIndex(row.index, 'up')"
                      :disabled="isMoveDisabled(row.index, 'up')"
                    >
                      <v-list-item-subtitle class="move-up-selector">
                        <v-icon>mdi-arrow-up</v-icon> Move Up
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.index, 'down') }"
                      @click="moveIndex(row.index, 'down')"
                      :disabled="isMoveDisabled(row.index, 'down')"
                    >
                      <v-list-item-subtitle class="move-down-selector">
                        <v-icon>mdi-arrow-down</v-icon> Move Down
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      v-if="!row.item.action"
                      class="actions-dropdown_item"
                      @click="removeShareClass(row.index)"
                    >
                      <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </td>
        </tr>
        <tr v-if="showEditShareStructureForm[row.index]">
          <td colspan="6">
            <div flat class="edit-share-structure-container">
              <edit-share-structure
                v-show="showEditShareStructureForm"
                :initialValue="currentShareStructure"
                :activeIndex="activeIndex"
                :nextId="nextId"
                :parentIndex="parentIndex"
                :shareClasses="shareClasses"
                @addEditClass="addEditShareClass($event)"
                @removeClass="removeShareClass($event)"
                @resetEvent="resetData()"/>
            </div>
          </td>
        </tr>
<!--        &lt;!&ndash; Share Series rows &ndash;&gt;-->
<!--        <tr v-for="(seriesItem, index) in row.item.series" :key="`class:${row.index}-Series:${index}`"-->
<!--            class="series-row"-->
<!--            :class="{ 'series-row-last': index === row.item.series.length - 1}"-->
<!--        >-->
<!--          <td class="series-name"><span>{{ seriesItem.name }}</span></td>-->
<!--          <td>{{ seriesItem.maxNumberOfShares ? (+seriesItem.maxNumberOfShares).toLocaleString()-->
<!--            : 'No Maximum' }}</td>-->
<!--          <td>{{ row.item.parValue ? row.item.parValue : 'No Par Value' }}</td>-->
<!--          <td>{{ row.item.currency }}</td>-->
<!--          <td>{{ seriesItem.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>-->

<!--          &lt;!&ndash; Share Series Edit Btn &ndash;&gt;-->
<!--          <td>-->
<!--            <div class="actions">-->
<!--              <span class="edit-action">-->
<!--                <v-btn small text color="primary"-->
<!--                       :id="'series-' + index + '-change-btn'"-->
<!--                       @click="emitShareSeries(row.index, index)"-->
<!--                >-->
<!--                  <v-icon small>mdi-pencil</v-icon>-->
<!--                  <span>Edit</span>-->
<!--                </v-btn>-->
<!--              </span>-->

<!--              &lt;!&ndash; Share Series Dropdown Actions &ndash;&gt;-->
<!--              <span>-->
<!--                  <v-menu offset-y>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-btn text small color="primary"-->
<!--                        class="actions__more-actions__btn" v-on="on"-->
<!--                      >-->
<!--                        <v-icon>mdi-menu-down</v-icon>-->
<!--                      </v-btn>-->
<!--                    </template>-->
<!--                    <v-list class="more-actions">-->
<!--                      <v-list-item-->
<!--                        class="actions-dropdown_item"-->
<!--                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'up', index) }"-->
<!--                        @click="moveIndex(row.index, 'up', index)"-->
<!--                        :disabled="isMoveDisabled(row.index, 'up', index)"-->
<!--                      >-->
<!--                        <v-list-item-subtitle class="move-up-selector">-->
<!--                          <v-icon>mdi-arrow-up</v-icon> Move Up-->
<!--                        </v-list-item-subtitle>-->
<!--                      </v-list-item>-->
<!--                      <v-list-item-->
<!--                        class="actions-dropdown_item"-->
<!--                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'down', index) }"-->
<!--                        @click="moveIndex(row.index, 'down', index)"-->
<!--                        :disabled="isMoveDisabled(row.index, 'down', index)"-->
<!--                      >-->
<!--                        <v-list-item-subtitle class="move-down-selector">-->
<!--                          <v-icon>mdi-arrow-down</v-icon> Move Down-->
<!--                        </v-list-item-subtitle>-->
<!--                      </v-list-item>-->
<!--                      <v-list-item class="actions-dropdown_item" @click="emitRemoveSeries(row.index, index)">-->
<!--                        <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>-->
<!--                      </v-list-item>-->
<!--                    </v-list>-->
<!--                  </v-menu>-->
<!--                </span>-->
<!--            </div>-->
<!--          </td>-->
<!--        </tr>-->
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import 'array.prototype.move'
import { isEqual } from 'lodash'

// Components
import { ActionChip } from '@/components/common'
import EditShareStructure from './EditShareStructure.vue'

// Interfaces or Enums
import { IncorporationFilingIF, ShareClassIF, ShareStructureIF } from '@/interfaces'
import { ActionTypes } from '@/enums'

@Component({
  components: {
    ActionChip,
    EditShareStructure
  }
})
export default class ShareStructure extends Vue {
  @Prop({ default: () => [] })
  private shareClasses: any

  @Prop({ default: false })
  private showErrorSummary: boolean

  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getShareClasses!: ShareStructureIF

  // Local Properties
  private activeIndex: number = -1
  private parentIndex: number = -1
  private nextId: number = -1
  private showAddShareStructureForm = false
  private showEditShareStructureForm: Array<boolean> = [false]
  private addEditInProgress = false
  private currentShareStructure: ShareClassIF | null = null

  private headers: Array<any> = [
    {
      text: 'Name of Share Class or Series',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Maximum Number of Shares', value: 'maxNumberOfShares' },
    { text: 'Par Value', value: 'parValue' },
    { text: 'Currency', value: 'currency' },
    { text: 'Special Rights or Restrictions', value: 'hasRightsOrRestrictions' },
    { text: '', value: 'actions' }
  ]

  private newShareClass: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Class',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: 'CAD',
    hasRightsOrRestrictions: false,
    series: [],
    action: ActionTypes.ADDED
  }

  /**
   * Initialize the Add Share Class Form
   */
  private initNewShareClass (): void {
    this.currentShareStructure = { ...this.newShareClass }
    this.currentShareStructure.priority =
      this.shareClasses.length === 0 ? 1 : this.shareClasses[this.shareClasses.length - 1].priority + 1
    this.activeIndex = -1
    this.parentIndex = -1
    this.nextId = this.shareClasses.length === 0 ? 1 : (this.shareClasses.reduce(
      (prev, current) => (prev.id > current.id) ? prev : current)).id + 1
    this.addEditInProgress = true
    this.showAddShareStructureForm = true
  }

  /**
   * Add / Edit Share Class and set to store
   * @param shareStructure The current share structure object
   */
  private addEditShareClass (shareStructure: ShareClassIF): void {
    // Apply a correction tag if Share is changed
    if (shareStructure.action !== ActionTypes.ADDED && this.isShareClassEdited(shareStructure)) {
      shareStructure.action = ActionTypes.EDITED
    }

    let newList: ShareClassIF[] = [...this.shareClasses]
    // New Share Structure.
    if (this.activeIndex === -1) {
      newList.push(shareStructure)
    } else {
      // Edit Share Structure.
      newList.splice(this.activeIndex, 1, shareStructure)
    }
    this.emitSetShareClassEvent(newList)
    this.resetData()
  }

  /**
   * Remove the Share Class from the Store
   * @param index The share class identifier
   */
  private removeShareClass (index: number): void {
    // get share class to remove
    // make a copy so we don't change the item in the list
    const shareClass = { ...this.getShareClasses[index] }
    let tempList: ShareClassIF[] = [...this.getShareClasses]

    if (shareClass.action === ActionTypes.ADDED) {
      tempList.splice(index, 1)
    } else {
      shareClass.action = ActionTypes.REMOVED
      tempList.splice(index, 1, shareClass)
    }

    this.emitSetShareClassEvent(tempList)
    this.resetData()
  }

  /**
   * Remove the Share Class from the Store
   * @param index The share class identifier
   */
  private restoreShareClass (index: number): void {
    // Fetch and identify the ShareClass to restore
    const shareClassToRestore = this.getOriginalIA.incorporationApplication.shareStructure.shareClasses.find(
      shareClass => shareClass.id === this.shareClasses[index].id
    )

    // Create a new ShareClass List and restore the original data
    let newList: ShareClassIF[] = [...this.shareClasses]
    newList[index] = shareClassToRestore

    this.emitSetShareClassEvent(newList)
    this.resetData()
  }

  /**
   *  Initialize the Add Share Class Form to Edit existing ShareClass
   *  @param index The identifier of the ShareClass to be edited.
   */
  private initShareClassForEdit (index: number): void {
    this.currentShareStructure = { ...this.shareClasses[index] }
    this.activeIndex = index
    this.parentIndex = -1
    this.addEditInProgress = true
    this.showEditShareStructureForm[index] = true
  }

  /**
   * Adjust the priority of the list share class
   * @param indexFrom The index of the class
   * @param direction The direction of the move
   * @param seriesIndex The index of the series
   */
  private moveIndex (indexFrom: number, direction: string, seriesIndex: number = -1): void {
    let indexTo
    if (seriesIndex >= 0) {
      indexTo = direction === 'up' ? seriesIndex - 1 : seriesIndex + 1
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexTo
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexFrom
      this.shareClasses[indexFrom].series.move(seriesIndex, indexTo)
    } else {
      indexTo = direction === 'up' ? indexFrom - 1 : indexFrom + 1
      this.shareClasses[indexFrom].priority = indexTo
      this.shareClasses[indexTo].priority = indexFrom
      this.shareClasses.move(indexFrom, indexTo)
    }
  }

  /**
   * Determine if the move up / move down is enabled
   * @param index index of the class item
   * @param direction The direction of the move
   * @param seriesIndex index of the series item
   * @returns A boolean indicating if a move is enabled
   */
  private isMoveDisabled (index: number, direction: string, seriesIndex: number = -1): boolean {
    const seriesCheck = seriesIndex >= 0
    const arrBoundry = seriesCheck ? this.shareClasses[index].series.length - 1 : this.shareClasses.length - 1
    switch (direction) {
      case 'up':
        if (seriesCheck) {
          return seriesIndex === 0
        } else {
          return index === 0
        }
      case 'down':
        if (seriesCheck) {
          return seriesIndex === arrBoundry
        } else {
          return index === arrBoundry
        }
      default:
        return false
    }
  }

  /**
   * Compare ShareClass to its original to identify any changes
   * @params shareClass The Share class to compare
   */
  private isShareClassEdited (shareClass: ShareClassIF): boolean {
    const originalShareClass = this.getOriginalIA.incorporationApplication.shareStructure.shareClasses.find(
      share => share.id === shareClass.id
    )

    return !isEqual({ ...shareClass }, { ...originalShareClass })
  }

  /**
   * Undo the adding or editing of a Share class or series
   * @param actionType The type of action to undo
   * @param index The identifier of which share class/series to undo
   */
  private undoCorrection (actionType: ActionTypes, index: number): void {
    switch (actionType) {
      case ActionTypes.ADDED:
        this.removeShareClass(index)
        break
      case ActionTypes.EDITED:
        this.restoreShareClass(index)
        break
      case ActionTypes.REMOVED:
        this.restoreShareClass(index)
        break
    }
  }

  /**
   * Clear and set local tracking properties to default
   */
  private resetData (): void {
    this.currentShareStructure = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showAddShareStructureForm = false
    this.showEditShareStructureForm = [false]
    this.parentIndex = -1
    this.nextId = -1
  }

  // Events
  /**
   * Emit an event to the parent to handle addition or edit of a shareClass.
   * @param shareClass The shareClass object to set to store.
   */
  @Emit('setShareClass')
  private emitSetShareClassEvent (shareClass: ShareClassIF[]): void {}

  // /**
  //  * Emit an index and event to the parent to handle removal.
  //  * @param index The active index which is subject to removal.
  //  */
  // @Emit('removeClass')
  // private emitRemoveClass (index: number): void {}
  //
  // /**
  //  * Emit an index and event to the parent to handle removal.
  //  * @param index The active index which is subject to removal.
  //  */
  // @Emit('removeSeries')
  // private emitRemoveSeries (index: number, seriesIndex: number): void {}
  //
  // /**
  //  * Emit an class and event to the parent to handle editing.
  //  * @param addSeries The series item to be edited.
  //  */
  // @Emit('addSeries')
  // private emitAddSeries (index: number): void {}
  //
  // /**
  //  * Emit an class and event to the parent to handle editing.
  //  * @param classItem The series item to be edited.
  //  */
  // @Emit('editClass')
  // private emitShareClass (index: number): void {}
  //
  // /**
  //  * Emit an  series item and event to the parent to handle editing.
  //  * @param seriesItem The series item to be edited.
  //  */
  // @Emit('editSeries')
  // private emitShareSeries (index: number, seriesIndex: number): void {}
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  #share-structure {
    margin-top: 1rem;
  }

  .share-summary-header {
    display: flex;
    background-color: $BCgovBlue5O;
    padding: 1.25rem;

    .share-summary-header-title {
      padding-left: .5rem;
    }
  }

  .class-row td{
    height: 4rem !important;
  }

  .class-row td:not(:first-child) {
    color: $gray6;
  }

  .class-row-has-series td {
    border-bottom: thin dashed rgba(0, 0, 0, 0.12)!important;
  }

  .series-row {
    .series-name {
      padding-left: 2rem;
    }

    td {
      border-bottom: none!important;
    }

    td:not(:first-child){
      color: $gray6;
    }
  }

  .series-row-last td {
    border-bottom: thin solid rgba(0, 0, 0, 0.12)!important;
  }

  .actions {
    display: flex;
    justify-content: flex-end;

    .edit-action, .undo-action {
      border-right: 1px solid $gray1;
    }

    .v-btn {
      min-width: .5rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }

  .more-actions {
    padding: 2px 0;

    .item-disabled {
      opacity: .5;
    }

    .actions-dropdown_item {
      min-height: 0!important;
      margin: 1rem 0;
    }
  }
</style>
