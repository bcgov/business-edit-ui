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
      filingType: FilingTypes.ALTERATION,
      title: 'Company Information page'
    }
  },
  {
    path: '/change',
    name: RouteNames.CHANGE,
    component: Change,
    meta: {
      requiresAuth: true,
      filingType: FilingTypes.CHANGE_OF_REGISTRATION,
      title: 'Business Information'
    }
  },
  {
    path: '/conversion',
    name: RouteNames.CONVERSION,
    component: Conversion,
    meta: {
      requiresAuth: true,
      filingType: FilingTypes.CONVERSION,
      title: 'Record Conversion'
    }
  },
  {
    path: '/correction',
    name: RouteNames.CORRECTION,
    component: Correction,
    meta: {
      requiresAuth: true,
      filingType: FilingTypes.CORRECTION,
      title: 'Register Correction'
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
      filingType: FilingTypes.RESTORATION,
      title: 'Limited Restoration Extension'
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
      filingType: FilingTypes.RESTORATION,
      title: 'Conversion to Full Restoration'
    }
  },
  {
    path: '/special-resolution',
    name: RouteNames.SPECIAL_RESOLUTION,
    component: SpecialResolution,
    meta: {
      requiresAuth: true,
      filingType: FilingTypes.SPECIAL_RESOLUTION,
      title: 'Special Resolution'
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
