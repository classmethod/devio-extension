import * as vscode from 'vscode';
import * as util from '../util';
import * as contenfulUtil from "../contentful/contentfulUtil";
import { AppContext } from '../extension';
import { ContentfulClient } from "../contentful/client";
import { ArticleContent } from "../models/article";
import * as tag from "../models/tag";
import { WebViewProvider } from "../webview/webViewProvider";

// diff channel
let channel = vscode.window.createOutputChannel("Diff Output");
// Flag whether to display diffs or not.
const isDiff: boolean = vscode.workspace.getConfiguration('contentful.general').get('diff') ?? false;

/**
 * diff strings.
 * @param entryId Entry ID 
 * @param text1 
 * @param text2 
 */
function diff(entryId: string, text1: string, text2: string) {
    if (isDiff) {
        channel.appendLine(`[Date] ${new Date().toLocaleString()}`);
        channel.appendLine(`[EntryID] ${entryId}`);
        channel.appendLine(`[Diff]`);
        util.diff(text1, text2).forEach((diffs) => {
            let [op, text] = diffs;
            if (op === -1) {
                channel.appendLine(`Deleted:`);
                channel.appendLine(`${text}`);
            } else if (op === 1) {
                channel.appendLine(`Inserted:`);
                channel.appendLine(`${text}`);
            }
        });
        channel.show();
    }
}

/**
 * lisneter executed each time a Markdown file is saved.
 * @param context AppContext
 * @param webvProvider  WebViewProvider
 * @returns Disposable
 */
export function initializeMarkdownSaveListener(context: AppContext, webvProvider: WebViewProvider): vscode.Disposable {
    let disposable = vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
        if (document.languageId === 'markdown') {
            const entryId = util.getEntryIdFromUri(document.uri);

            //元entry取得
            const contentfulClient = ContentfulClient.getInstance();
            let entry = await contentfulClient.getEntry(entryId);
            //保存されたmarkdown取得
            const text = document.getText();

            //テキストの差分表示
            diff(entryId, entry.fields.content['en-US'], text);

            //entry update
            entry.fields.content['en-US'] = text;
            entry.update().then((updated) => {
                //state update
                const articlesFolderUri = context.articlesFolderUri;
                const title = entry.fields.title['en-US'];
                //[id,...]形式からTag[]形式に変換
                const tags: tag.Tag[] = tag.getTagsByIdArray(entry.fields.tags?.["en-US"]);
                const content = entry.fields.content['en-US'];
                const status = contenfulUtil.getStatus(updated);
                const slug = entry.fields.slug['en-US'];
                const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
                const article = new ArticleContent(fileUri, title, tags, content, slug, status);
                util.saveState<ArticleContent>(context.extension, entryId, article);
                webvProvider.updateContent(entryId);
                vscode.window.setStatusBarMessage("記事を保存しました", 3000);
            });


        }
    });

    return disposable;
}