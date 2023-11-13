import * as vscode from "vscode";
import * as util from "../util";
import { ArticleContent } from "../models/article";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";

export const pullArticleCommand = (context: AppContext) => {
  return async () => {

    const { articlesFolderUri , extension} = context;

    const entryId = await vscode.window.showInputBox({
      title: '取得する記事のEntry IDを入力してください'
    });

    if (entryId !== undefined) {

      //Contentfulから記事を取得
      const contentfulClient = ContentfulClient.getInstance();
      let entry = await contentfulClient.getEntry(entryId);
      let title = entry.fields.title['en-US'];
      let content = entry.fields.content['en-US'];
      let slug = entry.fields.slug['en-US'];

      // 記事内容
      const text = new TextEncoder().encode(content);
      // 記事の保存先のUriを作成
      const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
      // ファイルを作成
      await vscode.workspace.fs.writeFile(fileUri, text);
      //Stateに保存    
      let article = new ArticleContent(fileUri,title,content,slug);
      util.saveState<ArticleContent>(extension,entryId,article);
      //Treeview update
      await vscode.commands.executeCommand("devio-extension.refresh-entry");

      vscode.window.showInformationMessage("記事をpullしました");
    }
  };
};