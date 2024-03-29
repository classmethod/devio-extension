import * as vscode from "vscode";
import * as util from "../util";

import { AppContext } from "../extension";
import * as tag from "./tag";

/**
 * Enum for the status of an entry.
 */
export enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  CHANGED = 'CHANGED',
}

export class ArticleContent {
  uri: vscode.Uri;
  title: string;
  tags: tag.Tag[];
  content: string;
  slug: string;
  language: string;
  entryId: string;
  status: Status;

  constructor(uri: vscode.Uri, title: string, tags: tag.Tag[], content: string, slug: string, language: string, status: Status) {
    this.uri = uri;
    this.entryId = util.getEntryIdFromUri(uri);
    this.title = title;
    this.tags = tags;
    this.content = content;
    this.slug = slug;
    this.language = language;
    this.status = status;
  }
}

/** Article Error Class */
export class ArticleContentError extends Error {
  static isError(value: unknown): value is ArticleContentError {
    return value instanceof ArticleContentError;
  }
}

export type ArticleContentLoadResult = ArticleContent | ArticleContentError;


/** Get Article info */
export async function loadArticleContent(
  context: AppContext,
  uri: vscode.Uri
): Promise<ArticleContentLoadResult> {

  //entryIdを取得
  const entryId = util.getEntryIdFromUri(uri);

  //Stateから取得
  const article = util.getState<ArticleContent>(context.extension, entryId);
  if (article === undefined) {
    return new ArticleContentError("記事の取得に失敗しました");
  } else {
    return article;
  }
}

/** Get Articles List */
export async function getArticleContents(
  context: AppContext
): Promise<ArticleContentLoadResult[]> {
  const rootUri = context.articlesFolderUri;

  // `./articles` 内のファイル一覧を取得
  const files = await vscode.workspace.fs.readDirectory(rootUri);
  // markdown ファイルのみの vscode.Uri 配列を返す
  const markdowns = files.flatMap((file) =>
    file[1] === vscode.FileType.File && file[0].endsWith(".md")
      ? [vscode.Uri.joinPath(rootUri, file[0])]
      : []
  );

  const results = [];
  for (const uri of markdowns) {
    const result = await loadArticleContent(context, uri);
    results.push(result);
  }

  return results;
}