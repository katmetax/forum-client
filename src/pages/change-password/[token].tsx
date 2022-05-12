import { Box, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../lib/graphql/generated/graphql';
import createGraphQLClient from '../../lib/graphql/utils/createGraphQLClient';
import { toErrorMap } from '../../utils/errorMap';
import NextLink from 'next/link';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const router = useRouter();
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');

	return (
		<Wrapper>
			<Formik
				initialValues={{ newPassword: '', token }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token,
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ('token' in errorMap) {
							setTokenError(errorMap.token);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='newPassword'
							label='New Password'
							type='password'
						/>
						{tokenError && (
							<>
								<Box mr={2} color='red'>
									{tokenError}
								</Box>
								<NextLink href='/forgot-password'>
									<Link>Click here to generate a new one</Link>
								</NextLink>
							</>
						)}
						<Button
							mt={8}
							bgColor='teal'
							color='white'
							isLoading={isSubmitting}
							type='submit'
						>
							Change password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

ChangePassword.getInitialProps = ({ query }) => {
	return { token: query.token as string };
};

export default withUrqlClient(createGraphQLClient)(ChangePassword);
