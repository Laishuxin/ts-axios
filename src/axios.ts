import { Axios } from './core/axios'
import mergeConfig from './core/mergeConfig'
import defaultConfig from './default'
import { extend } from './helpers/utils'
import { AxiosRequestConfig, AxiosStatic } from './types'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  return instance as any
}

const axios = createInstance(defaultConfig)
axios.CancelToken = CancelToken
axios.isCancel = isCancel
axios.Cancel = Cancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

axios.create = function(config?: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaultConfig, config))
}

export default axios
