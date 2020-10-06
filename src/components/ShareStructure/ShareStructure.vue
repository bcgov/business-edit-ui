<template>
  <v-card flat id="share-structure">

    <!-- Summary Section -->
    <div id="share-summary">
      <!-- Summary Header -->
      <div class="share-summary-header" >
        <v-icon color="#38598A">mdi-file-tree</v-icon>
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
        :disabled="addEditInProgress"
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
        :shareClasses="getShareClasses"
        @addEditClass="addEditShareClass($event)"
        @resetEvent="resetData()"/>
    </v-card>

    <v-data-table
      class="share-structure-table"
      :headers="headers"
      :items="getShareClasses"
      disable-pagination
      disable-sort
      hide-default-footer
    >
      <template v-slot:item="row" class="share-data-table">

        <!-- Share Class Rows-->
        <tr :key="row.item.id" class="class-row" :class="{ 'class-row-has-series': row.item.series.length}">
          <td :class="{ 'list-item__subtitle' : row.item.action === ActionTypes.REMOVED }" class="list-item__title">
            {{ row.item.name }}
            <action-chip v-if="row.item.action" class="mb-3" :actionable-item="row.item" />
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
              <span
                v-if="row.item.action === ActionTypes.EDITED || row.item.action === ActionTypes.REMOVED"
                class="undo-action"
              >
                <v-btn small text color="primary"
                       :id="'class-' + row.index + '-undo-btn'"
                       @click="undoCorrection(true, row.item.action, row.index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>

              <!-- Share Class Edit Btn -->
              <span v-if="row.item.action === ActionTypes.ADDED" class="edit-action">
                <v-btn small text color="primary"
                  :id="'class-' + row.index + '-change-added-btn'"
                  @click="initShareClassForEdit(row.index)"
                  :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>

              <!-- Share Class Dropdown Actions -->
              <span v-if="row.item.action !== ActionTypes.REMOVED">
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
                    <v-list-item
                      v-if="row.item.action === ActionTypes.EDITED"
                      class="actions-dropdown_item"
                      @click="initShareClassForEdit(row.index)"
                      :disabled="addEditInProgress">
                      <v-list-item-subtitle><v-icon small>mdi-pencil</v-icon> Correct</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': !row.item.hasRightsOrRestrictions }"
                      :disabled="!row.item.hasRightsOrRestrictions"
                      @click="initNewShareSeries(row.index)">
                      <v-list-item-subtitle><v-icon>mdi-playlist-plus</v-icon> Add Series</v-list-item-subtitle>
                    </v-list-item>
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
        <tr v-if="showClassEditForm[row.index]">
          <td colspan="6">
            <div class="edit-share-structure-container">
              <edit-share-structure
                v-show="showClassEditForm"
                :initialValue="currentShareStructure"
                :activeIndex="activeIndex"
                :nextId="nextId"
                :parentIndex="parentIndex"
                :shareClasses="getShareClasses"
                @addEditClass="addEditShareClass($event)"
                @addEditSeries="addEditShareSeries($event)"
                @removeClass="removeShareClass($event)"
                @removeSeries="removeSeries"
                @resetEvent="resetData()"/>
            </div>
          </td>
        </tr>
        <!-- Share Series rows -->
        <tr v-for="(seriesItem, index) in row.item.series" :key="`class:${row.index}-Series:${index}`"
            class="series-row"
            :class="{ 'series-row-last': index === row.item.series.length - 1}"
        >
          <td class="series-name">
            <span :class="{'list-item__subtitle' : row.item.action === ActionTypes.REMOVED ||
              seriesItem.action === ActionTypes.REMOVED }">
              {{ seriesItem.name }}
            </span>
            <action-chip
              v-if="row.item.action !== ActionTypes.REMOVED && seriesItem.action"
              class="mb-3"
              :actionable-item="seriesItem"
            />
          </td>
          <td>{{ seriesItem.maxNumberOfShares ? (+seriesItem.maxNumberOfShares).toLocaleString() : 'No Maximum' }}</td>
          <td>{{ row.item.parValue ? row.item.parValue : 'No Par Value' }}</td>
          <td>{{ row.item.currency }}</td>
          <td>{{ seriesItem.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

          <!-- Share Series Edit Btn -->
          <td>
            <div class="actions" v-if="row.item.action !== ActionTypes.REMOVED">
              <!-- Series Correct Btn -->
              <span v-if="!seriesItem.action" class="edit-action">
                <v-btn small text color="primary"
                       :id="'series-' + index + '-change-btn'"
                       @click="editSeries(row.index, index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Correct</span>
                </v-btn>
              </span>

              <!-- Series Undo btn -->
              <span
                v-else-if="row.item.hasRightsOrRestrictions && row.item.action !== ActionTypes.ADDED"
                class="undo-action"
              >
                <v-btn small text color="primary"
                       :id="'series-' + index + '-undo-btn'"
                       @click="undoCorrection(false, seriesItem.action, index, row.index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>

              <!-- Series Edit Btn -->
              <span v-else class="edit-action">
                <v-btn small text color="primary"
                       :id="'series-' + index + '-change-added-btn'"
                       @click="editSeries(row.index, index)"
                       :disabled="addEditInProgress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>

              <!-- Share Series Dropdown Actions -->
              <span v-if="seriesItem.action !== ActionTypes.REMOVED">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn text small color="primary"
                        class="actions__more-actions__btn" v-on="on"
                        :disabled="addEditInProgress"
                      >
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="more-actions">
                      <v-list-item
                        v-if="seriesItem.action === ActionTypes.EDITED"
                        class="actions-dropdown_item"
                        @click="editSeries(row.index, index)"
                        :disabled="addEditInProgress">
                      <v-list-item-subtitle><v-icon small>mdi-pencil</v-icon> Correct</v-list-item-subtitle>
                    </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'up', index) }"
                        @click="moveIndex(row.index, 'up', index)"
                        :disabled="isMoveDisabled(row.index, 'up', index)"
                      >
                        <v-list-item-subtitle class="move-up-selector">
                          <v-icon>mdi-arrow-up</v-icon> Move Up
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'down', index) }"
                        @click="moveIndex(row.index, 'down', index)"
                        :disabled="isMoveDisabled(row.index, 'down', index)"
                      >
                        <v-list-item-subtitle class="move-down-selector">
                          <v-icon>mdi-arrow-down</v-icon> Move Down
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item class="actions-dropdown_item" @click="removeSeries(index, row.index)">
                        <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
            </div>
          </td>
        </tr>
        <!-- Series Share Edit Form -->
        <tr v-if="showSeriesEditForm[row.index]">
          <td colspan="6">
            <div class="edit-share-structure-container">
              <edit-share-structure
                v-show="showSeriesEditForm"
                :initialValue="currentShareStructure"
                :activeIndex="activeIndex"
                :nextId="nextId"
                :parentIndex="parentIndex"
                :shareClasses="getShareClasses"
                @addEditClass="addEditShareClass($event)"
                @addEditSeries="addEditShareSeries($event)"
                @removeClass="removeShareClass($event)"
                @removeSeries="removeSeries"
                @resetEvent="resetData()"/>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import 'array.prototype.move'
