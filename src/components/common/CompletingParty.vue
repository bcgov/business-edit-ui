<template>
  <section id="completing-party-section">
    <header>
      <h2>Original Completing Party</h2>
    </header>

    <v-card flat class="mt-4">
      <div class="pa-8">
        <v-layout row>
          <v-flex xs3 md2>
            <label class="font-weight-bold">Legal Name</label>
            <action-chip v-if="corrected" :actionable-item="{ action: ActionTypes.EDITED }" />
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
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { ActionChip } from '@/components/common'
import { IncorporationFilingIF, OrgPersonIF } from '@/interfaces'
import { ActionTypes, Roles } from '@/enums'

@Component({
  components: { ActionChip }
})
export default class CompletingParty extends Vue {
  // Declaration for template
  readonly ActionTypes = ActionTypes

  @Getter getPeopleAndRoles!: Array<OrgPersonIF>
  @Getter getOriginalIA!: IncorporationFilingIF

  /** The current Completing Party if found, otherwise undefined. */
  private get completingParty () : OrgPersonIF {
    return this.getCompletingParty(this.getPeopleAndRoles)
  }

  /** The original Completing Party if found, otherwise undefined. */
  private get originalCompletingParty () : OrgPersonIF {
    return this.getCompletingParty(this.getOriginalIA?.incorporationApplication?.parties)
  }

  /** True if the Completing Party has been corrected. */
  private get corrected (): boolean {
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
        role.roleType === Roles.COMPLETING_PARTY
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
    if (filing?.officer?.orgName) {
      return filing.officer.orgName
    }
    if (filing?.officer) {
      return `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
</style>
