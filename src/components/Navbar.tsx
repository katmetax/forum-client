import { Flex, Box, Link, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
	useLogoutMutation,
	useMeQuery,
} from '../lib/graphql/generated/graphql';
import { isServer } from '../utils/isServer';
import { DarkModeSwitch } from './DarkModeSwitch';

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
		<Flex
			p={4}
			bg='lightgrey'
			sx={{
				position: '-webkit-sticky' /* Safari */,
				position: 'sticky',
				top: '0',
			}}
			zIndex={1}
			w='100%'
		>
			<NextLink href='/'>
				<Link mr={2}>home</Link>
			</NextLink>
			<Flex ml='auto' mr={20} flexDirection='column' wrap='wrap'>
				{fetching ? null : showUserOptions()}
				<DarkModeSwitch />
			</Flex>
		</Flex>
	);
};

export default Navbar;
