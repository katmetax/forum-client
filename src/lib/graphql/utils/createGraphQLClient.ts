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

import { stringifyVariables } from '@urql/core';
import { Resolver } from '../types';

export type MergeMode = 'before' | 'after';

export interface PaginationParams {
	cursorArgument?: string;
	limitArgument?: string;
	mergeMode?: MergeMode;
}

export const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;
		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}
		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
		const isItInTheCache = cache.resolve(
			cache.resolveFieldByKey(entityKey, fieldKey) as string,
			'posts'
		);
		info.partial = !isItInTheCache;
		let hasMore = true;
		const results: string[] = [];
		fieldInfos.forEach((field) => {
			const key = cache.resolveFieldByKey(
				entityKey,
				field.fieldKey
			) as string[];
			const data = cache.resolve(key, 'posts') as string[];
			const _hasMore = cache.resolve(key, 'hasMore');
			if (!_hasMore) {
				hasMore = _hasMore as boolean;
			}
			results.push(...data);
		});

		return {
			__typename: 'PaginatedPosts',
			hasMore,
			posts: results,
		};
	};
};

const createGraphQLClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: {
		credentials: 'include' as const,
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			keys: {
				PaginatedPosts: () => null,
			},
			resolvers: { Query: { posts: cursorPagination() } },
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
