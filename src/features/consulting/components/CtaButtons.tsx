import { contactGoogleFormUrl, timeTicketUrl } from '@/config/constants';
import { cn } from '@/libs/cn';

interface CtaButtonsProps {
  className?: string;
}

export function CtaButtons({ className }: CtaButtonsProps) {
  return (
    <div className={cn('flex flex-col items-start gap-4', className)}>
      <a
        href={contactGoogleFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-md bg-[#0a5a58] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#07403f] sm:w-auto"
      >
        相談を申し込む
      </a>
      <a
        href={timeTicketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#0a5a58] underline underline-offset-4 hover:opacity-80"
      >
        TimeTicketでも受け付けています
      </a>
    </div>
  );
}

export default CtaButtons;
