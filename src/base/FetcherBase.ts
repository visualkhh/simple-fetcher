export type FetcherRequest<TARGET, RES, C, T = RES> = {
  target: TARGET;
  config?: C & { hasErrorChecker?: (data: RES) => any };
  transform?: (data: RES) => T;
  before?: () => void;
  error?: (e?: any) => void;
  afterSuccess?: () => void;
  finally?: () => void;
};

export abstract class FetcherBase<TARGET, RESPONSE, CONFIG, PIPE extends { responseData?: RESPONSE }> {
  protected createPipe<T = RESPONSE>(config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>): PIPE {
    return {} as PIPE;
  }
  protected abstract before<T = RESPONSE>(config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>, pipe: PIPE): void;
  protected abstract afterSuccess<T = RESPONSE>(config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>, pipe: PIPE): void;
  protected abstract afterSuccessTransform<T = RESPONSE>(
    config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>,
    pipe: PIPE
  ): void;
  protected abstract finally<T = RESPONSE>(config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>, pipe: PIPE): void;
  protected abstract error<T = RESPONSE>(
    config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>,
    pipe: PIPE,
    e?: any
  ): void;

  public fetch<T = RESPONSE>(config: FetcherRequest<TARGET, RESPONSE, CONFIG, T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const pipe = this.createPipe(config);
      Promise.resolve()
        .then(() => {
          this.before(config, pipe);
          config?.before?.();
        })
        .then(() => {
          return this.execute(config.target, config?.config);
        })
        .then(data => {
          const hasError = config.config?.hasErrorChecker?.(data);
          if (hasError) {
            throw hasError;
          }
          pipe.responseData = data;
          this.afterSuccess(config, pipe);
          config?.afterSuccess?.();
          const gdata = (config?.transform ? config.transform(data) : data) as T;
          this.afterSuccessTransform(config, pipe);
          resolve(gdata);
        })
        .catch(e => {
          this.error(config, pipe, e);
          config?.error?.();
          reject(e);
        })
        .finally(() => {
          this.finally(config, pipe);
          config?.finally?.();
        });
    });
  }

  protected abstract execute(target: TARGET, config?: CONFIG): Promise<RESPONSE>;
}
