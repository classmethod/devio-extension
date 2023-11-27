import * as vscode from "vscode";
import * as util from "../util";
import { Tag } from "../models/tag";
import { AppContext } from "../extension";
import { ArticleContent, Status } from "../models/article";

export class WebViewProvider implements vscode.WebviewViewProvider {

    private _view?: vscode.WebviewView;
    private readonly context: AppContext;

    constructor(context: AppContext) {
        this.context = context;
    }

    /**
     * TODO archive/unarchive does not work, so stop.
     * Returns executable buttons depending on Status.
     * When DRAFTed you can: Update | Publish | Archive.
     * When PUBLISHED you can only Update | Unpublish | Archive.
     * When ARCHIVED (Unarchive | Publish).
     * When CHANGED (changes after publish) can be: Update | Pulish | Unpublish(DRAFT) | Archive
     * @param status Article Status
     * @returns html string
     */
    private getEnableButtonByStatus(status: Status): string {
        if (status === Status.DRAFT) {
            return `
                <button onclick="updateArticle();">Update</button>
                <button onclick="changeStatusArticle('publish');">記事を公開</button>
                <!-- <button onclick="changeStatusArticle('archive');">Archive</button> -->
            `;
        } else if (status === Status.PUBLISHED) {
            return `
                <button onclick="updateArticle();">Update</button>
                <button onclick="changeStatusArticle('unpublish');">記事を非公開</button>
                <!-- <button onclick="changeStatusArticle('archive');">Archive</button> -->
            `;

        } else if (status === Status.ARCHIVED) {
            return `
            <button onclick="changeStatusArticle('publish');">記事を公開</button>
            <!-- <button onclick="changeStatusArticle('unarchive');">UnArchive</button> -->
            `;
        } else if (status === Status.CHANGED) {
            return `
                <button onclick="updateArticle();">Update</button>
                <button onclick="changeStatusArticle('publish');">記事を公開</button>
                <!-- <button onclick="changeStatusArticle('archive');">Archive</button> -->
                <!-- <button onclick="changeStatusArticle('unarchive');">UnArchive</button> -->
            `;

        } else {
            throw new Error(`Unknown status`);
        }
    }

    /**
     * Returns the tag name string to be displayed in the View.
     * @param tags Tag[]
     * @returns タグ名の,区切り文字列
     */
    private getTagNames(tags: Tag[]): string {
        let prefix = "【";
        let suffix = "】";
        if (!tags || tags.length === 0) {
            return "";
        } else {
            return tags.map(tag => `${prefix}${tag.name}${suffix}`).join(',');
        }
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
            const buttonHtml = this.getEnableButtonByStatus(article.status);
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
                function updateArticle() {
                    const entryId = document.getElementById('entryId').value;
                    const title = document.getElementById('title').value;
                    const slug = document.getElementById('slug').value;
                    const language = document.getElementById('language').value;
                    
                    vscode.postMessage({
                        command: 'updateArticle',
                        entryId : entryId,
                        title: title,
                        slug: slug,
                        language: language
                    });
                }

                function changeStatusArticle(status) {
                    const entryId = document.getElementById('entryId').value;
                    vscode.postMessage({
                        command: 'changeStatusArticle',
                        entryId : entryId,
                        status: status
                    });

                }
                </script>
            </head>
            <body>
                <label for="status">Status:&nbsp;${article.status}</label><br>
                <label for="title">Title:</label><br>
                <input type="text" id="title" name="title" value="${article.title}"><br>
                <label for="tags">Tags:${this.getTagNames(article.tags)}</label><br>
                <label for="slug">Slug:</label><br>
                <input type="text" id="slug" name="slug" value="${article.slug}"><br>
                <label for="language">Language:</label><br>
                <input type="text" id="language" name="language" value="${article.language}"><br>
                <input type="hidden" id="entryId" name="entryId" value="${article.entryId}">
                ${buttonHtml}
                <br>
                ※記事本文はファイルを保存した時点で反映されます
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
                        vscode.commands.executeCommand('devio-extension.update-article',
                            message.entryId, message.title, message.slug, message.language).then(() => {
                                //update view
                                this.updateContent(message.entryId);
                            });
                        break;
                    case 'changeStatusArticle':
                        vscode.commands.executeCommand('devio-extension.change-status-article',
                            message.entryId, message.status).then(() => {
                                //update view
                                this.updateContent(message.entryId);
                            });
                        break;
                }
            },
            undefined,
            this.context.extension.subscriptions
        );
        webviewView.webview.html = this.getHtmlForWebview();
    }

    /**
     * Update the WebView with the information stored   
     * in the state using the EntryID as key.
     * @param entryId Entry ID
     */
    public updateContent(entryId: string) {
        if (this._view) {
            const article = util.getState<ArticleContent>(this.context.extension, entryId);
            this._view.webview.html = this.getHtmlForWebview(article);
        }
    }
}