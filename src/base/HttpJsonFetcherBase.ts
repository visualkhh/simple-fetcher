import { HttpFetcherBase, HttpFetcherConfig, HttpFetcherTarget } from './HttpFetcherBase';
import { FetcherRequest } from './FetcherBase';

export type HttpJsonFetcherConfig<C> = HttpFetcherConfig<C> & { noBody?: boolean };
type RequestJsonInit = Omit<RequestInit, 'body'> & { body?: any | BodyInit | null };
type HttpAnyBodyFetcherConfig<C> = Omit<HttpJsonFetcherConfig<C>, 'fetch'> & { fetch?: RequestJsonInit };

export abstract class HttpJsonFetcherBase<C, PIPE extends { responseData?: any }> extends HttpFetcherBase<C, any, PIPE> {
  private updateJsonFetchConfigAndData<R, T = R>(
    config: FetcherRequest<HttpFetcherTarget, R, HttpJsonFetcherConfig<C>, T>
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    };
    config.config ??= {};
    config.config.fetch ??= {};
    config.config.fetch.headers ??= {};
    config.config!.fetch!.headers = { ...config.config!.fetch?.headers, ...headers };
    if (config.config?.fetch?.body && typeof config.config?.fetch?.body !== 'string') {
      config.config.fetch.body = JSON.stringify(config.config.fetch.body);
    }
    return config;
  }

  get<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpJsonFetcherConfig<C>, T>): Promise<T> {
    return super.get(config);
  }

  delete<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpJsonFetcherConfig<C>, T>): Promise<T> {
    return super.delete(config);
  }

  post<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpJsonFetcherConfig<C>, T>): Promise<T> {
    return super.post(config);
  }

  put<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpJsonFetcherConfig<C>, T>): Promise<T> {
    return super.put(config);
  }

  postJson<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpAnyBodyFetcherConfig<C>, T>): Promise<T> {
    return super.post(this.updateJsonFetchConfigAndData(config));
  }

  putJson<R, T = R>(config: FetcherRequest<HttpFetcherTarget, R, HttpAnyBodyFetcherConfig<C>, T>): Promise<T> {
    return super.put(this.updateJsonFetchConfigAndData(config));
  }

  protected execute(target: HttpFetcherTarget, config?: HttpJsonFetcherConfig<C>): Promise<any> {
    return super.execute(target, config).then((it: Response) => {
      return config?.noBody ? it : it?.json?.();
    });
  }
}
