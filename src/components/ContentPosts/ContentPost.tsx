import { Box, Flex, Heading, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import {
	Post,
	useDeletePostMutation,
} from '../../lib/graphql/generated/graphql';
import VoteSection from '../VoteSection';
import NextLink from 'next/link';
import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

type ContentPostProps = Partial<Post> & { withLink?: boolean };

const ContentPost: React.FC<ContentPostProps> = ({
	id,
	points,
	title,
	creator,
	content,
	voteStatus,
	withLink,
}: ContentPostProps) => {
	const [, deletePost] = useDeletePostMutation();
	return (
		<Flex
			key={id}
			p={5}
			shadow='md'
			borderWidth='1px'
			direction='row'
			wrap='wrap'
		>
			<VoteSection points={points!} postId={id!} voteStatus={voteStatus} />
			<Box w='90%'>
				{withLink ? (
					<Link>
						<NextLink href='/post/[id]' as={`/post/${id}`}>
							<Heading fontSize='xl'>{title}</Heading>
						</NextLink>
					</Link>
				) : (
					<Heading fontSize='xl'>{title}</Heading>
				)}
				<Text fontSize='sm'>posted by {creator!.username} </Text>
				<Flex flex={1} align='center'>
					<Text flex={1} mt={4}>
						{content}
					</Text>
					<IconButton
						onClick={() => deletePost({ id: id! })}
						colorScheme='gray'
						aria-label='Delete post'
						icon={<DeleteIcon />}
					/>
				</Flex>
			</Box>
		</Flex>
	);
};

export default ContentPost;
