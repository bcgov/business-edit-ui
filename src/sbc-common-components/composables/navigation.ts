// External
import { useRouter } from 'vue-router'
// BC Registry
import ConfigHelper from 'sbc-common-components/src/util/config-helper'

export const useNavigation = () => {
  const router = useRouter()

  const redirectToPath = (inAuth: boolean, routePath: string) => {
    if (inAuth) {
      redirectInTriggeredApp(routePath)
    } else {
      // prettier-ignore
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }

  const redirectInTriggeredApp = (routePath: string) => {
    const resolvedRoutes = router.resolve({ path: `/${routePath}` })
    if (resolvedRoutes.matched.length > 0) {
      router.push(`/${routePath}`)
    } else {
      // prettier-ignore
      // navigate to auth app if route is not found in the triggered app
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }

  const getContextPath = (): string => {
    let baseUrl = (router?.options?.history?.base) || ''
    baseUrl += (baseUrl.length && baseUrl[baseUrl.length - 1] !== '/') ? '/' : ''
    return baseUrl
  }

  return {
    getContextPath,
    redirectToPath
  }
}
