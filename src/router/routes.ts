import {
  Signin, Signout, Alteration, Correction
} from '@/views'
import { RouteNames } from '@/enums'

export const routes = [
  {
    // router.beforeEach() routes here:
    path: '/signin',
    name: RouteNames.SIGN_IN,
    component: Signin,
    meta: {
      requiresAuth: false
    }
  },
  {
    // SbcHeader.logout() redirects here:
    path: '/signout',
    name: RouteNames.SIGN_OUT,
    component: Signout,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/correction',
    name: RouteNames.CORRECTION,
    component: Correction,
    meta: {
      requiresAuth: true,
      isStaffOnly: true
    }
  },
  {
    path: '/alteration',
    name: RouteNames.ALTERATION,
    component: Alteration,
    meta: {
      requiresAuth: true,
      isStaffOnly: false
    }
  },
  {
    // default/fallback route
    // must be last
    path: '*',
    redirect: '/correction'
  }
]
