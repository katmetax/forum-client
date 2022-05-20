import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import theme from '../theme';

function MyApp({ Component, pageProps }) {
	return (
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
	);
}

export default withUrqlClient(createGraphQLClient, { ssr: true })(MyApp);
