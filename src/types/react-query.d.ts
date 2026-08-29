// Type declarations for @tanstack/react-query
declare module '@tanstack/react-query' {
  import { QueryClient, QueryFunction, MutationFunction, QueryKey } from '@tanstack/react-query';
  
  export * from '@tanstack/react-query';
  
  export function useQuery<TData = unknown, TError = Error>(
    options: {
      queryKey: QueryKey;
      queryFn: QueryFunction<TData>;
      enabled?: boolean;
      staleTime?: number;
      cacheTime?: number;
      refetchOnWindowFocus?: boolean;
      refetchOnMount?: boolean | 'always';
      refetchOnReconnect?: boolean | 'always';
      retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
      retryDelay?: (retryAttempt: number) => number;
      onSuccess?: (data: TData) => void;
      onError?: (error: TError) => void;
      onSettled?: (data: TData | undefined, error: TError | null) => void;
      select?: (data: TData) => any;
      keepPreviousData?: boolean;
      notifyOnChangeProps?: Array<keyof InfiniteData<TData>> | 'all' | 'tracked';
      useErrorBoundary?: boolean | ((error: TError) => boolean);
    }
  );

  export function useMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
    options: {
      mutationFn: MutationFunction<TData, TVariables>;
      onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
      onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void | Promise<void>;
      onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void | Promise<void>;
      onSettled?: (
        data: TData | undefined,
        error: TError | null,
        variables: TVariables,
        context: TContext | undefined
      ) => void | Promise<void>;
      retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
      retryDelay?: (retryAttempt: number) => number;
      useErrorBoundary?: boolean | ((error: TError) => boolean);
    }
  );

  export function useQueryClient(): QueryClient;
  
  export const QueryClientProvider: React.Provider<QueryClient>;
  
  export function useIsFetching(queryKey?: QueryKey): number;
  
  export function useIsMutating(queryKey?: QueryKey): number;
  
  export function useInfiniteQuery<TData = unknown, TError = Error>(
    options: {
      queryKey: QueryKey;
      queryFn: (context: { pageParam?: unknown }) => Promise<TData>;
      getNextPageParam: (lastPage: TData, allPages: TData[]) => unknown;
      getPreviousPageParam?: (firstPage: TData, allPages: TData[][]) => unknown;
      initialData?: () => undefined;
      initialDataUpdatedAt?: number | (() => number | undefined);
      keepPreviousData?: boolean;
      staleTime?: number;
      cacheTime?: number;
      refetchOnWindowFocus?: boolean;
      refetchOnMount?: boolean | 'always';
      refetchOnReconnect?: boolean | 'always';
      retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
      retryDelay?: (retryAttempt: number) => number;
      onSuccess?: (data: InfiniteData<TData>) => void;
      onError?: (error: TError) => void;
      onSettled?: (data: InfiniteData<TData> | undefined, error: TError | null) => void;
      select?: (data: InfiniteData<TData>) => any;
      notifyOnChangeProps?: Array<keyof InfiniteData<TData>> | 'all' | 'tracked';
      useErrorBoundary?: boolean | ((error: TError) => boolean);
    }
  );

  export interface InfiniteData<TData> {
    pages: TData[];
    pageParams: unknown[];
  }
  
  export interface QueryObserverResult<TData = unknown, TError = Error> {
    data: TData | undefined;
    dataUpdatedAt: number;
    error: TError | null;
    errorUpdatedAt: number;
    failureCount: number;
    isError: boolean;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isLoadingError: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetchError: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isSuccess: boolean;
    refetch: () => Promise<QueryObserverResult<TData, TError>>;
    remove: () => void;
    status: 'idle' | 'loading' | 'error' | 'success';
  }
  
  export interface MutationResult<TData = unknown, TError = Error, TVariables = unknown, TContext = unknown> {
    context: TContext | undefined;
    data: TData | undefined;
    error: TError | null;
    failureCount: number;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isPaused: boolean;
    isSuccess: boolean;
    mutate: (variables: TVariables, options?: any) => void;
    mutateAsync: (variables: TVariables, options?: any) => Promise<TData>;
    reset: () => void;
    status: 'idle' | 'loading' | 'error' | 'success';
    variables: TVariables | undefined;
  }
}
