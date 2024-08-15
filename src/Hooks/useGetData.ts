import { debounce } from '@mui/material';
import React from 'react';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type Params<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;
type Fetcher<ParamsType extends any[] = any[], ReturnType = any> = (...params: ParamsType) => Promise<ReturnType>;

const useGetData = <T extends Fetcher>(
    params: Params<T> & Array<any>,
    fetcher: T,
    otps?: {
        trigger?: any;
    }
): [UnwrapPromise<ReturnType<T>> | undefined, boolean] => {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<UnwrapPromise<ReturnType<T>>>();

    React.useEffect(() => {
        fetchData(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...params, otps?.trigger]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = React.useCallback(debounce((params: Params<T>) => {
        setLoading(true);
        fetcher(...params)
            .then((result) => setData(result))
            .finally(() => {setLoading(false)}); 
    }, 100), [])
    return [data, isLoading];
    
};

export default useGetData;
