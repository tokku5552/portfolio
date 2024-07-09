import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      a: {
        textDecoration: 'underline',
        _hover: {
          color: 'blue.500',
          textDecoration: 'underline',
        },
      },
    },
  },
});
