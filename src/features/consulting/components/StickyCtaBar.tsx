import { contactGoogleFormUrl } from '@/config/constants';

export function StickyCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
      <a
        href={contactGoogleFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-md bg-[#0a5a58] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#07403f]"
      >
        相談を申し込む
      </a>
    </div>
  );
}

export default StickyCtaBar;
