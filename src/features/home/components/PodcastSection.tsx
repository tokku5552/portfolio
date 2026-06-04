import Eyebrow from '../../../components/parts/Eyebrow';
import Link from '../../../components/parts/Link';
import {
  nightNoteApplePodcastUrl,
  nightNoteSpotifyEmbedUrl,
  nightNoteSpotifyUrl,
  nightNoteStandFmUrl,
  podcastApplePodcastsUrl,
  podcastSpotifyEmbedUrl,
  podcastSpotifyUrl,
  podcastUrl,
} from '../../../config/constants';
import HomeSection from './HomeSection';

interface PodcastPlatformLink {
  label: string;
  href: string;
}

interface PodcastProgram {
  key: string;
  /** Eyebrow sub-label shown above the embedded player. */
  label: string;
  /** Accessible title for the embedded iframe player. */
  embedTitle: string;
  embedUrl: string;
  links: PodcastPlatformLink[];
}

const PROGRAMS: PodcastProgram[] = [
  {
    key: 'mogaku-radio',
    label: '// もがくラジオ',
    embedTitle: 'エンジニアがもがくラジオ player',
    embedUrl: podcastSpotifyEmbedUrl,
    links: [
      { label: 'Spotify', href: podcastSpotifyUrl },
      { label: 'Apple Podcasts', href: podcastApplePodcastsUrl },
      { label: 'Spotify for Podcasters', href: podcastUrl },
    ],
  },
  {
    key: 'night-notes',
    label: '// 夜ノート',
    embedTitle: 'とっくの夜ノート player',
    embedUrl: nightNoteSpotifyEmbedUrl,
    links: [
      { label: 'stand.fm', href: nightNoteStandFmUrl },
      { label: 'Spotify', href: nightNoteSpotifyUrl },
      { label: 'Apple Podcast', href: nightNoteApplePodcastUrl },
    ],
  },
];

const platformLinkClassName =
  'font-brand-mono text-[12px] uppercase tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors hover:bg-white/[0.04]';

export default function PodcastSection() {
  return (
    <HomeSection
      id="podcast"
      eyebrow="// Podcast"
      heading="Listen in"
      description="エンジニアのキャリアと現場の試行錯誤を雑談ベースで配信する「エンジニアがもがくラジオ」と、夜の短尺音声で日々を綴る stand.fm 番組「とっくの夜ノート」。主要スタンドで配信中。"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {PROGRAMS.map((program) => (
          <div key={program.key}>
            <Eyebrow className="mb-3">{program.label}</Eyebrow>
            <div className="relative w-full overflow-hidden rounded-[4px] border border-brand-border-strong">
              <iframe
                src={program.embedUrl}
                title={program.embedTitle}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="h-[152px] w-full"
              />
            </div>
            <ul className="mt-4 flex flex-wrap gap-3">
              {program.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    external
                    className={platformLinkClassName}
                  >
                    {link.label} ↗
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
