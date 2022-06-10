<template>
  <div />
</template>

<script lang="ts">
import { navigate } from '@/utils/'
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Signin extends Vue {
  protected created (): void {
    // navigate to BC Registry login page then return to this app
    const loginUrl = sessionStorage.getItem('REGISTRY_HOME_URL') + 'login'
    const baseUrl = sessionStorage.getItem('BASE_URL').replace(/\/$/, '') // remove trailing /
    const redirect = this.$route.query.redirect
    const returnUrl = encodeURIComponent(baseUrl + redirect)
    navigate(`${loginUrl}?return=${returnUrl}`)
  }
}
</script>
