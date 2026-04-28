import { buttonClasses } from '../../../components/parts/Button';
import Link from '../../../components/parts/Link';
import { contactGoogleFormUrl } from '../../../config/constants';
import HomeSection from './HomeSection';

export default function ContactSection() {
  return (
    <HomeSection
      id="contact"
      eyebrow="// Contact"
      heading="Say hi"
      description="技術相談、登壇・執筆のご依頼、その他の連絡は Google Form からどうぞ。返信は平日中心になります。"
    >
      <Link
        href={contactGoogleFormUrl}
        external
        className={buttonClasses('primary')}
      >
        <span>Google Form を開く</span>
        <span aria-hidden="true" className="font-brand-mono">
          ↗
        </span>
      </Link>
    </HomeSection>
  );
}
