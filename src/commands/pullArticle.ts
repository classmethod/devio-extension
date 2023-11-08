import * as vscode from "vscode";
import * as util from "../util";
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
      const apiClient = contentfulClient.getApiClient();
      const spaceId = contentfulClient.getSpaceId();

      let space = await apiClient.getSpace(spaceId);
      let env = await space.getEnvironment('master');
      let entry = await env.getEntry(entryId);
      let content = entry.fields.content;

      // 記事内容
      const text = new TextEncoder().encode(content['en-US']);
      // 記事の保存先のUriを作成
      const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
      // ファイルを作成
      await vscode.workspace.fs.writeFile(fileUri, text);

      //Stateに保存
      // let obj = new Foo("aaaa");
      // util.saveState<Foo>(extension,entryId,obj);
    

      //Treeview update
      await vscode.commands.executeCommand("devio-extension.refresh-entry");

      vscode.window.showInformationMessage("記事をpullしました");
    }
  };
};