import {
  Center,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import {
  facebookUrl,
  githubUrl,
  instagramUrl,
  linkdinUrl,
  noteUrl,
  wantedlyUrl,
  xUrl,
} from '../../../config/constants';
import { SNSIconProps } from './types';

export function OwnSNS() {
  // スマートフォンの判定
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const baseIconSize = {
    x: 48,
    github: 60,
    facebook: 60,
    instagram: 60,
    linkdin: 60,
    wantedly: 68,
    note: 60,
  };

  // アイコンの幅と間のスペースの合計
  const limitWidth =
    baseIconSize.x +
    baseIconSize.github +
    baseIconSize.facebook +
    baseIconSize.instagram +
    baseIconSize.linkdin +
    baseIconSize.wantedly +
    baseIconSize.note +
    2 * 6;

  const snsIcons: SNSIconProps[] = [
    {
      sns: 'x',
      src: '/assets/x-logo-black.png',
      alt: 'x-logo',
      href: xUrl,
      baseSize: baseIconSize.x,
      sizerate: baseIconSize.x / limitWidth,
    },
    {
      sns: 'note',
      src: '/assets/note-icon.ico',
      alt: 'note',
      href: noteUrl,
      baseSize: baseIconSize.note,
      sizerate: baseIconSize.note / limitWidth,
    },
    {
      sns: 'github',
      src: '/assets/github-icon.png',
      alt: 'github',
      href: githubUrl,
      baseSize: baseIconSize.github,
      sizerate: baseIconSize.github / limitWidth,
    },
    {
      sns: 'facebook',
      src: '/assets/facebook-icon.png',
      alt: 'facebook',
      href: facebookUrl,
      baseSize: baseIconSize.facebook,
      sizerate: baseIconSize.facebook / limitWidth,
    },
    {
      sns: 'instagram',
      src: '/assets/instagram-icon.png',
      alt: 'instagram',
      href: instagramUrl,
      baseSize: baseIconSize.instagram,
      sizerate: baseIconSize.instagram / limitWidth,
    },
    {
      sns: 'linkdin',
      src: '/assets/linkdin-icon.png',
      alt: 'linkdin',
      href: linkdinUrl,
      baseSize: baseIconSize.linkdin,
      sizerate: baseIconSize.linkdin / limitWidth,
    },
    {
      sns: 'wantedly',
      src: '/assets/wantedly-icon.png',
      alt: 'wantedly',
      href: wantedlyUrl,
      baseSize: baseIconSize.wantedly,
      sizerate: baseIconSize.wantedly / limitWidth,
    },
  ];

  const iconSizes = {
    // 右がスマホ、左がPC
    x: isLargerThan768 ? `${baseIconSize.x}px` : `${baseIconSize.x * 0.8}px`,
    github: isLargerThan768 ? baseIconSize.github : baseIconSize.github * 0.8,
    facebook: isLargerThan768
      ? `${baseIconSize.facebook}px`
      : `${baseIconSize.facebook * 0.8}px`,
    instagram: isLargerThan768
      ? `${baseIconSize.instagram}px`
      : `${baseIconSize.instagram * 0.8}px`,
    linkdin: isLargerThan768
      ? `${baseIconSize.linkdin}px`
      : `${baseIconSize.linkdin * 0.8}px`,
    wantedly: isLargerThan768
      ? `${baseIconSize.wantedly}px`
      : `${baseIconSize.wantedly * 0.8}px`,
    note: isLargerThan768
      ? `${baseIconSize.note}px`
      : `${baseIconSize.note * 0.8}px`,
  };
  return (
    <>
      {/* gridを使ってbaseは横一列で、スマホの場合は数を変えながら複数列にする */}
      <HStack overflowX="auto" p={4}>
        {snsIcons.map((snsIcon) => (
          <div key={snsIcon.sns}>
            <Link href={snsIcon.href} isExternal>
              {/* GitHubの場合のみFaのアイコンをつかい、それ以外はImage、Wantedlyの場合はboxSizeではなくwで横幅を指定 */}
              <Spacer w={2} />
              {snsIcon.sns === 'github' ? (
                <FaGithub size={iconSizes.github} />
              ) : snsIcon.sns === 'wantedly' ? (
                <Image
                  w={iconSizes.wantedly}
                  objectFit="cover"
                  rounded={'md'}
                  alt={snsIcon.alt}
                  src={snsIcon.src}
                />
              ) : (
                <Image
                  boxSize={iconSizes[snsIcon.sns]}
                  objectFit="cover"
                  rounded={'md'}
                  alt={snsIcon.alt}
                  src={snsIcon.src}
                />
              )}
            </Link>
          </div>
        ))}
      </HStack>
    </>
  );
}
