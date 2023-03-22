import {
  Alteration,
  Change,
  Conversion,
  Correction,
  LimitedRestorationExtension,
  LimitedRestorationToFull,
  Signin,
  Signout,
  SpecialResolution
}
  from '@/views/'
import { FilingTypes, RouteNames } from '@/enums/'

export const routes = [
  {
    path: '/alteration',
    name: RouteNames.ALTERATION,
    component: Alteration,
    meta: {
      requiresAuth: true,
      isStaffOnly: false,
      filingType: FilingTypes.ALTERATION
    }
  },
  {
    path: '/change',
    name: RouteNames.CHANGE,
    component: Change,
    meta: {
      requiresAuth: true,
      isStaffOnly: false,
      filingType: FilingTypes.CHANGE_OF_REGISTRATION
    }
  },
  {
    path: '/conversion',
    name: RouteNames.CONVERSION,
    component: Conversion,
    meta: {
      requiresAuth: true,
      isStaffOnly: true,
      filingType: FilingTypes.CONVERSION
    }
  },
  {
    path: '/correction',
    name: RouteNames.CORRECTION,
    component: Correction,
    meta: {
      requiresAuth: true,
      isStaffOnly: true,
      filingType: FilingTypes.CORRECTION
    }
  },
  {
    path: '/limitedRestorationExtension',
    name: RouteNames.RESTORATION_EXTENSION,
    component: LimitedRestorationExtension,
    props: route => ({
      restorationId: +route.query['restoration-id'] || 0
    }),
    meta: {
      requiresAuth: true,
      isStaffOnly: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/limitedRestorationToFull',
    name: RouteNames.RESTORATION_CONVERSION,
    component: LimitedRestorationToFull,
    props: route => ({
      restorationId: +route.query['restoration-id'] || 0
    }),
    meta: {
      requiresAuth: true,
      isStaffOnly: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/special-resolution',
    name: RouteNames.SPECIAL_RESOLUTION,
    component: SpecialResolution,
    meta: {
      requiresAuth: true,
      isStaffOnly: false,
      filingType: FilingTypes.SPECIAL_RESOLUTION
    }
  },
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
    // fallback route
    // must be last
    path: '*',
    redirect: '/correction' // arbitrary default route
  }
]
