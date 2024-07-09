if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  console.error('Specify NEXT_PUBLIC_ENVIRONMENT as environment variable.');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SERVICE_DOMAIN) {
  console.error('Specify NEXT_SERVICE_DOMAIN as environment variable.');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_API_KEY) {
  console.error('Specify NEXT_API_KEY as environment variable.');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_GA_ID) {
  console.error('Specify NEXT_PUBLIC_GA_ID as environment variable.');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_QIITA_TOKEN) {
  console.error('Specify NEXT_PUBLIC_QIITA_TOKEN as environment variable.');
  process.exit(1);
}

export const config = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  gaID: process.env.NEXT_PUBLIC_GA_ID,
  qiitaToken: process.env.NEXT_PUBLIC_QIITA_TOKEN,
};
