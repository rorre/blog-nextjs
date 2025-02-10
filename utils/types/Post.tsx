export interface PostData {
  Title: string;
  Date: Date;
  Modified: Date;
  Category: string;
  Tags: string[];
  Slug: string;
  Preview: string;
}

export interface Post extends PostData {
  filePath: string;
  content: string;
}
