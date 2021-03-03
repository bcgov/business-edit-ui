<template>
  <div id="company-provisions">
    <confirm-dialog ref="confirmTranslationDialog" attach="#company-provisions" />
    <v-layout v-if="!isEditing">
      <v-flex xs3>
        <label><strong>Pre-existing Company Provisions</strong></label>
        <v-chip v-if="hasCompanyProvisionsChange" x-small label color="#1669BB" text-color="white">
          CHANGED
        </v-chip>
      </v-flex>
      <v-flex xs7 class="info-text" v-if="isCheckBoxChecked">
        CHECKBOX CHECKED
      </v-flex>
      <v-flex xs7 class="info-text" v-else>
        CHECKBOX NOT CHECKED
      </v-flex>
      <v-flex xs2 class="align-right" v-if="!hasCompanyProvisionsChange">
        <v-btn id="correct-company-provisions" text color="primary" @click="isEditing = true">
          <v-icon small>mdi-pencil</v-icon>
          <span>{{ editLabel }}</span>
        </v-btn>
      </v-flex>
      <v-flex xs2 class="align-right" v-else>
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
            <p>
              Name translations must use the Latin Alphabet (English, French, etc.). Names that use other writing
              systems must spell the name phonetically in English or French.
            </p>
            <!-- <v-btn
              outlined
              color="primary"
              @click="isChangingCompanyProvisions = true"
              :disabled="isChangingCompanyProvisions"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn> -->
            <v-checkbox
              id="cp-checkbox"
              class="mt-1"
              v-model="companyProvisionsApply"
              @change="hasCompanyProvisionsChange()"
            />
            <span>
              The company has resolved that none of the Pre-existing Company Provisions are to apply to this company
            </span>
          </v-flex>
        </v-layout>
        <v-layout pt-5>
          <v-flex xs12>
            <div class="action-btns">
              <v-btn
                large
                color="primary"
                id="company-provisions-done"
                :disabled="isChangingCompanyProvisions || !hasPendingChange"
                @click="setNameTranslations()"
              >
                <span>Done</span>
              </v-btn>
              <v-btn
                large
                outlined
                color="primary"
                id="company-provisions-cancel"
                @click="cancelCompanyProvisionChange()"
                :disabled="isChangingCompanyProvisions"
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
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins'
import { ConfirmDialog } from '@/components/dialogs'

@Component({
  components: {
    ConfirmDialog
  }
})
export default class CompanyProvisions extends Mixins(CommonMixin) {
  // Properties
  private isEditing: boolean = false
  private isCheckBoxChecked: boolean = false
  private isChangingCompanyProvisions: boolean = false
  private hasPendingChange = false

  private get hasCompanyProvisionsChange (): boolean {
    return this.isCheckBoxChecked
  }

  private cancelCompanyProvisionChange () {
    this.isEditing = false
  }
  mounted () {}
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
</style>
