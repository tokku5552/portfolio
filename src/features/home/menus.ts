import { inkdoseUrl } from '../../config/constants';

export interface Menu {
  title: string;
  href: string;
  external?: boolean;
}

/**
 * Global Header navigation items, modelled on the Hero.html `nav.top` proposal.
 * Music links out to the inkdoses.com discography; everything else is a same-page
 * anchor that the landing page exposes via section ids.
 */
export const menus: Menu[] = [
  { title: 'Work', href: '/#services' },
  { title: 'Music', href: inkdoseUrl, external: true },
  { title: 'Podcast', href: '/#podcast' },
  { title: 'Writing', href: '/articles' },
];
