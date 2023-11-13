import * as vscode from "vscode";
import { initializeCommands } from "./context/commands";
import { initializeTreeView } from "./context/treeview";
import { initializeWebView } from "./context/webview";
import * as listeners from "./context/listeners";

import { WebViewProvider } from "./webview/webViewProvider";
import { ArticlesTreeViewProvider } from "./treeview/articlesTreeViewProvider";
import * as util from "./util";

/** 拡張内の共通の情報をまとめたオブジェクト */
export interface AppContext {
	extension: vscode.ExtensionContext
	articlesFolderUri: vscode.Uri;
	conf:vscode.WorkspaceConfiguration
}

class Foo {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

// 拡張がアクティベートされる時に実行される関数
export function activate(extensionContext: vscode.ExtensionContext) {
	const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;

	if (!workspaceUri) {
		return vscode.window.showErrorMessage("ワークスペースがありません");
	}

	const context: AppContext = {
		extension: extensionContext,
		articlesFolderUri: vscode.Uri.joinPath(workspaceUri, "articles"),
		conf:vscode.workspace.getConfiguration('contentful.general')
	};

	const tviewProvider = new ArticlesTreeViewProvider(context);
	const webViewProvider = new WebViewProvider(context);
	extensionContext.subscriptions.push(
		...initializeCommands(context,tviewProvider),
		...initializeTreeView(context,tviewProvider,webViewProvider),
		...initializeWebView(context,webViewProvider),
		listeners.initializeMarkdownSaveListener(context)
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
