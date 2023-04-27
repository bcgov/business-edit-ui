import ConfigHelper from './config-helper'
import { SessionStorageKeys, ACCOUNT_ID } from './constants'

/**
 * Place to put all the custom utility methods
 */
export function getBoolean (value: boolean | string | number): boolean {
  var resultVal = value
  if (typeof value === 'string') {
    resultVal = value.toLowerCase()
  }
  switch (resultVal) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
    case 'none':
      return true
    default:
      return false
  }
}

export function decodeKCToken () {
  try {
    const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken)
    if (token) {
      const base64Url = token.split('.')[1]
      const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(base64)
    } else {
      return {}
    }
  } catch (error) {
    throw new Error('Error parsing JWT - ' + error)
  }
}

export function trimTrailingSlashURL (url) {
  return (url) ? url.trim().replace(/\/+$/, '') : ''
}

export function getAccountIdFromCurrentUrl () {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(ACCOUNT_ID) || false
}

export function checkAndAppend (url, key = '', value = '') {
  const separator = (/\?/).test(url) ? '&' : '?'
  // remove key from URL  if existing
  const newUrl = removeAccountIdFromUrl(url, key)
  return (value !== '' && key !== '') ? `${newUrl}${separator}${key}=${value}` : url
}

// if account id is not passed, will get it from session
// there are some cases we need to pass account id, ie  to watch account id and get URL dynamically
export function appendAccountId (url, accountId = '') {
  const sessionAccountId = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.CurrentAccount) || '{}').id || ''
  const currentAccount = accountId !== '' ? accountId : sessionAccountId
  return checkAndAppend(url, ACCOUNT_ID, currentAccount)
}

export function removeAccountIdFromUrl (url, key = ACCOUNT_ID) {
  // replacing account id and formattig ie, removing extra ? or &
  return url?.replace(new RegExp(key + '=\\w+'), '').replace('?&', '?').replace(/\?$/, '')
    .replace('&&', '&').replace(/&$/, '')
}
