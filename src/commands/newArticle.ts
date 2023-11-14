import * as vscode from "vscode";
import * as util from "../util";
import { ArticleContent } from "../models/article";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";

/** 記事の新規作成コマンドの実装 */
export const newArticleCommand = (context: AppContext) => {
  return async () => {

    const { articlesFolderUri, extension } = context;
    //Contentfulに記事を作成
    const contentfulClient = ContentfulClient.getInstance();
    let newEntry = await contentfulClient.createNewEntry();
    const entryId = newEntry.sys.id;
    const title = newEntry.fields.title['en-US'];
    const content = newEntry.fields.content['en-US'];
    const slug = newEntry.fields.slug['en-US'];
    // 記事内容
    const text = new TextEncoder().encode(content);
    // 記事の保存先のUriを作成
    const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
    // ファイルを作成
    await vscode.workspace.fs.writeFile(fileUri, text);
    //Stateに保存    
    let article = new ArticleContent(fileUri, title, content, slug);
    util.saveState<ArticleContent>(extension, entryId, article);
    //Treeview update
    await vscode.commands.executeCommand("devio-extension.refresh-entry");

    vscode.window.showInformationMessage("記事を作成しました");

  };
};