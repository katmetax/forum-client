import { Box, Flex, Heading, Link, Text } from '@chakra-ui/layout';
import { Button, Stack } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import Wrapper from '../components/Wrapper';
import { usePostsQuery } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import { isServer } from '../utils/isServer';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
		pause: isServer(),
	});
	return (
		<Wrapper>
			<Flex align='center' my={4}>
				<Heading>New Reddit</Heading>
				<NextLink href='create-post'>
					<Link ml='auto'>Create Post</Link>
				</NextLink>
			</Flex>
			{fetching || !data ? (
				<div>loading...</div>
			) : (
				<Stack spacing={8}>
					{data.posts.posts.map(({ id, title, contentSnippet }) => (
						<Box key={id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{title}</Heading>
							<Text mt={4}>{contentSnippet}...</Text>
						</Box>
					))}
				</Stack>
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
