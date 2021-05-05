import { Axios } from './core/axios'
import { extend } from './helpers/utils'
import { AxiosInstance } from './types'

function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  return instance as any
}

const axios = createInstance()
export default axios
