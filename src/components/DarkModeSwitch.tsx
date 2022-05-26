import { useColorMode, Switch } from '@chakra-ui/react';

export const DarkModeSwitch = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === 'dark';
	return (
		<Switch
			flexBasis='10%'
			ml={5}
			color='green'
			isChecked={isDark}
			onChange={toggleColorMode}
		/>
	);
};
