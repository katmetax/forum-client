import { useColorMode, Switch } from '@chakra-ui/react';

export const DarkModeSwitch = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === 'dark';
	return (
		<Switch
			flexBasis='50%'
			ml={10}
			color='green'
			isChecked={isDark}
			onChange={toggleColorMode}
		/>
	);
};
