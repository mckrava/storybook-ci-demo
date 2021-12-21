import { Resolver } from '@apollo/client';
import { useCallback } from 'react';
import { useBalanceQueryResolvers } from '../../balances/useBalanceQueryResolvers';
import { useResolverToRef } from './useAccountsMutationResolvers';
import { useVestingScheduleQueryResolvers } from '../../vesting/useVestingScheduleQueryResolvers';
import { useGetAccountsQueryResolver } from './useGetAccountsQueryResolver';

/**
 * Used to resolve queries for the `Account` (or `accounts`) entity.
 */
export const useAccountsQueryResolvers = () => {    
    const getAccountsQueryResolver = useGetAccountsQueryResolver();

    return {
        Query: {
            accounts: getAccountsQueryResolver
        },
        /**
         * Additional sub-resolvers for the `Account` entity,
         * resolving e.g. the `balances` or `vestingSchedules` fields.
         */
        Account: {
            ...useBalanceQueryResolvers(),
            ...useVestingScheduleQueryResolvers()
        }
    }
}