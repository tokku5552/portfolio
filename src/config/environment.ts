const warnIfMissing = (key: string) => {
  if (!process.env[key]) {
    console.warn(`Environment variable "${key}" is not set.`);
  }
};

warnIfMissing('NEXT_PUBLIC_ENVIRONMENT');
warnIfMissing('NEXT_PUBLIC_GA_ID');

// Client-safe values only. Server-only secrets (e.g. QIITA_TOKEN) must be
// read in the module that uses them, never added here.
export const config = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local',
  gaID: process.env.NEXT_PUBLIC_GA_ID ?? '',
};
