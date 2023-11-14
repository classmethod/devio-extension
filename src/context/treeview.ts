import * as vscode from "vscode";
import * as util from "../util";
import { AppContext } from "../extension";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";
import { WebViewProvider } from "../webview/webViewProvider";

export const initializeTreeView = (context: AppContext, tvProvider: ArticlesTreeViewProvider,
  webvProvider: WebViewProvider): vscode.Disposable[] => {

  const treeView = vscode.window.createTreeView("devio-articles-treeview", {
    treeDataProvider: tvProvider,
  });

  treeView.onDidChangeSelection((event) => {
    const selectedItem = event.selection[0]; // 選択されたアイテム
    if(selectedItem.resourceUri !== undefined) {
      const entryId = util.getEntryIdFromUri(selectedItem.resourceUri);
      webvProvider.updateContent(entryId);
    }
  });
  return [treeView];
};
