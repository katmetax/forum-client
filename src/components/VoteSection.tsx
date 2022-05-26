import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { IconButton, Spinner } from '@chakra-ui/react';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useVoteMutation } from '../lib/graphql/generated/graphql';

interface VoteSectionProps {
	points: number;
	postId: number;
	voteStatus?: number | null;
}

const VoteSection: React.FC<VoteSectionProps> = ({
	points,
	postId,
	voteStatus,
}) => {
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
						colorScheme={voteStatus === voting.upvote ? 'green' : 'blue'}
						variant='outline'
						isDisabled={voteStatus === voting.upvote}
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
						colorScheme={voteStatus === voting.downvote ? 'red' : 'blue'}
						variant='outline'
						isDisabled={voteStatus === voting.downvote}
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
