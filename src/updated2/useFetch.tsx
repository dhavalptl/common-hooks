import { useEffect, useRef, useCallback, useReducer, Reducer } from "react";
export type STATUS = 'idle' | 'pending' | 'success' | 'error';

export type FetchReturn<T, P, E> = {
    data: T | null,
    status: STATUS,
    error: E | null,
    execute: (requestParams?: P, paramsUrl?: string) => void,
    reset: () => void;
}

export const COMMON_ERROR_MSG = 'Unable to process a request, please try again';

export function getErrorMessageFromStatus(status: number): string {
    switch (status) {
        case 400:
            return 'Bad request, please enter require details then try again';
        case 401:
        case 403:
            return 'Unauthorized to access';
        case 500:
        case 502:
        case 503:
        case 504:
        default:
            return COMMON_ERROR_MSG;
    }
}

export const initialState = {
    status: 'idle' as STATUS,
    error: null,
    data: null
};

type State<T, E> = {
  status: STATUS,
  error: E | null,
  data: T | null;
}
enum ActionType {
    pending = 'pending',
    resolve = 'resolve',
    rejected = 'rejected',
    reset = 'reset'
}

type Actions<T,E> = {
    type: ActionType.pending | ActionType.reset
} | {
    type: ActionType.resolve
    payload: T
} | {
    type: ActionType.rejected
    payload: E;
}


export function fetchReducer<T,E>(state: State<T,E>, action: Actions<T,E>): State<T,E> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    console.log(`Fetch Action : ${(action.type).toUpperCase()}, payload : ${JSON.stringify(action?.payload)}`);
    switch (action.type) {
      case ActionType.pending: {
        return {
          ...state,
          status: 'pending',
          data: null,
          error: null
        }
      }
      case ActionType.resolve: {
        return {
          ...state,
          data: action.payload,
          status: 'success',
          error: null
        }
      }
      case ActionType.rejected: {
          return {
              ...state,
              status: 'error',
              error: action.payload
          }
      }
      case ActionType.reset: {
        return initialState;
     }
      default: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        throw new Error(`Unknown action: ${action?.type}`);
      }
    }
  }
  

export async function httpRequest<T, E>(dispatch: React.Dispatch<Actions<T, E>>, url: string, options?: RequestInit) {
    try {
        dispatch({type: ActionType.pending});
        const response = await fetch(url, options)
        if (!response.ok) {
            // Http2 response not return status text
            throw new Error(response.statusText || 'Bad response')
        }
        if(!options?.signal?.aborted) {
            dispatch({type: ActionType.resolve, payload: (await response.json()) as T});
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if(!options?.signal?.aborted) {
            let errorText = error.message;
            if(error instanceof SyntaxError) {
                errorText = 'Unable to parse response' as E;
            }
            dispatch({type: ActionType.rejected, payload: errorText});
        }
    }
}

/**
 * Custom fetch hook
 * @param url - fetch function url
 * @param options - fetch request options like method type, headers and body
 * @param immediate - execute fetch immediatly, if set false then manually run fetch using execute method
 * @param resetData - before run fetch, require to reset existing data
 * @returns it return fetch progress, error, data and execute method
 */
export const useFetch = <T, P, E = string>(url: string, options?: RequestInit, immediate = true): FetchReturn<T, P, E> => {
    const [{data, status, error},dispatch] = useReducer<Reducer<State<T,E>, Actions<T,E>>>(fetchReducer, initialState);
    const abortControllerRef = useRef<AbortController | null>(null);

    const execute = useCallback((requestParams?: P, paramsUrl?: string) => {
        abortControllerRef.current && abortControllerRef.current.abort()
        abortControllerRef.current = new AbortController();
        const updatedUrl = paramsUrl ? `${url}?${paramsUrl}` : url;
        const updatedOptions = {
            ...options,
            body: JSON.stringify(requestParams) || options?.body,
            signal: abortControllerRef.current.signal,
        
        }
        httpRequest(dispatch, updatedUrl, updatedOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])


    const reset = useCallback(() => {
        dispatch({
            type: ActionType.reset,
        });
    }, [dispatch])


    useEffect(() => {
        if(immediate) {
            execute();
        }
    }, [immediate, execute])

    return { data, status, error, execute, reset } 
}