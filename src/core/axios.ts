import dispatchRequest from './index'
import {
  Axios as AxiosInterface,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  Method
} from '../types'

export class Axios implements AxiosInterface {
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config)
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }
  put(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }
  post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }
  patch(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }

  private _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  private _requestWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}

function getAxios(): AxiosInstance {
  const context = new Axios()
  const axios: AxiosInstance = Axios.prototype.request.bind(context) as any

  axios.get = Axios.prototype.get.bind(context)

  return axios
}

const axios = getAxios()
export default axios
