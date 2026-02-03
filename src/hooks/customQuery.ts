import {
  type MutationFunction,
  type QueryFunction,
  type QueryKey,
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  TUseMutationCustomOptions,
  TUseQueryCustomOptions,
} from "@/types/common/common";

import { queryClient } from "@/lib/queryClient";

export function useCoreQuery<TQueryFnData, TData = TQueryFnData>(
  keyName: QueryKey,
  query: QueryFunction<TQueryFnData, QueryKey>,
  options?: TUseQueryCustomOptions<TQueryFnData, TData>,
): UseQueryResult<TData, AxiosError> {
  return useQuery({
    queryKey: keyName,
    queryFn: query,
    ...options,
  });
}

export function useCoreMutation<
  TData,
  TVariables,
  TError = AxiosError<{ message?: string }>,
  TContext extends { prevData?: unknown } = { prevData?: unknown },
  TCache = unknown,
>(
  mutation: MutationFunction<TData, TVariables>,
  options?: TUseMutationCustomOptions<
    TData,
    TVariables,
    TError,
    TContext,
    TCache
  >,
) {
  const {
    optimisticUpdate,
    invalidateKeys,
    userOnError,
    userOnSuccess,
    ...rest
  } = options ?? {};

  return useMutation<TData, TError, TVariables, TContext | undefined>({
    mutationFn: mutation,
    onMutate: async (vars): Promise<TContext | undefined> => {
      if (!optimisticUpdate) return undefined;

      await queryClient.cancelQueries({ queryKey: optimisticUpdate.key });

      const prevData = queryClient.getQueryData<TCache>(optimisticUpdate.key);

      queryClient.setQueryData<TCache>(
        optimisticUpdate.key,
        (old: TCache | undefined) =>
          optimisticUpdate.updateFn(old as TCache | undefined, vars),
      );

      return { prevData } as TContext;
    },

    onError: (error, vars, ctx) => {
      if (optimisticUpdate && ctx?.prevData !== undefined) {
        queryClient.setQueryData<TCache>(
          optimisticUpdate.key,
          ctx.prevData as TCache,
        );
      }
      userOnError?.(error, vars, ctx);
    },

    onSuccess: async (data, vars, ctx) => {
      if (invalidateKeys?.length) {
        await Promise.all(
          invalidateKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        );
      }
      userOnSuccess?.(data, vars, ctx);
    },
    ...rest,
  });
}
