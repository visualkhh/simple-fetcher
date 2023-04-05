import { FetcherBase, FetcherRequest } from './FetcherBase';
export type HttpFetcherTarget =
  | URL
  | string
  | { url: URL | string; searchParams?: { [key: string]: any } | URLSearchParams | FormData };
export type HttpFetcherConfig<CONFIG, RESPONSE = Response> = {
  fetch?: RequestInit;
  config?: CONFIG;
  allowedResponseNotOk?: boolean;
  fetchResponseBeforeCallBack?: (config: HttpFetcherConfig<CONFIG, RESPONSE>) => void;
  fetchResponseAfterCallBack?: (data: Response, config: HttpFetcherConfig<CONFIG, RESPONSE>) => void;
  hasResponseErrorChecker?: (data: Response, config: HttpFetcherConfig<CONFIG, RESPONSE>) => any;
};
export abstract class HttpFetcherBase<
  CONFIG,
  RESPONSE = Response,
  PIPE extends { responseData?: RESPONSE | undefined } = any
> extends FetcherBase<HttpFetcherTarget, RESPONSE, HttpFetcherConfig<CONFIG, RESPONSE>, PIPE> {
  get<T = RESPONSE>(
    config: FetcherRequest<HttpFetcherTarget, RESPONSE, HttpFetcherConfig<CONFIG, RESPONSE>, T>
  ): Promise<T> {
    config.config ??= {};
    config.config.fetch = config.config?.fetch ?? {};
    config.config.fetch.method = 'GET';
    return this.fetch(config);
  }

  post<T = RESPONSE>(
    config: FetcherRequest<HttpFetcherTarget, RESPONSE, HttpFetcherConfig<CONFIG, RESPONSE>, T>
  ): Promise<T> {
    config.config ??= {};
    config.config.fetch = config.config?.fetch ?? {};
    config.config.fetch.method = 'POST';
    return this.fetch(config);
  }

  put<T = RESPONSE>(
    config: FetcherRequest<HttpFetcherTarget, RESPONSE, HttpFetcherConfig<CONFIG, RESPONSE>, T>
  ): Promise<T> {
    config.config ??= {};
    config.config.fetch = config.config?.fetch ?? {};
    config.config.fetch.method = 'PUT';
    return this.fetch(config);
  }

  delete<T = RESPONSE>(
    config: FetcherRequest<HttpFetcherTarget, RESPONSE, HttpFetcherConfig<CONFIG, RESPONSE>, T>
  ): Promise<T> {
    config.config ??= {};
    config.config.fetch = config.config?.fetch ?? {};
    config.config.fetch.method = 'DELETE';
    return this.fetch(config);
  }

  protected beforeFetch(requestInfo: RequestInfo | URL, init?: RequestInit): void {}
  protected afterFetch(response: Response): void {}

  protected execute(target: HttpFetcherTarget, config?: HttpFetcherConfig<CONFIG, RESPONSE>): Promise<any | RESPONSE> {
    // target data setting
    if (!(target instanceof URL) && typeof target !== 'string') {
      const url = typeof target.url === 'string' ? new URL(target.url) : target.url;
      if (typeof target.searchParams === 'string') {
        new URLSearchParams(target.searchParams).forEach((value, key) => {
          url.searchParams.append(key, value);
        });
      } else if (typeof target.searchParams === 'object') {
        let body = target.searchParams;
        if (typeof FormData !== 'undefined' && body instanceof FormData) {
          body = this.formDataToFormDataEntryValueObj(body);
        }
        for (const [k, v] of Object.entries(body)) {
          if (Array.isArray(v)) {
            v.forEach(it => url.searchParams.append(k, it));
          } else {
            url.searchParams.append(k, v as any);
          }
        }
      }
      target = url;
    }
    config?.fetchResponseBeforeCallBack?.(config);
    this.beforeFetch(target, config?.fetch);
    return fetch(target, config?.fetch).then(it => {
      this.afterFetch(it);
      config?.fetchResponseAfterCallBack?.(it, config);
      if (!config?.allowedResponseNotOk && !it.ok) {
        throw it;
      }
      const data = config?.hasResponseErrorChecker?.(it, config);
      if (data) {
        throw data;
      }
      return it;
    });
  }


  private formDataToFormDataEntryValueObj<T = { [key: string]: FormDataEntryValue | FormDataEntryValue[] }>(
    data: FormData | HTMLFormElement
  ): T {
    if (data instanceof HTMLFormElement) {
      data = new FormData(data);
    }
    const obj: any = {};
    data.forEach((value, key) => {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else if (obj[key] !== undefined || !isNaN(obj[key])) {
        obj[key] = [obj[key], value];
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }
}
