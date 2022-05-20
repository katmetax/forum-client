import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputProps,
	Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputProps &
	InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
		name: string;
		label: string;
		textarea?: boolean;
	};

const InputField: React.FC<InputFieldProps> = ({
	label,
	textarea,
	size: _,
	...props
}) => {
	const [field, { error, touched }] = useField(props);
	return (
		<FormControl isInvalid={!!error && touched}>
			<FormLabel htmlFor={props.name}>{label}</FormLabel>
			{textarea ? (
				<Textarea {...field} {...props} id={props.name} placeholder={label} />
			) : (
				<Input {...field} {...props} id={props.name} placeholder={label} />
			)}
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
};

export default InputField;
