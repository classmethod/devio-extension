import * as vscode from "vscode";
import * as util from "../util";

import { AppContext } from "../extension";


export class ArticleContent {
  uri: vscode.Uri;
  title: string;
  content: string;
  slug: string;
  language: string;
  entryId:string;

  constructor(uri: vscode.Uri, title: string, content: string, slug: string, language: string = 'ja') {
    this.uri = uri;
    this.entryId = util.getEntryIdFromUri(uri);
    this.title = title;
    this.content = content;
    this.slug = slug;
    this.language = language;
  }
}

/** 記事のエラーを扱うクラス */
export class ArticleContentError extends Error {
  static isError(value: unknown): value is ArticleContentError {
    return value instanceof ArticleContentError;
  }
}

/** 取得処理の結果型 */
export type ArticleContentLoadResult = ArticleContent | ArticleContentError;


/** 記事情報を取得する */
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

/** 記事の一覧を返す */
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