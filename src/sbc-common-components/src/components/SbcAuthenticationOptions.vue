<template>
  <v-container class="view-container">
    <div class="view-header flex-column mb-9">
      <template v-if="isDialog">
        <v-row>
          <v-col cols="11">
            <h3>Log in to BC Registries</h3>
          </v-col>
          <v-col cols="1">
            <v-icon large color="primary" @click="emitClose()">mdi-close</v-icon>
          </v-col>
        </v-row>
        <p>
          Don't have a BC Registries account?
          <a @click="goToCreateAccount">
            <u>Create an account</u>
          </a>
        </p>
      </template>
      <template v-else>
        <h1 class="view-header__title">Log in to BC Registries</h1>
        <p class="mt-4 mb-0">
          Don't have a BC Registries account? <a class="text-decoration-underline" @click="goToCreateAccount">Create an account</a>
        </p>
      </template>
    </div>
    <v-row>
      <v-col
        sm="12"
        md="6"
        class="d-flex align-stretch"
        v-for="authOption in authOptions"
        :key="authOption.type"
      >
        <v-card
          flat
          outlined
          hover
          class="account-card text-center pa-10 elevation-2 d-flex"
          @click="selectAuthType(authOption)"
        >
          <div class="account-type d-flex flex-column">
            <div class="account-type__icon mb-8">
              <v-icon>{{authOption.icon}}</v-icon>
            </div>
            <div class="account-type__title mb-6">
              {{authOption.title}}
            </div>
            <div class="account-type__details mb-12">
              {{authOption.description}}
            </div>
            <div>
              <v-btn
                large
                depressed
                block
                color="primary"
                class="font-weight-bold"
                @click="selectAuthType(authOption)"
              >
                {{ authOption.btnLabel }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Emit } from 'vue-property-decorator'
import { IdpHint, LoginSource, Pages } from '../util/constants'
import NavigationMixin from '../mixins/navigation-mixin'

@Component({})
export default class SbcAuthenticationOptions extends NavigationMixin {
  @Prop({ default: '' }) redirectUrl!: string
  @Prop({ default: false }) inAuth!: boolean
  @Prop({ default: false }) isDialog!: boolean

  private authOptions = [
    {
      type: LoginSource.BCSC,
      title: 'BC Services Card',
      description: `Residents of British Columbia can use their government-issued
                BC Services Card to securly access BC Registries.`,
      icon: 'mdi-account-card-details-outline',
      btnLabel: 'Log in with BC Services Card',
      idpHint: IdpHint.BCSC
    },
    {
      type: LoginSource.BCEID,
      title: 'BCeID',
      description: `Non-BC residents and residents do not have a BC Services Card
                can use a BCeID account to securly access BC Registries.`,
      icon: 'mdi-two-factor-authentication',
      btnLabel: 'Log in with BCeID',
      idpHint: IdpHint.BCEID
    }
  ]

  private selectAuthType (authOption) {
    let signinRoute = `${Pages.SIGNIN}/${authOption.idpHint}`
    if (this.redirectUrl?.trim()) {
      signinRoute += `/${encodeURIComponent(this.redirectUrl.trim())}`
    }
    this.redirectInTriggeredApp(signinRoute)
  }

  private goToCreateAccount () {
    this.redirectToPath(this.inAuth, Pages.CHOOSE_AUTH_METHOD)
  }

  /**
   * Emits an event to the parent to close.
   */
  @Emit('close')
  private emitClose (): void {}
}
</script>

<style lang="scss" scoped>
  .view-container {
    max-width: 60rem;
  }

  .account-card {
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all ease-out 0.2s;

    &:hover {
      border-color: var(--v-primary-base) !important;

      .v-icon {
        color: var(--v-primary-base) !important;
      }
    }
  }

  .theme--light.v-card.v-card--outlined.active {
    border-color: var(--v-primary-base);
  }

  .account-card .v-icon {
    color: var(--v-primary-base) !important;
    font-size: 3rem !important;
  }

  .account-type {
    flex: 1 1 auto;
  }

  .account-type__icon {
    flex: 0 0 auto;
  }

  .account-type__title {
    flex: 0 0 auto;
    line-height: 1.75rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .account-type__details {
    flex: 1 1 auto;
  }
</style>
