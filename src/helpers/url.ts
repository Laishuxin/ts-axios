import { isObject, isDate, isArray } from './utils'

function encode(val: string): string {
  return (
    encodeURIComponent(val)
      // .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url

  // 1. hash
  const index = url.indexOf('#')
  if (index !== -1) {
    return buildURL(url.slice(0, index), params)
  }

  // example: parts = ['param1=1', 'param2=2']
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]

    let values = []
    if (isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(item => {
      if (item === null || item === undefined) return
      if (isDate(item)) {
        item = item.toISOString()
      } else if (isObject(item)) {
        item = JSON.stringify(item)
      }

      const encodedItem = encode(item)
      console.log('origin: ', item, ', encoded: ', encodedItem)
      parts.push(`${encode(key)}=${encode(item)}`)
    })
  })

  const seriesUrlString = parts.join('&')
  return url.includes('?') ? `${url}&${seriesUrlString}` : `${url}?${seriesUrlString}`
}
