import { BreadcrumbIF } from '@/interfaces/'
import { getVuexStore } from '@/store/'

const store = getVuexStore()

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId = sessionStorage.getItem('ACCOUNT_ID')
  return accountId ? `?accountid=${accountId}` : ''
}

export function getEntityDashboardBreadcrumb (): BreadcrumbIF {
  const getCurrentBusinessName = store.getters.getCurrentBusinessName as string
  const getBusinessId = store.getters.getBusinessId as string
  return {
    text: getCurrentBusinessName || 'Numbered Benefit Company',
    href: `${sessionStorage.getItem('DASHBOARD_URL')}${getBusinessId}/${getParams()}`
  }
}

export function getRegistryDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'BC Registries Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

export function getMyBusinessRegistryBreadcrumb (): BreadcrumbIF {
  return {
    text: 'My Business Registry',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}business/${getParams()}`
  }
}

export function getStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}staff/${getParams()}`
  }
}
