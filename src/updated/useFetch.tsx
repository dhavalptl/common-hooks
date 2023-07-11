import { useEffect, useState, useRef } from "react";

export type FetchReturn<T, E> = {
    data: T | null,
    pending: boolean,
    error: E | null,
    execute: (params?: any) => void
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

/**
 * Custom fetch hook
 * @param url - fetch function url
 * @param options - fetch request options like method type, headers and body
 * @param immediate - execute fetch immediatly, if set false then manually run fetch using execute method
 * @param resetData - before run fetch, require to reset existing data
 * @returns it return fetch progress, error, data and execute method
 */
export const useFetch = <T, E = string>(url: string, options?: RequestInit, immediate = true, resetData = true): FetchReturn<T, E> => {
    const [pending, setPending] = useState<boolean>(false);
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<E | null>(null)
    const [startManualExecute, setStartManualExecute] = useState<boolean>(false);
    const [requestParams, setRequestParams] = useState<string | undefined>();
    const [requestParamsUrl, setRequestParamsUrl] = useState<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);

    async function fetchData(abortController: AbortController, requestBody?: string, paramsUrl = '') {
        resetData && setData(null);
        setPending(true);
        try {
            const response = await fetch(paramsUrl ? `${url}?${paramsUrl}`: url, {
                ...options,
                body: requestBody || options?.body,
                signal: abortController.signal,
            })
            if (!response.ok) {
                // Http2 response not return status text
                throw new Error(getErrorMessageFromStatus(response.status))
            }
            const data = (await response.json()) as T
            !abortController.signal.aborted && setData(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if(!abortController.signal.aborted) {
                if(error instanceof SyntaxError) {
                    setError('Unable to parse response' as E);
                } else {
                    setError(error.message);
                }
            }
        } finally {
            !abortController.signal.aborted && setPending(false);
        }
    }

    function execute(requestParams?: any, paramsUrl?: string) {
        resetData && setData(null);
        setRequestParams(requestParams ? JSON.stringify(requestParams) : undefined);
        paramsUrl && setRequestParamsUrl(paramsUrl);
        setStartManualExecute(true);
    }

    useEffect(() => {
        if(startManualExecute) {
            setStartManualExecute(false);
            abortControllerRef.current = new AbortController();
            fetchData(abortControllerRef.current, requestParams, requestParamsUrl);   
        }
        return () => {
            !startManualExecute && abortControllerRef.current && abortControllerRef.current.abort()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, startManualExecute, requestParams, requestParamsUrl])

    useEffect(() => {
        if(immediate) {
            abortControllerRef.current = new AbortController();
            fetchData(abortControllerRef.current);   
        }
        return () => {
            immediate && abortControllerRef.current && abortControllerRef.current.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, immediate])

    return { data, pending, error, execute } 
}