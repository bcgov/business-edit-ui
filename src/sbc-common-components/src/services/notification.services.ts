/* eslint-disable no-multi-str */
import Axios, { AxiosResponse } from 'axios'
import ConfigHelper from '../util/config-helper'
import { addAxiosInterceptors } from '../util/interceptors'
import { Notifications } from '../models/notification'

const axios = addAxiosInterceptors(Axios.create())

export default class NotificationService {
  static async getNotifications (): Promise<AxiosResponse<Notifications>> {
    return axios.get(`${ConfigHelper.getStatusAPIUrl()}/whatsnew`)
  }
}
