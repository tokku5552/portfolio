import Eyebrow from '../../../components/parts/Eyebrow';
import {
  youtubeChannelEmbedUrl,
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
          <div className="relative w-full overflow-hidden rounded-[4px] border border-brand-border-strong">
            <div className="aspect-video">
              <iframe
                src={youtubeChannelEmbedUrl}
                title="YouTube channel playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
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
