import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { IconButton, Spinner } from '@chakra-ui/react';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useVoteMutation } from '../lib/graphql/generated/graphql';

interface VoteSectionProps {
	points: number;
	postId: number;
}

const VoteSection: React.FC<VoteSectionProps> = ({ points, postId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [, vote] = useVoteMutation();
	const voting = {
		upvote: 1,
		downvote: -1,
	};

	const buttonClickHandler = async (postId: number, value: number) => {
		setIsLoading(true);
		await vote({ postId, value });
		setIsLoading(false);
	};

	return (
		<Box p={4}>
			{isLoading ? (
				<Spinner verticalAlign='middle' m='auto' />
			) : (
				<>
					<IconButton
						colorScheme='cyan'
						variant='outline'
						aria-label='Upvote post'
						onClick={async () =>
							await buttonClickHandler(postId, voting.upvote)
						}
						icon={<TriangleUpIcon />}
					/>
					<Text p={2} align='center'>
						{points}
					</Text>
					<IconButton
						colorScheme='cyan'
						variant='outline'
						aria-label='Downvote post'
						onClick={async () =>
							await buttonClickHandler(postId, voting.downvote)
						}
						icon={<TriangleDownIcon />}
					/>
				</>
			)}
		</Box>
	);
};

export default VoteSection;
