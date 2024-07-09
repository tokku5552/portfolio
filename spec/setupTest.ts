/* eslint-disable import/no-anonymous-default-export */
export default (): void => {
  process.env.NEXT_PUBLIC_APP_ENV = 'TEST_NEXT_PUBLIC_APP_ENV';
  process.env.NEXT_PUBLIC_API_BASE_URL = 'TEST_NEXT_PUBLIC_API_BASE_URL';
  process.env.NEXT_PUBLIC_BUILD_VERSION = 'TEST_NEXT_PUBLIC_BUILD_VERSION';
  return;
};
