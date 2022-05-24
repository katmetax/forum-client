import { Stack } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../lib/graphql/generated/graphql';
import ContentPost from './ContentPost';

export interface ContentPostsProps {
	posts: Partial<Post>[];
}

const ContentPosts: React.FC<ContentPostsProps> = ({ posts }) => {
	return (
		<Stack spacing={8}>
			{posts.map((post) => (
				<ContentPost key={post.id} {...post}></ContentPost>
			))}
		</Stack>
	);
};

export default ContentPosts;
