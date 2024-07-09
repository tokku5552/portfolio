import { Heading, HeadingProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface TitleProps extends HeadingProps {
  children: ReactNode;
}

export default function Title({ children, ...rest }: TitleProps) {
  return (
    <>
      {/* Title Component */}
      <Heading {...rest} size={'2xl'}>
        {children}
      </Heading>
    </>
  );
}
