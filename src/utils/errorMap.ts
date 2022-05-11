import { FieldError } from '../lib/graphql/generated/graphql';

export const toErrorMap = (errors: FieldError[]) => {
	let errorMap: Record<string, string> = {};
	errors.map(({ field, message }) => {
		errorMap[field] = message;
	});

	return errorMap;
};
