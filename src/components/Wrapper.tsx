import { Box } from '@chakra-ui/react';
import React from 'react';

const Wrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
	return (
		<Box mt={8} mx='auto' maxW='800px' w='100%'>
			{children}
		</Box>
	);
};

export default Wrapper;
