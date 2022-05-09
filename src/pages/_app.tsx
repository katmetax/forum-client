import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import Navbar from '../components/Navbar';
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql';
import theme from '../theme';

const UpdateQueryWrapper = <Result, Query>(
	cache: Cache,
	queryInput: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) => cache.updateQuery(queryInput, (data) => fn(result, data as any) as any);

const client = createClient({
	url: 'http://localhost:4000/graphql',
	fetchOptions: {
		credentials: 'include',
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
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
		fetchExchange,
	],
});

function MyApp({ Component, pageProps }) {
	return (
		<Provider value={client}>
			<ChakraProvider resetCSS theme={theme}>
				<ColorModeProvider
					options={{
						useSystemColorMode: true,
					}}
				>
					<Navbar />
					<Component {...pageProps} />
				</ColorModeProvider>
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
