import { Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import { usePostsQuery } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import { isServer } from '../utils/isServer';
// import { DarkModeSwitch } from '../components/DarkModeSwitch';

const Index = () => {
	const [{ data }] = usePostsQuery({
		pause: isServer(),
	});
	return (
		<>
			<Navbar />
			<Text>Hello World!</Text>
			{/* <DarkModeSwitch /> */}
			{!data ? (
				<div>loading...</div>
			) : (
				data.posts.map((post) => <div key={post.id}>{post.title}</div>)
			)}
		</>
	);
};

export default withUrqlClient(createGraphQLClient, { ssr: true })(Index);
