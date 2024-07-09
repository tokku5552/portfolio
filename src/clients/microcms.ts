import { createClient } from 'microcms-js-sdk';
import { config } from '../config/environment';

export const client = createClient({
  serviceDomain: config.serviceDomain,
  apiKey: config.apiKey,
});
