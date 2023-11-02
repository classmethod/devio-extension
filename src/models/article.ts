import * as vscode from "vscode";
import { AppContext } from "../extension";
import { parse as parseYaml } from "yaml";

/** 記事のFrontMatterの情報 */
export interface Article {
  slug?: string;
  type?: "tech" | "idea";
  title?: string;
  emoji?: string;
  topics?: string[];
  published?: boolean;
  published_at?: string;
  publication_name?: string;
}

/** 記事の情報を含んだ型 */
export interface ArticleContent {
  value: Article;
  uri: vscode.Uri;
  filename: string;
  markdown: string;
}

/** 記事のエラーを扱うクラス */
export class ArticleContentError extends Error {
  static isError(value: unknown): value is ArticleContentError {
    return value instanceof ArticleContentError;
  }
}

/** 取得処理の結果型 */
export type ArticleContentLoadResult = ArticleContent | ArticleContentError;

/** front matterを取得するための正規表現 */
export const FRONT_MATTER_PATTERN = /^(-{3}(?:\n|\r\n)([\w\W]+?)(?:\n|\r\n)-{3})/;

/** Front Matterをオブジェクトに変換する */
export function parseFrontMatter(text: string): Record<string, string | undefined> {
  const frontMatter = FRONT_MATTER_PATTERN.exec(text)?.[2];
  const result = frontMatter ? parseYaml(frontMatter) : {};

  if (typeof result !== "object") return {};
  if (Array.isArray(result)) return {};

  return result;
}

/** 記事のタイトルを返す */
export function getArticleTitle({
    emoji,
    title,
    filename,
  }: {
    emoji?: string;
    title?: string;
    filename?: string;
  }): string {
    if (title) return `${emoji}${title}`;
    if (filename) return `${emoji}${filename}`;
  
    return "タイトルが設定されていません";
  }

  
  /** 記事情報を取得する */
 export async function loadArticleContent(
    uri: vscode.Uri
  ): Promise<ArticleContentLoadResult> {
    try {
      return vscode.workspace
        .openTextDocument(uri)
        .then((doc) => createArticleContent(uri, doc.getText()));
    } catch {
      return new ArticleContentError("記事の取得に失敗しました");
    }
  }

  /** Markdown文字列から記事データを作成する */
 export  function createArticleContent(
    uri: vscode.Uri,
    text: string
  ): ArticleContent {
    const filename = uri.path.split("/").slice(-1)[0];
 
    return {
      uri,
      filename,
      value: {
        slug: filename.replace(".md", ""),
        ...parseFrontMatter(text),
      },
      markdown: text.replace(FRONT_MATTER_PATTERN, ""),
    };
  };

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
 
    // 取得結果の配列を返す
    return Promise.all(markdowns.map((uri) => loadArticleContent(uri)));
  }