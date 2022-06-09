import { Flex, Box, Link, Button, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
	useLogoutMutation,
	useMeQuery,
} from '../lib/graphql/generated/graphql';
import { isServer } from '../utils/isServer';
import { DarkModeSwitch } from './DarkModeSwitch';

const Navbar: React.FC = () => {
	const router = useRouter();
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
			<Flex align='center'>
				<NextLink href='create-post'>
					<Button as={Link} mr={4} colorScheme='cyan'>
						Create Post
					</Button>
				</NextLink>
				<Box>{data.me.username}</Box>
				<Button
					ml={2}
					variant='link'
					onClick={async () => {
						await logout();
						router.reload();
					}}
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
			bgColor='lightgray'
			sx={{
				position: '-webkit-sticky' /* Safari */,
				position: 'sticky',
				top: '0',
			}}
			zIndex={1}
			w='100%'
		>
			<Flex flex={1} m='auto' maxW={800} align='center'>
				<NextLink href='/'>
					<Link mr={2}>
						<Heading>NewReddit</Heading>
					</Link>
				</NextLink>
				<Flex ml='auto' flexDirection='row' align='center'>
					{fetching ? null : showUserOptions()}
					<DarkModeSwitch />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Navbar;
