import Axios, { AxiosResponse } from 'axios'
import ConfigHelper from '../util/config-helper'
import { UserProfile } from '../models/UserProfile'
import { addAxiosInterceptors } from '../util/interceptors'

const axios = addAxiosInterceptors(Axios.create())

export default class UserService {
  static async getUserProfile (identifier: string): Promise<AxiosResponse<UserProfile>> {
    return axios.get(`${ConfigHelper.getAuthAPIUrl()}/users/${identifier}`)
  }

  static async updateUserProfile (): Promise<AxiosResponse<UserProfile>> {
    return axios.post(`${ConfigHelper.getAuthAPIUrl()}/users`, { 'isLogin': true })
  }
}
