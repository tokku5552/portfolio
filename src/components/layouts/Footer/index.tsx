import { ReactNode } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import Container from '../../parts/Container';
import Link from '../../parts/Link';
import {
  contactGoogleFormUrl,
  facebookUrl,
  githubUrl,
  inkdoseUrl,
  instagramUrl,
  linkdinUrl,
  noteUrl,
  podcastApplePodcastsUrl,
  podcastSpotifyUrl,
  podcastUrl,
  wantedlyUrl,
  xUrl,
} from '../../../config/constants';

interface ColumnLink {
  label: string;
  href: string;
  external?: boolean;
}

interface Column {
  label: string;
  links: ColumnLink[];
}

const columns: Column[] = [
  {
    label: 'About',
    links: [
      { label: 'GitHub', href: githubUrl, external: true },
      { label: 'LinkedIn', href: linkdinUrl, external: true },
      { label: 'Wantedly', href: wantedlyUrl, external: true },
    ],
  },
  {
    label: 'Music',
    links: [{ label: 'INKDOSE', href: inkdoseUrl, external: true }],
  },
  {
    label: 'Podcast',
    links: [
      { label: 'Spotify for Podcasters', href: podcastUrl, external: true },
      { label: 'Spotify', href: podcastSpotifyUrl, external: true },
      {
        label: 'Apple Podcasts',
        href: podcastApplePodcastsUrl,
        external: true,
      },
    ],
  },
  {
    label: 'Writing',
    links: [
      { label: 'Articles', href: '/articles' },
      { label: 'note', href: noteUrl, external: true },
    ],
  },
];

interface SocialIconProps {
  label: string;
  href: string;
  children: ReactNode;
}

function SocialIcon({ label, href, children }: SocialIconProps) {
  return (
    <Link
      href={href}
      external
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-brand-border-strong text-brand-fg transition-colors hover:bg-white/[0.04] hover:border-white/30"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border bg-brand-bg text-brand-fg">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-12">
          {columns.map((col) => (
            <div key={col.label} className="flex flex-col gap-4">
              <span className="font-brand-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
                {col.label}
              </span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      external={link.external}
                      className="font-brand-sans text-[14px] text-brand-fg transition-colors hover:text-brand-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-brand-border">
        <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5 font-brand-mono text-[12px] tracking-[0.02em] text-brand-muted">
            <span
              aria-hidden="true"
              className="block h-2 w-2 rotate-45 bg-gradient-to-br from-brand-orb-indigo via-brand-orb-violet to-brand-orb-pink"
            />
            <span className="text-brand-fg">tok</span>
            <span>/ shinnosuke tokuda · © {year}</span>
          </div>

          <div className="flex items-center gap-3">
            <SocialIcon label="GitHub" href={githubUrl}>
              <FaGithub aria-hidden="true" />
            </SocialIcon>
            <SocialIcon label="X" href={xUrl}>
              <FaXTwitter aria-hidden="true" />
            </SocialIcon>
            <SocialIcon label="Facebook" href={facebookUrl}>
              <FaFacebook aria-hidden="true" />
            </SocialIcon>
            <SocialIcon label="Instagram" href={instagramUrl}>
              <FaInstagram aria-hidden="true" />
            </SocialIcon>
            <SocialIcon label="LinkedIn" href={linkdinUrl}>
              <FaLinkedin aria-hidden="true" />
            </SocialIcon>
            <Link
              href={contactGoogleFormUrl}
              external
              className="ml-2 font-brand-mono text-[12px] tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors hover:bg-white/[0.04] hover:border-white/30"
            >
              Get in touch ↗
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
