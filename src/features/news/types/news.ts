export interface News {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  body: string;
  openAt: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
}
