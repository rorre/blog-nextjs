import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostData } from "./types/Post";
import { remark } from "remark";
import strip from "strip-markdown";

const markCleaner = remark().use(strip);

function getPostIds() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

function getPostData(filename) {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filePath = path.join(postsDirectory, filename);

  const fileContents = fs.readFileSync(filePath, "utf8");
  const matterResult = matter(fileContents);

  const splittedContents = matterResult.content.split("\n");
  let previewParagraph = "";
  for (let i = 0; i < splittedContents.length; i++) {
    if (splittedContents[i].trim() !== "") {
      previewParagraph = splittedContents[i].trim();
      break;
    }
  }

  // Clean all markdown
  previewParagraph = String(markCleaner.processSync(previewParagraph));

  return {
    filePath,
    previewParagraph,
    content: matterResult.content,
    ...(matterResult.data as PostData),
  };
}

function getPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(getPostData);

  return posts.sort(({ Date: a }, { Date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export { getPostData, getPosts, getPostIds };
