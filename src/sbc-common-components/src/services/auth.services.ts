import Axios from 'axios'
const AUTHENTICATION_RESOURCE_NAME = 'logout'

export default {
  logout (refreshToken, authApiUrl) {
    return Axios.post(authApiUrl + AUTHENTICATION_RESOURCE_NAME, { refresh_token: refreshToken })
  }
}
