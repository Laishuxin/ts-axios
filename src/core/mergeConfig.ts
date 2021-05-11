import { deepMerge, isPlainObject } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

/**
 * Core function: merge config by difference strategies.
 * @param config1
 * @param config2
 * @returns merged config
 * @example
 * config1 = {
 *  method: 'get',
 *  timeout: 0,
 *  headers: {
 *    common: {
 *      Accept: 'application/json, text/plain, *\/*'
 *    }
 *  }
 *}
 *
 *config2 = {
 *  url: '/config/post',
 *  method: 'post',
 *  data: {
 *    a: 1
 *  },
 *  headers: {
 *    test: '321'
 *  }
 *}
 *
 *merged = {
 *  url: '/config/post',
 *  method: 'post',
 *  data: {
 *    a: 1
 *  },
 *  timeout: 0,
 *  headers: {
 *    common: {
 *      Accept: 'application/json, text/plain, *\/*'
 *    }
 *    test: '321'
 *  }
 *}
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  config2 = config2 || {}
  const mergedConfig: AxiosRequestConfig = Object.create(null)

  //! Merge config2 first
  for (const key in config2) {
    mergeField(key, mergedConfig, config1, config2)
  }
  for (const key in config1) {
    if (!config2[key]) mergeField(key, mergedConfig, config1, config2)
  }

  return mergedConfig
}

// Merge strategies.
interface Strategy {
  (val1: any, val2: any): any
}
interface StrategyMap {
  [index: string]: Strategy
}
const strats: StrategyMap = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  return val2
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']
const stratKeysDeepMerge = ['headers', 'auth']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

function mergeField(
  key: string,
  dest: AxiosRequestConfig,
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig
) {
  const strat = strats[key] || defaultStrat
  dest[key] = strat(config1[key], config2[key])
}
