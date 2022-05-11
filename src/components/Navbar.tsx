import { Flex, Box, Link, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
	useLogoutMutation,
	useMeQuery,
} from '../lib/graphql/generated/graphql';
import { isServer } from '../utils/isServer';

const Navbar: React.FC = () => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});

	const showUserOptions = () => {
		if (!data?.me) {
			return (
				<>
					<NextLink href='/login'>
						<Link mr={2}>login</Link>
					</NextLink>
					<NextLink href='/register'>
						<Link>register</Link>
					</NextLink>
				</>
			);
		}
		return (
			<Flex>
				<Box>{data.me.username}</Box>
				<Button
					ml={2}
					variant='link'
					onClick={() => logout()}
					isLoading={logoutFetching}
				>
					logout
				</Button>
			</Flex>
		);
	};

	return (
		<Flex p={4} bg='lightgrey'>
			<NextLink href='/'>
				<Link mr={2}>home</Link>
			</NextLink>
			<Box ml={'auto'}>{fetching ? null : showUserOptions()}</Box>
		</Flex>
	);
};

export default Navbar;
