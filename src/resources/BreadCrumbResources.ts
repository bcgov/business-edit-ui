import { BreadcrumbIF } from '@bcrs-shared-components/interfaces/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId = store.getAccountId || 0
  return accountId ? `?accountid=${accountId}` : ''
}

/** Returns the breadcrumb to the entity (business) dashboard. */
export function getEntityDashboardBreadcrumb (): BreadcrumbIF {
  const getOriginalLegalName = store.getOriginalLegalName
  const getBusinessId = store.getBusinessId
  return {
    text: getOriginalLegalName || 'Numbered Benefit Company',
    href: `${sessionStorage.getItem('DASHBOARD_URL')}${getBusinessId}/${getParams()}`
  }
}

/** Returns the breadcrumb to the BC Registries dashboard. */
export function getRegistryDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'BC Registries Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

/** Returns the breadcrumb to the My Business Registry page. */
export function getMyBusinessRegistryBreadcrumb (): BreadcrumbIF {
  return {
    text: 'My Business Registry',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}account/${store.getAccountId}/business`
  }
}

/** Returns the breadcrumb to the Staff dashboard. */
export function getStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}staff/dashboard/active`
  }
}
