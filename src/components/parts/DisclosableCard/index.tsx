import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';

export interface DisclosableCardProps {
  title: string;
  headerColor?: string;
  children: React.ReactNode;
}

export default function DisclosableCard({
  title,
  headerColor,
  children,
}: DisclosableCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" margin={4}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={4}
          bg={headerColor}
        >
          <Text fontWeight="bold">{title}</Text>
          <IconButton
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={toggleCard}
            aria-label={''}
            bg={headerColor}
          />
        </Flex>
        {isOpen && (
          <Box p={4} bg={'white'}>
            {children}
          </Box>
        )}
      </Box>
    </>
  );
}
