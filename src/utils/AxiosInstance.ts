import axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import * as Sentry from '@sentry/browser'

const instance = axios.create()

instance.interceptors.request.use(
  request => {
    if (request.url?.startsWith('https://minio')) {
      return request
    }
    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    request.headers.common['Authorization'] = `Bearer ${kcToken}`
    request.headers.common['App-Name'] = import.meta.env.APP_NAME
    return request
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => response,
  error => {
    Sentry.captureException(error)
    return Promise.reject(error)
  }
)

export { instance as AxiosInstance }
