export interface Axios {
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: Header
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  headers: Header
  statusText: string
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface Header {
  [name: string]: string
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null | number
  request?: XMLHttpRequest
  response?: AxiosResponse
}

// As Request interceptor and response interceptor is quit different,
// we need to define generic interface for the feature.
export interface InterceptorManager<T /* = AxiosRequestConfig | AxiosResponse */> {
  /**
   * Add an interceptor and return its id.
   * @param resolved
   * @param rejected
   * @returns the interceptor id.
   */
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  /**
   * Remove an interceptor by its id.
   * @param id the interceptor id
   */
  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}
