export interface IApiResult<T> {
  status: number;
  message: string;
  data: T;
}
