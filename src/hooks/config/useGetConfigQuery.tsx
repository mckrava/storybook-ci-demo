import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../generated/graphql';

export const GET_CONFIG = loader('./graphql/GetConfig.query.graphql');

export interface GetConfigQueryResponse {
    config: Query['config']
}

export const useGetConfigQuery = () => useQuery<GetConfigQueryResponse>(GET_CONFIG, {
    notifyOnNetworkStatusChange: true
});