import Axios, { AxiosResponse } from 'axios'
import { ServiceStatus } from '../models'
import ConfigHelper from '../util/config-helper'

export default class StatusService {
  static getServiceStatus (serviceName: string): Promise<AxiosResponse<ServiceStatus>> {
    return Axios.get(`${ConfigHelper.getStatusAPIUrl()}/status/${serviceName}`)
  }
}
