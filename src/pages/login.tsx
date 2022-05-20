import { Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import { toErrorMap } from '../utils/errorMap';
import NextLink from 'next/link';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const router = useRouter();
	const [, login] = useLoginMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({ options: values });
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router?.query?.next === 'string') {
							return router.push(router.query.next);
						}
						return router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='email' label='Email' type='email' />
						<InputField name='password' label='Password' type='password' />
						<Flex>
							<NextLink href='/forgot-password'>
								<Link ml='auto' mt={2}>
									Forgot password?
								</Link>
							</NextLink>
						</Flex>
						<Button
							mt={8}
							bgColor='teal'
							color='white'
							isLoading={isSubmitting}
							type='submit'
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient)(Login);
