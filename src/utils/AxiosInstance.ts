import axios from 'axios'
import { SessionStorageKeys } from '@/sbc-common-components/src/util/constants'
import * as Sentry from '@sentry/browser'

const instance = axios.create()

instance.interceptors.request.use(
  config => {
    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    config.headers.common['Authorization'] = `Bearer ${kcToken}`
    return config
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
