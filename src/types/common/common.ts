import type {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

// API 공통 응답 타입
export interface ICommonResponse<T> {
  status: string;
  data: T;
}

export type TUseQueryCustomOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> = Omit<
  UseQueryOptions<TQueryFnData, AxiosError, TData, QueryKey>,
  "queryKey" | "queryFn"
>;

export type TUseMutationCustomOptions<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError,
  TContext = unknown,
  TCache = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn" | "onMutate" | "onError" | "onSuccess"
> & {
  optimisticUpdate?: {
    key: QueryKey;
    updateFn: (oldData: TCache | undefined, newData: TVariables) => TCache;
  };
  invalidateKeys?: QueryKey[];
  userOnError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined,
  ) => Promise<unknown> | unknown;
  userOnSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined,
  ) => Promise<unknown> | unknown;
};
