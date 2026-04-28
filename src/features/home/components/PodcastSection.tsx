import Link from '../../../components/parts/Link';
import {
  podcastApplePodcastsUrl,
  podcastSpotifyUrl,
  podcastUrl,
} from '../../../config/constants';
import HomeSection from './HomeSection';

export default function PodcastSection() {
  return (
    <HomeSection
      id="podcast"
      eyebrow="// Podcast"
      heading="エンジニアがもがくラジオ"
      description="エンジニアのキャリアと現場の試行錯誤を雑談ベースで配信している Podcast。Spotify / Apple Podcasts など主要スタンドで配信中。"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
        <Link
          href={podcastUrl}
          external
          aria-label="Podcast cover artwork"
          className="block w-full max-w-[360px] border border-brand-border transition-colors hover:border-brand-border-strong"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/podcast_cover.png"
            alt="Podcast cover"
            className="block h-auto w-full"
          />
        </Link>
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              href={podcastSpotifyUrl}
              external
              className="font-brand-mono text-[12px] uppercase tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors hover:bg-white/[0.04]"
            >
              Spotify ↗
            </Link>
          </li>
          <li>
            <Link
              href={podcastApplePodcastsUrl}
              external
              className="font-brand-mono text-[12px] uppercase tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors hover:bg-white/[0.04]"
            >
              Apple Podcasts ↗
            </Link>
          </li>
          <li>
            <Link
              href={podcastUrl}
              external
              className="font-brand-mono text-[12px] uppercase tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors hover:bg-white/[0.04]"
            >
              Spotify for Podcasters ↗
            </Link>
          </li>
        </ul>
      </div>
    </HomeSection>
  );
}
