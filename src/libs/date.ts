export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1して、2桁になるように0を前に付ける
  const day = String(date.getDate()).padStart(2, '0'); // 2桁になるように0を前に付ける

  return `${year}-${month}-${day}`;
};
