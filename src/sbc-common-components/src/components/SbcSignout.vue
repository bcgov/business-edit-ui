<template>
  <loading-screen :is-loading="isLoading"></loading-screen>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import KeyCloakService from '../services/keycloak.services'
import LoadingScreen from './LoadingScreen.vue'

@Component({
  methods: {
  },
  components: {
    LoadingScreen
  }
})

export default class SbcSignout extends Vue {
  private isLoading = true

  @Prop({ default: '' }) redirectUrl!: string

  private async mounted () {
    await KeyCloakService.logout(this.redirectUrl ? decodeURIComponent(this.redirectUrl) : undefined)
  }
}
</script>

<style lang="scss" scoped>
</style>
