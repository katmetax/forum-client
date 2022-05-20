import { Link } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
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
			<NextLink href='create-post'>
				<Link>Create Post</Link>
			</NextLink>

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
