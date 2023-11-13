import * as vscode from "vscode";
import * as util from "../util";
import { AppContext } from "../extension";
import { ArticleContent } from "../models/article";

export class WebViewProvider implements vscode.WebviewViewProvider {

    private _view?: vscode.WebviewView;
    private readonly context: AppContext;
    private readonly message: string;

    constructor(context: AppContext, message: string = "hello!!!") {
        this.context = context;
        this.message = message;
    }

    private getHtmlForWebview(article?: ArticleContent) {

        if (!article) {
            return `
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
                No Selected Article
            </body>
            </html>
            `;
        } else {
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    input {
                        margin-bottom: 10px;
                        width: 100%;
                    }
                </style>
                <script>
                const vscode = acquireVsCodeApi();
                function runCommand() {
                    const title = document.getElementById('title').value;
                    const slug = document.getElementById('slug').value;
                    const language = document.getElementById('language').value;
                    
                    vscode.postMessage({
                        command: 'updateArticle',
                        title: title,
                        slug: slug,
                        language: language
                    });
                }
                </script>
            </head>
            <body>
                <label for="title">Title:</label><br>
                <input type="text" id="title" name="title" value="${article.title}"><br>
                <label for="slug">Slug:</label><br>
                <input type="text" id="slug" name="slug" value="${article.slug}"><br>
                <label for="language">Language:</label><br>
                <input type="text" id="language" name="language" value="${article.language}"><br>
                <button onclick="runCommand();">Run Command</button>
            </body>
            </html>
        `;
        }
    }
    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
        };

        // Webviewからのメッセージをハンドル
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'updateArticle': // HTML側でpostMessageに指定したコマンド
                        vscode.commands.executeCommand('devio-extension.update-article', message.title, message.slug, message.language);
                        break;
                }
            },
            undefined,
            this.context.extension.subscriptions
        );
        webviewView.webview.html = this.getHtmlForWebview();
    }

    /**
     * EntryIDをキーにstateに保存された情報でWebViewをupdateする.
     * @param entryId Entry ID
     */
    public updateContent(entryId: string) {
        if (this._view) {
            const article = util.getState<ArticleContent>(this.context.extension, entryId);
            this._view.webview.html = this.getHtmlForWebview(article);
        }
    }
}