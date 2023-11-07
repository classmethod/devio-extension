import * as vscode from "vscode";
import { AppContext } from "../extension";
import { WebViewProvider } from "../webview/webViewProvider";


export const initializeWebView = (context: AppContext): vscode.Disposable[] => {
  const webViewProvider = new WebViewProvider(context);

  // WebView を登録
  context.extension.subscriptions.push(
    vscode.window.registerWebviewViewProvider("devio-webview", webViewProvider));
  
  return [];
};
