import * as vscode from "vscode";
import { AppContext } from "../extension";

export class WebViewProvider implements vscode.WebviewViewProvider {

    private readonly context: AppContext;
  
    constructor(context: AppContext) {
      this.context = context;
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true,
        };
        webviewView.webview.html = `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WebView Example</title>
            </head>
            <body>
            <div id="app" />

            <script>
                const app = document.getElementById("app");
                app.innerText = "Hello World!";
            </script>
            </body>
            </html>
        `;
    }
}