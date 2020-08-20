import { Signin, Signout, AddPeopleAndRoles, CreateShareStructure, DefineCompany, IncorporationAgreement,
  ReviewConfirm } from '@/views'
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
    path: '/define-company',
    name: RouteNames.DEFINE_COMPANY,
    component: DefineCompany,
    meta: {
      step: 1,
      label: 'Define Your Company',
      requiresAuth: true
    }
  },
  {
    path: '/add-people-roles',
    name: RouteNames.ADD_PEOPLE_AND_ROLES,
    component: AddPeopleAndRoles,
    meta: {
      step: 2,
      label: 'Add People and Roles',
      requiresAuth: true
    }
  },
  {
    path: '/create-share-structure',
    name: RouteNames.CREATE_SHARE_STRUCTURE,
    component: CreateShareStructure,
    meta: {
      step: 3,
      label: 'Create Share Structure',
      requiresAuth: true
    }
  },
  {
    path: '/incorporation-agreement',
    name: RouteNames.INCORPORATION_AGREEMENT,
    component: IncorporationAgreement,
    meta: {
      step: 4,
      label: 'Incorporation Agreement',
      requiresAuth: true
    }
  },
  {
    path: '/review-confirm',
    name: RouteNames.REVIEW_CONFIRM,
    component: ReviewConfirm,
    meta: {
      step: 5,
      label: 'Review and Confirm',
      requiresAuth: true
    }
  },
  {
    // default/fallback route
    // must be last
    path: '*',
    redirect: '/define-company'
  }
]
