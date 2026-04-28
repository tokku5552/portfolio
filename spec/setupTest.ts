/* eslint-disable import/no-anonymous-default-export */
export default (): void => {
  process.env.NEXT_PUBLIC_ENVIRONMENT = 'test';
  process.env.NEXT_PUBLIC_GA_ID = 'TEST_GA_ID';
  process.env.NEXT_PUBLIC_QIITA_TOKEN = 'TEST_QIITA_TOKEN';
};
