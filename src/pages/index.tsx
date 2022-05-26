import { Flex, Heading, Link, Text } from '@chakra-ui/layout';
import { Alert, AlertIcon, Button, Spinner } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import ContentPosts from '../components/ContentPosts';
import Wrapper from '../components/Wrapper';
import { Post, usePostsQuery } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import { isServer } from '../utils/isServer';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching, error }] = usePostsQuery({
		variables,
		pause: isServer(),
	});

	const renderStatusDiv = () => {
		if (error) {
			console.error(error);
			return (
				<Alert status='error'>
					<AlertIcon />
					Uh oh something went wrong!
				</Alert>
			);
		}
		return (
			<Flex justify='center' my={4}>
				<Spinner />
				<Text ml={4}>loading...</Text>
			</Flex>
		);
	};

	return (
		<Wrapper>
			{fetching || !data ? (
				renderStatusDiv()
			) : (
				<ContentPosts
					posts={data.posts.posts as Partial<Post>[]}
				></ContentPosts>
			)}
			<Flex my={8}>
				{data && data.posts.hasMore ? (
					<Button
						onClick={() =>
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							})
						}
						isLoading={fetching}
						colorScheme='teal'
						m='auto'
					>
						Load more
					</Button>
				) : (
					<Text align='center' m='auto' as='i'>
						There are no more posts to show :(
					</Text>
				)}
			</Flex>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient, { ssr: true })(Index);
