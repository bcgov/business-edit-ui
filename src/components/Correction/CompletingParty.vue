<template>
  <section id="completing-party-section">
    <header>
      <h2>{{sectionNumber}} Original Completing Party</h2>
    </header>

    <v-card flat class="mt-4">
      <div class="pa-8">
        <v-layout row>
          <v-flex xs3 md2>
            <label class="font-weight-bold">Legal Name</label>
            <ActionChipShared
              v-if="isChanged"
              :actionable-item="{ action: ActionTypes.EDITED }"
              :editedLabel="editedLabel"
            />
          </v-flex>
          <v-flex xs9 md10>
            <span>{{formatName(completingParty) || "Unknown"}}</span>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { ActionChip as ActionChipShared } from '@bcrs-shared-components/action-chip/'
import { CommonMixin } from '@/mixins/'
import { ChgRegistrationFilingIF, IncorporationFilingIF, OrgPersonIF, RegistrationFilingIF }
  from '@/interfaces/'
import { ActionTypes, RoleTypes } from '@/enums/'

@Component({
  components: { ActionChipShared }
})
export default class CompletingParty extends Mixins(CommonMixin) {
  // Declaration for template
  readonly ActionTypes = ActionTypes

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  @Getter getPeopleAndRoles!: Array<OrgPersonIF>
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getOriginalChgRegistration!: ChgRegistrationFilingIF
  @Getter getOriginalRegistration!: RegistrationFilingIF

  /** The current Completing Party if found, otherwise undefined. */
  get completingParty () : OrgPersonIF {
    return this.getCompletingParty(this.getPeopleAndRoles)
  }

  /** The original Completing Party if found, otherwise undefined. */
  get originalCompletingParty () : OrgPersonIF {
    if (this.isCorrectionFiling && this.getOriginalIA?.incorporationApplication) {
      return this.getCompletingParty(this.getOriginalIA.incorporationApplication.parties)
    } else if (this.isCorrectionFiling && this.getOriginalChgRegistration?.changeOfRegistration) {
      return this.getCompletingParty(this.getOriginalChgRegistration.changeOfRegistration.parties)
    } else if (this.isCorrectionFiling && this.getOriginalRegistration?.registration) {
      return this.getCompletingParty(this.getOriginalRegistration.registration.parties)
    } else {
      return null
    }
  }

  /** True if the Completing Party has been changed. */
  get isChanged (): boolean {
    return (this.completingParty?.officer.id !== this.originalCompletingParty?.officer.id)
  }

  /**
   * Gets the Completing Party in a specified org/person list.
   * @param list The list to search.
   * @returns The Completing Party if found, otherwise undefined.
   */
  private getCompletingParty (list: OrgPersonIF[]): OrgPersonIF {
    const i = list?.findIndex(orgPerson =>
      orgPerson.roles.some(role =>
        role.roleType === RoleTypes.COMPLETING_PARTY
      )
    )
    return (i >= 0) ? list[i] : undefined
  }

  /**
   * Formats the org or person name for display.
   * @param filing The filing body which contains the name/title.
   * @returns The formatted org/person name.
   */
  private formatName (filing: any): string {
    if (filing?.officer?.organizationName) {
      return filing.officer.organizationName
    }
    if (filing?.officer) {
      return `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
    }
    return ''
  }
}
</script>
