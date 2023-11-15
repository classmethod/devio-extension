import * as vscode from 'vscode';
import * as util from '../util';
import { AppContext } from '../extension';
import { ContentfulClient } from "../contentful/client";
import { ArticleContent } from "../models/article";

// diff表示用チャンネル
let channel = vscode.window.createOutputChannel("Diff Output");
// diff表示するかどうかのフラグ
const isDiff: boolean = vscode.workspace.getConfiguration('contentful.general').get('diff') ?? false;

/**
 * diff strings.
 * @param entryId Entry ID 
 * @param text1 
 * @param text2 
 */
function diff(entryId:string, text1: string, text2: string) {
    if(isDiff) {
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
 * Markdownファイルを保存されるたびに実行されるlisneter
 * @param context 
 * @returns Disposable
 */
export function initializeMarkdownSaveListener(context: AppContext): vscode.Disposable {
    let disposable = vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
        if (document.languageId === 'markdown') {
            const entryId = util.getEntryIdFromUri(document.uri);

            //元entry取得
            const contentfulClient = ContentfulClient.getInstance();
            let entry = await contentfulClient.getEntry(entryId);
            //保存されたmarkdown取得
            const text = document.getText();

            //テキストの差分表示
            diff(entryId,entry.fields.content['en-US'],text);

            //entry update
            entry.fields.content['en-US'] = text;
            entry.update().then((updated) => {
                //state update
                const articlesFolderUri = context.articlesFolderUri;
                let title = entry.fields.title['en-US'];
                let content = entry.fields.content['en-US'];
                let slug = entry.fields.slug['en-US'];
                let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
                let article = new ArticleContent(fileUri, title, content, slug);
                util.saveState<ArticleContent>(context.extension, entryId, article);
                //vscode.window.showInformationMessage("記事を保存しました");
                vscode.window.setStatusBarMessage("記事を保存しました", 3000);
            });


        }
    });

    return disposable;
}