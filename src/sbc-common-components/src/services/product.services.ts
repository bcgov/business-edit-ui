import Axios, { AxiosResponse } from 'axios'
import ConfigHelper from '../util/config-helper'
import { addAxiosInterceptors } from '../util/interceptors'
import { Products } from '../models/product'

const axios = addAxiosInterceptors(Axios.create())

export default class AccountService {
  static getAllProducts (): Promise<AxiosResponse<Products>> {
    return axios.get(`${ConfigHelper.getAuthAPIUrl()}/products`)
  }
}
