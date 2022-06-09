import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import InputField from '../../../components/InputField';
import Wrapper from '../../../components/Wrapper';
import { useGetPostFromUrl } from '../../../hooks/useGetPostFromUrl';
import { useUpdatePostMutation } from '../../../lib/graphql/generated/graphql';
import createGraphQLClient from '../../../lib/graphql/utils/createGraphQLClient';

const EditPost = ({}) => {
	const router = useRouter();
	const { data, fetching, error, intId } = useGetPostFromUrl();
	const [, updatePost] = useUpdatePostMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{
					title: data?.post?.title!,
					content: data?.post?.content!,
				}}
				onSubmit={async (values) => {
					await updatePost({ id: intId, ...values });
					router.back();
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
							Update Post
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient)(EditPost);
