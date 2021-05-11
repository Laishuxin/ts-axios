export interface Axios {
  defaults: AxiosRequestConfig

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

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  isCancel(val: any): boolean
  Cancel: CancelStatic
}

export interface AxiosTransformer {
  /**
   * Transform and return transformed data.
   */
  (data: any, headers?: any): any
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken

  [index: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  headers: any
  statusText: string
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

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

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface Canceler {
  (message: string): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message: string
}

export interface CancelStatic {
  new (message: string): Cancel
}
