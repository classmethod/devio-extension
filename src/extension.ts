import * as vscode from "vscode";
import { initializeCommands } from "./context/commands";
import { initializeTreeView } from "./context/treeview";
import { initializeWebView } from "./context/webview";
import { WebViewProvider } from "./webview/webViewProvider";
import { ArticlesTreeViewProvider } from "./treeview/articlesTreeViewProvider";

/** 拡張内の共通の情報をまとめたオブジェクト */
export interface AppContext {
	extension: vscode.ExtensionContext
	articlesFolderUri: vscode.Uri; // 記事コンテンツを格納しているフォルダーへのUri
}

// 拡張がアクティベートされる時に実行される関数
export function activate(extensionContext: vscode.ExtensionContext) {
	const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;

	if (!workspaceUri) {
		return vscode.window.showErrorMessage("ワークスペースがありません");
	}

	//プロパティ確認
	const confGeneral = vscode.workspace.getConfiguration('contentful.general');
	vscode.window.showInformationMessage('contentful.general > '
		+ 'Access Token: ' + confGeneral.get('accessToken')
		+ ', Space Id: ' + confGeneral.get('spaceId'));

	const context: AppContext = {
		extension: extensionContext,
		articlesFolderUri: vscode.Uri.joinPath(workspaceUri, "articles"),
	};

	const tviewProvider = new ArticlesTreeViewProvider(context);
	extensionContext.subscriptions.push(
		...initializeCommands(context,tviewProvider),
		...initializeTreeView(context,tviewProvider),
		...initializeWebView(context),
	);
	
	//ボタンを押すとコマンド実行
	// const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	// button.command = 'devio-extension.list-article';
	// button.text = 'XXXXXXXXXXXXXXXX';
	// //extensionContext.subscriptions.push(button);
	// button.show();
}

// This method is called when your extension is deactivated
export function deactivate() { }
