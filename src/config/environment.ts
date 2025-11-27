const warnIfMissing = (key: string) => {
  if (!process.env[key]) {
    console.warn(`Environment variable \"${key}\" is not set.`);
  }
};

warnIfMissing('NEXT_PUBLIC_ENVIRONMENT');
warnIfMissing('NEXT_PUBLIC_SERVICE_DOMAIN');
warnIfMissing('NEXT_PUBLIC_API_KEY');
warnIfMissing('NEXT_PUBLIC_GA_ID');
warnIfMissing('NEXT_PUBLIC_QIITA_TOKEN');

export const config = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local',
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN ?? '',
  apiKey: process.env.NEXT_PUBLIC_API_KEY ?? '',
  gaID: process.env.NEXT_PUBLIC_GA_ID ?? '',
  qiitaToken: process.env.NEXT_PUBLIC_QIITA_TOKEN ?? '',
};
