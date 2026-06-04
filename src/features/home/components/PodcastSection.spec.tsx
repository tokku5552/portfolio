import { render } from '@testing-library/react';
import {
  nightNoteApplePodcastUrl,
  nightNoteSpotifyEmbedUrl,
  nightNoteSpotifyUrl,
  nightNoteStandFmUrl,
  podcastSpotifyEmbedUrl,
} from '../../../config/constants';
import PodcastSection from './PodcastSection';

describe('PodcastSection', () => {
  it('renders an embedded player for both programs', () => {
    const { container } = render(<PodcastSection />);
    const iframes = Array.from(container.querySelectorAll('iframe'));
    expect(iframes.length).toBe(2);

    const srcs = iframes.map((f) => f.getAttribute('src'));
    expect(srcs).toContain(podcastSpotifyEmbedUrl);
    expect(srcs).toContain(nightNoteSpotifyEmbedUrl);
  });

  it('gives every program at least one external platform link', () => {
    const { container } = render(<PodcastSection />);
    const lists = Array.from(container.querySelectorAll('ul'));
    expect(lists.length).toBe(2);

    for (const list of lists) {
      const externalLinks = list.querySelectorAll('a[href^="http"]');
      expect(externalLinks.length).toBeGreaterThan(0);
    }
  });

  it('links とっくの夜ノート to stand.fm, Spotify and Apple Podcast', () => {
    const { container } = render(<PodcastSection />);
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) =>
      a.getAttribute('href')
    );

    expect(hrefs).toContain(nightNoteStandFmUrl);
    expect(hrefs).toContain(nightNoteSpotifyUrl);
    expect(hrefs).toContain(nightNoteApplePodcastUrl);
  });

  it('does not render the legacy podcast cover image as the primary visual', () => {
    const { container } = render(<PodcastSection />);
    const coverImages = Array.from(container.querySelectorAll('img')).filter(
      (img) => img.getAttribute('src')?.includes('podcast_cover')
    );

    expect(coverImages.length).toBe(0);
  });
});
