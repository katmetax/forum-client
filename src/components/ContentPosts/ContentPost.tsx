import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import React from 'react';
import { Post } from '../../lib/graphql/generated/graphql';
import VoteSection from '../VoteSection';

const ContentPost: React.FC<Partial<Post>> = ({
	id,
	points,
	title,
	creator,
	contentSnippet,
}: Partial<Post>) => {
	return (
		<Flex
			key={id}
			p={5}
			shadow='md'
			borderWidth='1px'
			direction='row'
			wrap='wrap'
		>
			<VoteSection points={points!} postId={id!} />
			<Box w='90%'>
				<Heading fontSize='xl'>{title}</Heading>
				<Text fontSize='sm'>posted by {creator!.username} </Text>
				<Text mt={4}>{contentSnippet}...</Text>
			</Box>
		</Flex>
	);
};

export default ContentPost;
