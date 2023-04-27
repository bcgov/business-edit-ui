import { Component, Vue } from 'vue-property-decorator'
import ConfigHelper from '../util/config-helper'

@Component({})
export default class NavigationMixin extends Vue {
  protected redirectToPath (inAuth: boolean, routePath: string) {
    if (inAuth) {
      this.redirectInTriggeredApp(routePath)
    } else {
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }

  protected redirectInTriggeredApp (routePath: string) {
    const resolvedRoutes = this.$router.resolve({ path: `/${routePath}` })
    if (resolvedRoutes.resolved.matched.length > 0) {
      this.$router.push(`/${routePath}`)
    } else {
      // navigate to auth app if route is not found in the triggered app
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }
}
