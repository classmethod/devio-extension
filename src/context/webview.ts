import * as vscode from "vscode";
import { AppContext } from "../extension";
import { WebViewProvider } from "../webview/webViewProvider";

export const initializeWebView = (context: AppContext, webViewProvider: WebViewProvider): vscode.Disposable[] => {
  // Entry WebView
  context.extension.subscriptions.push(
    vscode.window.registerWebviewViewProvider("devio-webview", webViewProvider));

  return [];
};