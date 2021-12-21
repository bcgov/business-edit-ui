<template>
  <div id="entity-info">
    <v-container class="py-2 pb-6">
      <div class="d-flex justify-space-between mt-5">
        <div class="left-column align-self-end">
          <div class="title-container">
            <span id="entity-legal-name">{{ getCurrentBusinessName || 'Numbered Benefit Company' }}</span>
          </div>

          <dl class="business-info">
            <dd id="entity-legal-type">{{originalEntityType}}</dd>
            <dt class="mr-2">Business No:</dt>
            <dd id="entity-business-number">{{ getBusinessNumber || 'Not Available' }}</dd>
            <dt class="mr-2">Incorporation No:</dt>
            <dd id="entity-incorp-number">{{ getBusinessInformation.identifier }}</dd>
          </dl>
        </div>

        <div class="right-column text-right align-self-end">
          <dl class="profile-info">
            <dt><span class="sr-only mr-2">Business Email:</span></dt>
            <dd id="entity-business-email">{{getBusinessContact.email || 'Unknown Email'}}</dd>
            <template v-if="getBusinessContact.phone">
              <dt><span class="sr-only mr-2">Business Phone:</span></dt>
              <dd id="entity-business-phone">{{getBusinessContact.phone}}</dd>
            </template>
          </dl>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CommonMixin, EnumMixin } from '@/mixins'
import { BusinessInformationIF, BusinessSnapshotIF, IncorporationFilingIF } from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'
import { CorpTypeCd } from '@/enums'

@Component({})
export default class EntityInfo extends Mixins(CommonMixin, EnumMixin) {
  // Global getters
  @Getter getBusinessId!: string
  @Getter getBusinessNumber!: string
  @Getter getCurrentBusinessName!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter isRoleStaff!: boolean
  @Getter getBusinessContact!: ContactPointIF
  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getBusinessSnapshot!: BusinessSnapshotIF
  @Getter isCorrectionFiling!: boolean

  /** Get original entity type. */
  private get originalEntityType (): string {
    return this.getCorpTypeDescription(this.isCorrectionFiling
      ? this.getOriginalIA?.business?.legalType
      : this.getBusinessSnapshot?.businessInfo?.legalType
    )
  }

  /** The route breadcrumbs list. */
  private get breadcrumbs (): Array<any> {
    return [
      {
        text: this.isRoleStaff ? 'Staff Dashboard' : 'Manage Businesses Dashboard',
        disabled: false,
        href: `${sessionStorage.getItem('AUTH_WEB_URL')}business`
      },
      {
        text: this.getCurrentBusinessName || 'Numbered Benefit Company',
        disabled: false,
        href: `${sessionStorage.getItem('DASHBOARD_URL')}${this.getBusinessId}`
      },
      {
        text: this.entityTitle,
        disabled: false
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#entity-info {
  background: $BCgovInputBG;
}

.v-breadcrumbs li {
  font-size: 0.75rem;
}

::v-deep {
  .v-breadcrumbs a {
    color: $gray8 !important;
  }

  .v-breadcrumbs a:hover {
    color: $BCgovABlue3 !important;
  }
}

.title-container {
  font-size: 1.125rem;
  font-weight: bold;
  color: black;
}

.business-info,
.profile-info {
  font-size: 1rem;
}

dl {
  display: inline-block;
  overflow: hidden;
  color: $gray6;
}

dd, dt {
  float: left;
}

dd + dt:before {
  content: "•";
  display: inline-block;
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}
</style>
