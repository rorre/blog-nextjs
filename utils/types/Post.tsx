export interface PostData {
  Title: string;
  Date: Date;
  Modified: Date;
  Category: string;
  Tags: string[];
  Slug: string;
}

export interface Post extends PostData {
  filePath: string;
  previewParagraph: string;
  content: string;
}
