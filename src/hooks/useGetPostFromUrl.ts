import { useRouter } from 'next/router';
import { usePostQuery } from '../lib/graphql/generated/graphql';
import { isServer } from '../utils/isServer';

export const useGetPostFromUrl = () => {
	const router = useRouter();
	const intId =
		typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
	const [{ fetching, data, error }] = usePostQuery({
		pause: intId === -1 || isServer(),
		variables: { id: intId },
	});

	return {
		data,
		fetching,
		error,
		intId,
	};
};
