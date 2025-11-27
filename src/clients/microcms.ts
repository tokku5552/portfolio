import { createClient } from 'microcms-js-sdk';
import { config } from '../config/environment';

export const isMicrocmsConfigured =
  Boolean(config.serviceDomain) && Boolean(config.apiKey);

export const client = isMicrocmsConfigured
  ? createClient({
      serviceDomain: config.serviceDomain,
      apiKey: config.apiKey,
    })
  : {
      get: async () => {
        throw new Error(
          'MicroCMS client is not configured. Set NEXT_PUBLIC_SERVICE_DOMAIN and NEXT_PUBLIC_API_KEY.'
        );
      },
    };
