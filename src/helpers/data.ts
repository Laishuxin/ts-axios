import { isObject } from './utils'

export function transformRequest(data: any): any {
  if (isObject(data)) return JSON.stringify(data)
  return data
}

export function transformData(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {}
  }
  return data
}
