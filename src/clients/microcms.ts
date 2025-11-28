import { createClient } from 'microcms-js-sdk';
import { config } from '../config/environment';

export const isMicrocmsConfigured =
  Boolean(config.serviceDomain) && Boolean(config.apiKey);

// 実際のクライアントの型を取得
type MicroCMSClient = ReturnType<typeof createClient>;

// モッククライアント: 必要なメソッドのみ実装
const createMockClient = (): MicroCMSClient => {
  const throwError = (): never => {
    throw new Error(
      'MicroCMS client is not configured. Set NEXT_PUBLIC_SERVICE_DOMAIN and NEXT_PUBLIC_API_KEY.'
    );
  };

  return {
    get: async () => throwError(),
    getList: async () => throwError(),
    getListDetail: async () => throwError(),
    getObject: async () => throwError(),
    create: async () => throwError(),
    update: async () => throwError(),
    delete: async () => throwError(),
    getAllContentIds: async () => throwError(),
    getAllContents: async () => throwError(),
  } as MicroCMSClient;
};

export const client = isMicrocmsConfigured
  ? createClient({
      serviceDomain: config.serviceDomain,
      apiKey: config.apiKey,
    })
  : createMockClient();
