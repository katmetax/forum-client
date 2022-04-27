import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={(values, actions) => {
					setTimeout(() => {
						alert(JSON.stringify(values, null, 2));
						actions.setSubmitting(false);
					}, 1000);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='username' label='Username' />
						<InputField name='password' label='Password' type='password' />
						<Button
							mt={8}
							bgColor='teal'
							color='white'
							isLoading={isSubmitting}
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
