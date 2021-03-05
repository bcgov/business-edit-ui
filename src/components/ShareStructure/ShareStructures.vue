<template>
  <div>
    <confirm-dialog
      ref="confirm"
      attach="#share-structure"
    />
    IA: <span>{{getOriginalIA}}</span><br>
    shareClasses <span>{{getShareClasses}}</span>

    <share-structure
      :incorporation-application="getOriginalIA"
      :share-classes="getShareClasses"
      :business-snapshot="getOriginalSnapshot"
      :resolution-required="resolutionRequired"
      @emitShareClasses="setShareClasses($event)"
      @emitShareStructureChanged="setShareStructureChanged($event)"
      @emitEditingShareStructure="setEditingShareStructure($event)"
      @emitResolutionPrompt="promptDialog($event)"
    />
  </div>
</template>
<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { ShareStructure } from './index' // REPLACE WITH SHARED COMP IMPORT
import { ConfirmDialog } from '@/components/dialogs'
import { CommonMixin } from '@/mixins'

import {
  ActionBindingIF,
  BusinessSnapshotIF, ConfirmDialogType,
  IncorporationFilingIF,
  ShareClassIF
} from '@/interfaces'

@Component({
  components: {
    ShareStructure,
    ConfirmDialog
  }
})
export default class ShareStructures extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType,
  };

  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getOriginalSnapshot!: BusinessSnapshotIF[]

  @Action setShareClasses!: ActionBindingIF
  @Action setShareStructureChanged!: ActionBindingIF
  @Action setEditingShareStructure!: ActionBindingIF

  private resolutionRequired: boolean = true

  mounted () {
    this.resolutionRequired = this.isAlterationView()
  }

  private promptDialog (val: any) {
    if (val) {
      // open confirmation dialog and wait for response
      this.$refs.confirm.open(
        'Remove Share Series with Class',
        'A share series exists for this class. Removing the share class will remove all associated share ' +
        'series.',
        {
          width: '45rem',
          persistent: true,
          yes: 'Remove',
          no: null,
          cancel: 'Cancel'
        }
      ).then(() => {
        // if we get here, Yes was clicked
        this.resolutionRequired = false
      }).catch(() => {
        // if we get here, Cancel was clicked
        this.resolutionRequired = true
      })
    }
  }
}
</script>
