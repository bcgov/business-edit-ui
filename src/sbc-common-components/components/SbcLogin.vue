<template>
  <v-container class="view-container">
    <v-row justify="center">
      <v-col class="text-center">
        <div class="mt-5 mb-10 font-weight-bold">
          <h1>BC Registries Account Login</h1>
        </div>
        <v-card
          class="mx-auto"
          max-width="460"
        >
          <v-card-title>
            <v-img
              max-height="260"
              src="~sbc-common-components/src/assets/img/BCReg_Generic_Login_image.jpg"
              alt="Generic Login Image"
            />
          </v-card-title>
          <v-card-text>
            <v-menu anchor="center">
              <template #activator="{ props }">
                <v-btn
                  id="loginBtn"
                  class="mt-2 mx-auto"
                  color="primary"
                  size="large"
                  aria-label="log in"
                  v-bind="props"
                >
                  <span>Log in to my BC Registries Account</span>
                  <v-icon class="mr-n1 ml-2">
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <sbc-auth-menu
                :fromLogin="true"
                :redirect-on-login-success="props.redirectUrl"
              />
            </v-menu>
            <div class="mb-12" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SbcAuthMenu from './SbcAuthMenu.vue'

const props = defineProps({
  redirectUrl: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
@import '~sbc-common-components/src/assets/scss/theme.scss';
#loginBtn {
  background-color: $BCgovBlue5 !important
}
</style>
