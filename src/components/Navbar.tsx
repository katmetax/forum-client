import { Flex, Box, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
	return (
		<Flex p={4}>
			<Box ml={'auto'}>
				<NextLink href='/'>
					<Link mr={2}>home</Link>
				</NextLink>
				<NextLink href='/login'>
					<Link mr={2}>login</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link>register</Link>
				</NextLink>
			</Box>
		</Flex>
	);
};

export default Navbar;
