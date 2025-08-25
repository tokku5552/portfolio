export interface SNSIconProps {
  sns:
    | 'x'
    | 'github'
    | 'facebook'
    | 'instagram'
    | 'linkdin'
    | 'wantedly'
    | 'note';
  src: string;
  alt: string;
  href: string;
  baseSize: number;
  sizerate: number;
}
