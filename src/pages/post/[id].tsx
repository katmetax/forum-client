import { Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { Flex, Text } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import Wrapper from '../../components/Wrapper';
import { usePostQuery } from '../../lib/graphql/generated/graphql';
import createGraphQLClient from '../../lib/graphql/utils/createGraphQLClient';
import ContentPost from '../../components/ContentPosts/ContentPost';
import { isServer } from '../../utils/isServer';
import { Post as PostData } from '../../lib/graphql/generated/graphql';

const Post = ({}) => {
	const router = useRouter();
	const intId =
		typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
	const [{ fetching, data, error }] = usePostQuery({
		pause: intId === -1 || isServer(),
		variables: { id: intId },
	});

	// TODO: Make into hook
	const renderStatusDiv = () => {
		if (fetching || !data) {
			return (
				<Flex justify='center' my={4}>
					<Spinner />
					<Text ml={4}>loading...</Text>
				</Flex>
			);
		} else if (error) {
			console.error(error);
			return (
				<Alert status='error'>
					<AlertIcon />
					Uh oh something went wrong!
				</Alert>
			);
		}

		return null;
	};

	return (
		<Wrapper>
			{renderStatusDiv()}
			{!data?.post ? (
				<Alert status='error'>
					<AlertIcon />
					Post not found
				</Alert>
			) : (
				<ContentPost {...(data.post as Partial<PostData>)}></ContentPost>
			)}
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient, { ssr: true })(Post);
