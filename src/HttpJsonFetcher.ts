import { HttpJsonFetcherBase, HttpJsonFetcherConfig } from './base/HttpJsonFetcherBase';
import { HttpFetcherTarget, HttpFetcherConfig } from './base/HttpFetcherBase';
import { FetcherRequest } from './base/FetcherBase';
import { HttpJsonFetcherCallBackConfig } from './types/HttpJsonFetcherCallBackConfig';

export type HttpJsonFetcherPipe = {};
export type HttpJsonFetcherDetailConfig = {} & HttpJsonFetcherCallBackConfig<HttpJsonFetcherPipe>;

export class HttpJsonFetcher extends HttpJsonFetcherBase<HttpJsonFetcherDetailConfig, HttpJsonFetcherPipe>{
  constructor(private config?: {
    afterSuccess?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe) => void;
    afterSuccessTransform?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe) => void;
    before?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe) => void;
    error?: <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe) => void;
    finally? : <T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe) => void;
  }) {
    super();
  }
  protected afterSuccess<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig>, T>, pipe: HttpJsonFetcherPipe): void {
    this.config?.afterSuccess?.(config, pipe);
    config.config?.config?.callBackSuccess?.(config, pipe);
  }

  protected afterSuccessTransform<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig, HttpJsonFetcherPipe>, T>, pipe: HttpJsonFetcherPipe): void {
    this.config?.afterSuccessTransform?.(config, pipe);
  }

  protected before<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig, HttpJsonFetcherPipe>, T>, pipe: HttpJsonFetcherPipe): void {
    this.config?.before?.(config, pipe);
    config.config?.config?.callBackProgress?.(config, pipe);
  }

  protected error<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig, HttpJsonFetcherPipe>, T>, pipe: HttpJsonFetcherPipe, e: any): void {
    this.config?.error?.(config, pipe);
    config.config?.config?.callBackError?.(config, pipe, e);
  }

  protected finally<T>(config: FetcherRequest<HttpFetcherTarget, Response, HttpFetcherConfig<HttpJsonFetcherDetailConfig, HttpJsonFetcherPipe>, T>, pipe: HttpJsonFetcherPipe): void {
    this.config?.finally?.(config, pipe);
    config.config?.config?.callBackFinal?.(config, pipe)
  }

}
