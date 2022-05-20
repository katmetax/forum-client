import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import {
	useCreatePostMutation,
	useMeQuery,
} from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';

const CreatePost: React.FC<{}> = () => {
	const [{ data, fetching }] = useMeQuery();
	const router = useRouter();
	const [, createPost] = useCreatePostMutation();
	useEffect(() => {
		if (!fetching && !data?.me) {
			router.replace(`/login?next=${router.pathname}`);
		}
	}, [fetching, data, router]);
	return (
		<Wrapper>
			<Formik
				initialValues={{ title: '', content: '' }}
				onSubmit={async (values, { setErrors }) => {
					const { error } = await createPost({ input: values });
					if (!error) {
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='title' label='Title' mb={4} />
						<InputField textarea name='content' label='Content' />
						<Button
							mt={8}
							bgColor='teal'
							color='white'
							isLoading={isSubmitting}
							type='submit'
						>
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient)(CreatePost);
