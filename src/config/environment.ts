const warnIfMissing = (key: string) => {
  if (!process.env[key]) {
    console.warn(`Environment variable "${key}" is not set.`);
  }
};

warnIfMissing('NEXT_PUBLIC_ENVIRONMENT');
warnIfMissing('NEXT_PUBLIC_GA_ID');
warnIfMissing('NEXT_PUBLIC_QIITA_TOKEN');

export const config = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local',
  gaID: process.env.NEXT_PUBLIC_GA_ID ?? '',
  qiitaToken: process.env.NEXT_PUBLIC_QIITA_TOKEN ?? '',
};
