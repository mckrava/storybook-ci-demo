import { useQuery } from '@apollo/client'
import { Query } from '../../../generated/graphql';
import { loader } from 'graphql.macro';

export const GET_ACCOUNTS = loader('./../graphql/GetAccounts.query.graphql');
export interface GetAccountsQueryResponse {
    accounts: Query['accounts'],
    lastBlock: Query['lastBlock']
}

export const useGetAccountsQuery = () => useQuery<GetAccountsQueryResponse>(GET_ACCOUNTS, {
    notifyOnNetworkStatusChange: true,
});