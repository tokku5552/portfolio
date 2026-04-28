import HomeSection from './HomeSection';

const playlistSrc =
  'https://www.youtube.com/embed/videoseries?si=VxIbydvyHzjo6ijO&amp;list=PLH58nXzfT1i0ELx0qvc6W4u8ssez7LcD8';

export default function YouTubeSection() {
  return (
    <HomeSection
      id="youtube"
      eyebrow="// YouTube"
      heading="Talks & sessions"
      description="勉強会への登壇などで出演している YouTube 動画のプレイリストです。"
    >
      <div className="relative w-full overflow-hidden rounded-[4px] border border-brand-border-strong">
        <div className="aspect-video">
          <iframe
            src={playlistSrc}
            title="YouTube playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </HomeSection>
  );
}
