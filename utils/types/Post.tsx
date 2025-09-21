export interface PostData {
  Title: string;
  Date: string;
  Modified: string;
  Category: string;
  Tags: string[];
  Slug: string;
  Preview: string;
}

export interface Post extends PostData {
  filePath: string;
  content: string;
}
