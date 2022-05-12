import { Box, Button, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../lib/graphql/generated/graphql';
import createGraphQLClient from '../lib/graphql/utils/createGraphQLClient';

const ForgotPassword: React.FC = () => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper>
			<Heading as='h4' size='md'>
				Request New Password
			</Heading>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values) => {
					await forgotPassword({ email: values.email });
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box>
							If the email you have provided is registered with us, you will
							receive an email to reset your password
						</Box>
					) : (
						<Form>
							<InputField name='email' label='Email' type='email' />
							<Button
								mt={8}
								bgColor='teal'
								color='white'
								isLoading={isSubmitting}
								type='submit'
							>
								Forgot password
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createGraphQLClient)(ForgotPassword);
