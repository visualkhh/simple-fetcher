import { HttpFetcher, HttpJsonFetcher } from 'simple-fetcher';

new HttpFetcher().get({target: 'https://dummyjson.com/products/1'}).then(async it => {
  console.log(await it.json());
})
new HttpJsonFetcher().get<{id: number, title: string}>({target: 'https://dummyjson.com/products/1'}).then(async it => {
  console.log(it.title);
})
