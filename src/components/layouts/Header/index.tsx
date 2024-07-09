'use client'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { menus } from '../../../features/home/menus';

interface NavLinkProps {
  url: string;
  children: ReactNode;
}

const NavLink = ({ url, children }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={`#${url}`}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        position="fixed" // ヘッダーを画面上部に固定
        w="full" // フル幅
        bg={useColorModeValue(
          'rgba(247, 250, 252, 0.8)',
          'rgba(26, 32, 44, 0.8)'
        )} // 背景色を透過
        px={4}
        zIndex={1} // 他の要素より前に表示
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Menu>
            <MenuButton
              as={Button}
              size={'md'}
              iconSpacing={0}
              leftIcon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
              // ここでボタン自体の背景色を適用
              bg={useColorModeValue('transparent', 'gray.700')}
              _hover={{
                bg: useColorModeValue('gray.200', 'gray.700'),
              }}
            />
            <MenuList>
              {menus.map((menu) => (
                <MenuItem key={menu.id} onClick={onClose}>
                  <Link href={`#${menu.id}`}>{menu.title}</Link>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Link href="/">
                <Image
                  boxSize="48px"
                  objectFit="cover"
                  rounded={'full'}
                  alt={'cover image'}
                  src={'/assets/profile_icon.png'}
                />
              </Link>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {menus.map((menu) => (
                <NavLink key={menu.id} url={menu.id}>
                  {menu.title}
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  );
}
