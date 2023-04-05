import { FetcherRequest } from '../base/FetcherBase';
import { HttpFetcherConfig, HttpFetcherTarget } from '../base/HttpFetcherBase';

export type HttpJsonFetcherCallBackConfig<P> = {
  callBackProgress?: (config: FetcherRequest<HttpFetcherTarget, any, HttpFetcherConfig<HttpJsonFetcherCallBackConfig<P>>>, pipe: P) => void;
  callBackSuccess?: (config: FetcherRequest<HttpFetcherTarget, any, HttpFetcherConfig<HttpJsonFetcherCallBackConfig<P>>>, pipe: P) => void;
  callBackError?: (
    config: FetcherRequest<HttpFetcherTarget, any, HttpFetcherConfig<HttpJsonFetcherCallBackConfig<P>>>,
    pipe: P,
    e?: any
  ) => void;
  callBackFinal?: (
    config: FetcherRequest<HttpFetcherTarget, any, HttpFetcherConfig<HttpJsonFetcherCallBackConfig<P>>>,
    pipe: P,
    e?: any
  ) => void;
};
