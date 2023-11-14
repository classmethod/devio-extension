import * as vscode from 'vscode';
import * as util from '../util';
import { AppContext } from '../extension';
import { ContentfulClient } from "../contentful/client";
import { ArticleContent } from "../models/article";

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
            // util.diff(entry.fields.content['en-US'],text).forEach((diffs)=>{
            //     let [op, text] = diffs;
            //     if (op === -1) {
            //         console.log(`Deleted: ${text}`);
            //     } else if (op === 1) {
            //         console.log(`Inserted: ${text}`);
            //     }
            // });

            //entry update
            entry.fields.content['en-US'] = text;
            entry.update().then((updated) => {
                //state update
                const articlesFolderUri = context.articlesFolderUri;
                let title = entry.fields.title['en-US'];
                let content = entry.fields.content['en-US'];
                let slug = entry.fields.slug['en-US'];
                let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
                let article = new ArticleContent(fileUri,title,content,slug);
                util.saveState<ArticleContent>(context.extension,entryId,article);
                //vscode.window.showInformationMessage("記事を保存しました");
                vscode.window.setStatusBarMessage("記事を保存しました",3000);
            });


        }
    });

    return disposable;
}