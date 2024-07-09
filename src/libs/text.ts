// HTMLタグを削除する関数
export const stripHtmlTags = (str: string) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
};

// 文字数を制限して、以降を...に置き換える関数
export const truncateText = (str: string, length = 100) => {
  if (!str || typeof str !== 'string') return '';
  return str.length <= length ? str : str.substring(0, length) + '...';
};
