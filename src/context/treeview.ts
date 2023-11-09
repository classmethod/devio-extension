import * as vscode from "vscode";
import * as util from "../util";
import { AppContext } from "../extension";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";
import { WebViewProvider } from "../webview/webViewProvider";

export const initializeTreeView = (context: AppContext, tvProvider: ArticlesTreeViewProvider,
  webvProvider: WebViewProvider): vscode.Disposable[] => {
  //let panel: vscode.WebviewPanel | undefined;

  const treeView = vscode.window.createTreeView("devio-articles-treeview", {
    treeDataProvider: tvProvider,
  });

  let panel: vscode.WebviewView | undefined;

  treeView.onDidChangeSelection((event) => {
    const selectedItem = event.selection[0]; // 選択されたアイテム
    if(selectedItem.resourceUri !== undefined) {
      const entryId = util.getEntryIdFromUri(selectedItem.resourceUri);
      webvProvider.updateContent(entryId);
    }

    //webvProvider.updateContent(selectedItem.label?.toString());
    // if (panel) {
    //     panel.webview.html = `<html><body>${selectedItem.label}</body></html>`;
    //     panel.show(true);
    // } else {
    //     panel = window.createWebviewView('myWebview', {
    //         treeDataProvider: myTreeDataProvider,
    //         webviewOptions: {
    //             retainContextWhenHidden: true
    //         }
    //     });

    //     context.subscriptions.push(panel);

    //     panel.webview.html = '<html><body>Webview Content</body></html>';
    //     panel.show(true);
    // }
  });
  // treeView.onDidChangeSelection(async (e) => {
  //   const node = e.selection[0];
  //   if (node) {
  //     // パネルがまだ存在しなければ新しく作成します。
  //     if (!panel) {
  //       panel = vscode.window.createWebviewPanel(
  //         'detail',
  //         'Details',
  //         vscode.ViewColumn.Two,
  //         { enableScripts: true,retainContextWhenHidden: true, }
  //       );

  //       // パネルが閉じられたときには変数をクリアします。
  //       panel.onDidDispose(() => {
  //         panel = undefined;
  //       }, null, context.extension.subscriptions);
  //     }

  //     // タイトルと内容を更新します。
  //     panel.title = 'Details for ' + node.label;
  //     let htmlContent = `<h1>${node.label}</h1>`;
  //     if (node.label === 'Option 1') {
  //       htmlContent += '<p>You selected Option 1</p>';
  //     } else if (node.label === 'Option 2') {
  //       htmlContent += '<p>You selected Option 2</p>';
  //     }
  //     panel.webview.html = htmlContent;

  //     // パネルを表示します。
  //     panel.reveal();
  //   }
  // });

  return [treeView];
};
