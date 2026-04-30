import Eyebrow from '../../../components/parts/Eyebrow';
import Link from '../../../components/parts/Link';
import {
  youtubeChannelHandle,
  youtubeChannelUrl,
  youtubePlaylistEmbedUrl,
} from '../../../config/constants';
import HomeSection from './HomeSection';

export default function YouTubeSection() {
  return (
    <HomeSection
      id="youtube"
      eyebrow="// YouTube"
      heading="Channel & talks"
      description="個人チャンネルでの発信と、勉強会への登壇などで出演している YouTube 動画のプレイリストです。"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Eyebrow className="mb-3">{'// Channel'}</Eyebrow>
          <Link
            href={youtubeChannelUrl}
            external
            aria-label={`YouTube channel ${youtubeChannelHandle}`}
            className="group relative block w-full overflow-hidden rounded-[4px] border border-brand-border-strong transition-colors hover:border-brand-fg"
          >
            <div className="relative flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]">
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <span className="font-brand-mono text-[12px] uppercase tracking-[0.12em] text-brand-muted">
                  YouTube Channel
                </span>
                <span className="font-brand-sans text-[clamp(24px,3vw,36px)] font-black tracking-[-0.02em] text-brand-fg">
                  {youtubeChannelHandle}
                </span>
                <span className="font-brand-mono text-[12px] uppercase tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-2 transition-colors group-hover:bg-white/[0.04]">
                  Visit channel ↗
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div>
          <Eyebrow className="mb-3">{'// Playlist'}</Eyebrow>
          <div className="relative w-full overflow-hidden rounded-[4px] border border-brand-border-strong">
            <div className="aspect-video">
              <iframe
                src={youtubePlaylistEmbedUrl}
                title="YouTube playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
