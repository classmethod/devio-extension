import * as vscode from "vscode";
import { initializeCommands } from "./context/commands";

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

  const context: AppContext = {
    extension: extensionContext,
    articlesFolderUri: vscode.Uri.joinPath(workspaceUri, "articles"),
  };

  extensionContext.subscriptions.push(
    ...initializeCommands(context) // コマンドの初期化処理
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
