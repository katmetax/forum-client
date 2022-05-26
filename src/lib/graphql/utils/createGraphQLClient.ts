import { dedupExchange, errorExchange, fetchExchange } from 'urql';
import {
	LogoutMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	RegisterMutation,
	VoteMutationVariables,
} from '../generated/graphql';
import { cacheExchange, Cache, Resolver } from '@urql/exchange-graphcache';
import { UpdateQueryWrapper } from './updateQueryWrapper';
import Router from 'next/router';
import { gql } from '@urql/core';
import { stringifyVariables } from '@urql/core';
import { isServer } from '../../../utils/isServer';
import { NextUrqlClientConfig } from 'next-urql/dist/types/types';

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
			cache.resolve(entityKey, fieldKey) as string,
			'posts'
		);
		info.partial = !isItInTheCache;
		let hasMore = true;
		const results: string[] = [];
		fieldInfos.forEach((field) => {
			const key = cache.resolve(entityKey, field.fieldKey) as string[];
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

const invalidateAllPosts = (cache: Cache) => {
	const allFields = cache.inspectFields('Query');
	const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
	fieldInfos.forEach((fi) => {
		cache.invalidate('Query', 'posts', fi.arguments || {});
	});
};

const createGraphQLClient: NextUrqlClientConfig = (
	ssrExchange: any,
	ctx: any
) => {
	let cookie = '';
	if (isServer()) {
		cookie = ctx?.req.headers.cookie;
	}

	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
			headers: {
				cookie: cookie,
			},
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
						vote: (_result, args, cache) => {
							const { postId, value } = args as VoteMutationVariables;
							const data = cache.readFragment(
								gql`
									fragment _ on Post {
										id
										points
									}
								`,
								{ id: postId }
							);
							if (data) {
								if (data.voteStatus === value) {
									return;
								}
								const updatedPoints =
									data.points + (!data.voteStatus ? 1 : 2) * value;
								cache.writeFragment(
									gql`
										fragment __ on Post {
											points
											voteStatus
										}
									`,
									{ id: postId, points: updatedPoints, voteStatus: value }
								);
							}
						},
						createPost: (_result, args, cache) => {
							invalidateAllPosts(cache);
						},
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
	};
};

export default createGraphQLClient;