import { isEqual, omit } from 'lodash'

// Components
import { ActionChip } from '@/components/common'
import EditShareStructure from './EditShareStructure.vue'

// Interfaces or Enums
import { ActionBindingIF, IncorporationFilingIF, ShareClassIF } from '@/interfaces'
import { ActionTypes } from '@/enums'

@Component({
  components: {
    ActionChip,
    EditShareStructure
  }
})
export default class ShareStructure extends Vue {
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getShareClasses!: any

  @Action setShareClasses!: ActionBindingIF
  @Action setShareClassesChanged!: ActionBindingIF

  // Local Properties
  private activeIndex: number = -1
  private parentIndex: number = -1
  private nextId: number = -1
  private showAddShareStructureForm = false
  private showClassEditForm: Array<boolean> = [false]
  private showSeriesEditForm: Array<boolean> = [false]
  private addEditInProgress = false
  private currentShareStructure: ShareClassIF | null = null

  // Enums
  private ActionTypes = ActionTypes

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

  private newShareSeries: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Series',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: null,
    hasRightsOrRestrictions: false,
    action: ActionTypes.ADDED
  }

  /** True if we have any changes (from original IA). */
  private get hasClassChanges (): boolean {
    return this.getShareClasses.some(x => x.action)
  }

  /** True if we have any changes (from original IA). */
  private get hasSeriesChanges (): void {
    for (const share of this.getShareClasses) {
      return share.series?.some(x => x.action)
    }
  }

  // Share Class Functionality
  /**
   * Initialize the Add Share Class Form
   */
  private initNewShareClass (): void {
    this.activeIndex = -1
    this.parentIndex = -1
    this.currentShareStructure = { ...this.newShareClass }
    this.currentShareStructure.priority = this.getShareClasses.length === 0
      ? 1
      : this.getShareClasses[this.getShareClasses.length - 1].priority + 1
    this.nextId = this.getShareClasses.length === 0
      ? 1
      : (this.getShareClasses.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id + 1
    this.addEditInProgress = true
    this.showAddShareStructureForm = true
  }

  /**
   *  Initialize the Add Share Class Form to Edit existing ShareClass
   *  @param index The identifier of the ShareClass to be edited.
   */
  private initShareClassForEdit (index: number): void {
    this.currentShareStructure = { ...this.getShareClasses[index] }
    this.activeIndex = index
    this.parentIndex = -1
    this.addEditInProgress = true
    this.showClassEditForm[index] = true
  }

  /**
   * Add / Edit Share Class and set to store
   * @param shareStructure The current share structure object
   */
  private addEditShareClass (shareStructure: ShareClassIF): void {
    // Apply a correction tag if Share is changed
    if (shareStructure.action !== ActionTypes.ADDED) {
      shareStructure.action = this.isShareClassEdited(shareStructure) ? ActionTypes.EDITED : null
    }

    let newList: ShareClassIF[] = [...this.getShareClasses]
    // New Share Structure.
    if (this.activeIndex === -1) {
      newList.push(shareStructure)
    } else {
      // Edit Share Structure.
      newList.splice(this.activeIndex, 1, shareStructure)
    }
    this.setShareClasses(newList)
    this.resetData()
  }

  /**
   * Compare ShareClass to its original to identify any changes
   * @params shareClass The Share class to compare
   */
  private isShareClassEdited (shareClass: ShareClassIF): boolean {
    const originalShareClass = this.getOriginalIA.incorporationApplication.shareStructure.shareClasses.find(
      share => share.id === shareClass.id
    )

    return !isEqual({ ...omit(shareClass, 'action') }, { ...omit(originalShareClass, 'action') })
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

    this.setShareClasses(tempList)
    this.resetData()
  }

  /**
   * Restore the Share series from the Store
   * @param index The share class identifier
   */
  private restoreShareClass (index: number): void {
    // Fetch and identify the ShareClass to restore
    const shareClassToRestore = this.getOriginalIA.incorporationApplication.shareStructure.shareClasses.find(
      shareClass => shareClass.id === this.getShareClasses[index].id
    )

    // Create a new ShareClass List and restore the original data
    let newList: ShareClassIF[] = [...this.getShareClasses]
    newList[index] = { ...shareClassToRestore, series: [...this.getShareClasses[index].series] }

    // Reset series if corrected RightsOrRestrictions is no longer true
    newList.forEach(classShare => {
      if (!classShare.hasRightsOrRestrictions) classShare.series = []
    })

    this.setShareClasses(newList)
    this.resetData()
  }

  // Series Functionality
  /**
   * Initialize the Add Series Form
   */
  private initNewShareSeries (shareClassIndex: number): void {
    this.activeIndex = -1
    this.parentIndex = shareClassIndex

    let newList: ShareClassIF[] = [...this.getShareClasses]
    const parentShareClass = newList[shareClassIndex]
    const shareSeries = parentShareClass.series
    this.currentShareStructure = { ...this.newShareSeries }
    this.currentShareStructure.hasParValue = parentShareClass.hasParValue
    this.currentShareStructure.parValue = parentShareClass.parValue
    this.currentShareStructure.currency = parentShareClass.currency
    this.currentShareStructure.priority =
      shareSeries.length === 0 ? 1 : shareSeries[shareSeries.length - 1].priority + 1
    this.nextId = shareSeries.length === 0 ? 1 : (shareSeries.reduce(
      (prev, current) => (prev.id > current.id) ? prev : current)).id + 1
    this.addEditInProgress = true
    this.showSeriesEditForm[shareClassIndex] = true
  }

  /**
   * Add / Edit Share Series and set to store
   */
  private addEditShareSeries (shareSeries: ShareClassIF): void {
    // Apply a correction tag if Share is changed
    if (shareSeries.action !== ActionTypes.ADDED && this.isShareClassEdited(shareSeries)) {
      shareSeries.action = ActionTypes.EDITED
    }

    let newList: ShareClassIF[] = [...this.getShareClasses]
    const parentShareClass = newList[this.parentIndex]
    let series = [...parentShareClass.series]
    // New Share Structue.
    if (this.activeIndex === -1) {
      series.push(shareSeries)
    } else {
      // Edit Share Structure.
      series.splice(this.activeIndex, 1, shareSeries)
    }
    parentShareClass.series = series
    this.setShareClasses(newList)
    this.resetData()
  }

  /**
   * Edit an existing series share
   * @param index The share class parent index
   * @param seriesIndex The share series index
   */
  private editSeries (index: number, seriesIndex: number): void {
    this.activeIndex = seriesIndex
    this.parentIndex = index
    let newList: ShareClassIF[] = [...this.getShareClasses]
    this.currentShareStructure = { ...newList[this.parentIndex].series[this.activeIndex] }
    this.addEditInProgress = true
    this.showSeriesEditForm[index] = true
  }

  /**
   * Remove the Series share from the Store
   * @param seriesIndex The series share identifier
   * @param parentIndex The parent class index
   */
  private removeSeries (seriesIndex: number, parentIndex: number): void {
    const shareSeries = { ...this.getShareClasses[parentIndex].series[seriesIndex] }
    let tempList: ShareClassIF[] = [...this.getShareClasses]

    if (shareSeries.action === ActionTypes.ADDED) {
      tempList[parentIndex].series.splice(seriesIndex, 1)
    } else {
      shareSeries.action = ActionTypes.REMOVED
      tempList[parentIndex].series.splice(seriesIndex, 1, shareSeries)
    }

    this.setShareClasses(tempList)
    this.resetData()
  }

  /**
   * Restore the Share Series from the Store
   * @param seriesIndex The share series identifier
   * @param parentIndex the share series parent class index
   */
  private restoreShareSeries (seriesIndex: number, parentIndex: number): void {
    // Fetch and identify the ShareClass to restore
    const shareSeriesToRestore =
      this.getOriginalIA.incorporationApplication.shareStructure.shareClasses[parentIndex].series.find(
        shareSeries => shareSeries.id === this.getShareClasses[parentIndex].series[seriesIndex].id
      )

    // Create a new ShareSeries List and restore the original data
    let newList: ShareClassIF[] = [...this.getShareClasses]
    newList[parentIndex].series[seriesIndex] = shareSeriesToRestore

    this.setShareClasses(newList)
    this.resetData()
  }

  // Common form functionality
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
      this.getShareClasses[indexFrom].series[seriesIndex].priority = indexTo
      this.getShareClasses[indexFrom].series[seriesIndex].priority = indexFrom
      this.getShareClasses[indexFrom].series.move(seriesIndex, indexTo)
    } else {
      indexTo = direction === 'up' ? indexFrom - 1 : indexFrom + 1
      this.getShareClasses[indexFrom].priority = indexTo
      this.getShareClasses[indexTo].priority = indexFrom
      this.getShareClasses.move(indexFrom, indexTo)
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
    const arrBoundry = seriesCheck ? this.getShareClasses[index].series.length - 1 : this.getShareClasses.length - 1
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
   * Undo the adding or editing of a Share class or series
   * @param isClass Boolean indicating if item is a Class Share
   * @param actionType The type of action to undo
   * @param index The identifier of which share class/series to undo
   * @param parentIndex The identifier of the parent class when handling series.
   */
  private undoCorrection (isClass: boolean, actionType: ActionTypes, index: number, parentIndex: number = null): void {
    switch (actionType) {
      case ActionTypes.ADDED:
        isClass ? this.removeShareClass(index) : this.removeSeries(index, parentIndex)
        break
      case ActionTypes.EDITED:
        isClass ? this.restoreShareClass(index) : this.restoreShareSeries(index, parentIndex)
        break
      case ActionTypes.REMOVED:
        isClass ? this.restoreShareClass(index) : this.restoreShareSeries(index, parentIndex)
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
    this.showClassEditForm = [false]
    this.showSeriesEditForm = [false]
    this.parentIndex = -1
    this.nextId = -1
  }

  @Watch('hasClassChanges')
  @Watch('hasSeriesChanges')
  private emitHaveChanges (): void {
    this.setShareClassesChanged(this.hasClassChanges || this.hasSeriesChanges)
  }
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
      border-bottom: thin dashed rgba(0, 0, 0, 0.12)!important;
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
