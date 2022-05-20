import { dedupExchange, errorExchange, fetchExchange } from 'urql';
import {
	LogoutMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	RegisterMutation,
} from '../generated/graphql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { UpdateQueryWrapper } from './updateQueryWrapper';
import Router from 'next/router';

const createGraphQLClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: {
		credentials: 'include' as const,
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					logout: (_result, args, cache) => {
						UpdateQueryWrapper<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							() => ({
								me: null,
							})
						);
					},
					login: (_result, args, cache) => {
						UpdateQueryWrapper<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								if (result.login.errors) {
									return query;
								}
								return { me: result.login.user };
							}
						);
					},
					register: (_result, args, cache) => {
						UpdateQueryWrapper<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								if (result.register.errors) {
									return query;
								}
								return { me: result.register.user };
							}
						);
					},
				},
			},
		}),
		ssrExchange,
		errorExchange({
			onError(error) {
				if (error?.message.includes('not authenticated')) {
					Router.replace('/login');
				}
			},
		}),
		fetchExchange,
	],
});

export default createGraphQLClient;
