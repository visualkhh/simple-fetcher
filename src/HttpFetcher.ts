import { HttpFetcherBase, HttpFetcherTarget, HttpFetcherConfig } from './base/HttpFetcherBase';
import { FetcherRequest } from './base/FetcherBase';
import { HttpJsonFetcherCallBackConfig } from './types/HttpJsonFetcherCallBackConfig';

export type HttpFetcherPipe = {};
export type HttpFetcherDetailConfig = {} & HttpJsonFetcherCallBackConfig<HttpFetcherPipe>;

export class HttpFetcher extends HttpFetcherBase<HttpFetcherDetailConfig, Response>{
  constructor(private config?: {
    afterSuccess?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe) => void;
    afterSuccessTransform?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe) => void;
    before?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe) => void;
    error?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe) => void;
    finally? : <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe) => void;
  }) {
    super();
  }
  protected afterSuccess<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig>, T>, pipe: HttpFetcherPipe): void {
    this.config?.afterSuccess?.(config, pipe);
    config.config?.config?.callBackSuccess?.(config, pipe);
  }

  protected afterSuccessTransform<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig, HttpFetcherPipe>, T>, pipe: HttpFetcherPipe): void {
    this.config?.afterSuccessTransform?.(config, pipe);
  }

  protected before<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig, HttpFetcherPipe>, T>, pipe: HttpFetcherPipe): void {
    this.config?.before?.(config, pipe);
    config.config?.config?.callBackProgress?.(config, pipe);
  }

  protected error<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig, HttpFetcherPipe>, T>, pipe: HttpFetcherPipe, e: any): void {
    this.config?.error?.(config, pipe);
    config.config?.config?.callBackError?.(config, pipe, e);
  }

  protected finally<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpFetcherDetailConfig, HttpFetcherPipe>, T>, pipe: HttpFetcherPipe): void {
    this.config?.finally?.(config, pipe);
    config.config?.config?.callBackFinal?.(config, pipe)
  }

}
