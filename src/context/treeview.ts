import * as vscode from "vscode";
import { AppContext } from "../extension";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";

export const initializeTreeView = (context: AppContext, tvProvider:ArticlesTreeViewProvider): vscode.Disposable[] => {
  let panel: vscode.WebviewPanel | undefined;

  const treeView = vscode.window.createTreeView("devio-articles-treeview", {
    treeDataProvider: tvProvider,
  });

  treeView.onDidChangeSelection(async (e) => {
    const node = e.selection[0];
    if (node) {
      // パネルがまだ存在しなければ新しく作成します。
      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          'detail',
          'Details',
          vscode.ViewColumn.Two,
          { enableScripts: true,retainContextWhenHidden: true, }
        );

        // パネルが閉じられたときには変数をクリアします。
        panel.onDidDispose(() => {
          panel = undefined;
        }, null, context.extension.subscriptions);
      }

      // タイトルと内容を更新します。
      panel.title = 'Details for ' + node.label;
      let htmlContent = `<h1>${node.label}</h1>`;
      if (node.label === 'Option 1') {
        htmlContent += '<p>You selected Option 1</p>';
      } else if (node.label === 'Option 2') {
        htmlContent += '<p>You selected Option 2</p>';
      }
      panel.webview.html = htmlContent;

      // パネルを表示します。
      panel.reveal();
    }
  });

  return [treeView];
};

// async function showFormInSidebar(context: vscode.ExtensionContext) {
// 	// ビューを初期化します
// 	const view = vscode.window.createTreeView('formView', {
// 		treeDataProvider: aNodeWithId('form')
// 	});
// 	context.subscriptions.push(view);

// 	// ビューが選択されたときにフォームのwebviewを表示
// 	view.onDidChangeSelection(async (_e) => {
// 		const panel = vscode.window.createWebviewPanel(
// 			'form',
// 			'Form',
// 			vscode.ViewColumn.One,
// 			{ enableScripts: true } // JSを有効にします（フォーム入力など）
// 		);

// 		// メッセージの受信をリッスンします
// 		panel.webview.onDidReceiveMessage(
// 			message => {
// 				switch (message.command) {
// 					case 'submit':
// 						vscode.window.showInformationMessage(message.text);
// 						return;
// 				}
// 			},
// 			undefined,
// 			context.subscriptions
// 		);

// 		// HTMLを設定
// 		let html = fs.readFileSync(
// 			path.join(context.extensionPath, '../form.html'),
// 			{ encoding: 'utf8' }
// 		);
// 		panel.webview.html = html;
// 	});
// }

// function aNodeWithId(id: string) {
// 	const tree = [
// 		{
// 			id: 'form',
// 			label: 'Form'
// 		}
// 	];
// 	return {
// 		getTreeItem: function (node: any) { return node },
// 		getChildren: function (node: any) {
// 			if (node === undefined) {
// 				return tree;
// 			}
// 			return [];
// 		}
// 	};
// }
