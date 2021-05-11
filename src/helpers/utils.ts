interface URLOrigin {
  protocol: string
  host: string
}
const toString = Object.prototype.toString

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val !== 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isArray(val: any): val is Array<any> {
  return Array.isArray(val)
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as any)[key] = from[key]
  }
  return to as any
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (typeof obj === 'undefined') {
      return
    }
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      if (isPlainObject(val)) {
        result[key] = isPlainObject(result[key]) ? deepMerge(result[key], val) : deepMerge({}, val)
      } else {
        result[key] = val
      }
    })
  })
  return result
}

export function isURLSameOrigin(url: string): boolean {
  const destURLOrigin = resolveUrl(url)
  return (
    destURLOrigin.host === currentOrigin.host && destURLOrigin.protocol === currentOrigin.protocol
  )
}

export function isFormData(data: any): data is FormData {
  return typeof data !== 'undefined' && data instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

const hrefNode = document.createElement('a')
const currentOrigin = resolveUrl(window.location.href)

function resolveUrl(url: string): URLOrigin {
  hrefNode.setAttribute('href', url)
  return {
    protocol: hrefNode.protocol,
    host: hrefNode.host
  }
}
