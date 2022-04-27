import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
};

const InputField: React.FC<InputFieldProps> = ({
	label,
	size: _,
	...props
}) => {
	const [field, { error, touched }] = useField(props);
	return (
		<FormControl isInvalid={!!error && touched}>
			<FormLabel htmlFor={props.name}>{label}</FormLabel>
			<Input {...field} {...props} id={props.name} placeholder={label} />
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
};

export default InputField;
