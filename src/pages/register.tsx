import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';
import { toErrorMap } from '../utils/errorMap';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
	const router = useRouter();
	const [, register] = useRegisterMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: '', email: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values);

					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='username' label='Username' />
						<InputField name='email' label='Email' type='email' />
						<InputField name='password' label='Password' type='password' />
						<Button
							mt={8}
							bgColor='teal'
							color='white'
							isLoading={isSubmitting}
							type='submit'
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient)(Register);
