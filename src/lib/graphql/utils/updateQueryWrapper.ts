import { QueryInput, Cache } from '@urql/exchange-graphcache';

export const UpdateQueryWrapper = <Result, Query>(
	cache: Cache,
	queryInput: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) => cache.updateQuery(queryInput, (data) => fn(result, data as any) as any);
