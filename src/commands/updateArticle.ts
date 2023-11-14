import * as vscode from "vscode";
import * as util from "../util";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";
import { ArticleContent } from "../models/article";


export let updateArticleCommand = (context: AppContext, entryId?: any, title?: any, slug?: any, language?: any) => {
  return async (entryId?: any, title?: any, slug?: any, language?: any) => {
    vscode.window.showInformationMessage(`entryId:${entryId},title:${title},slug:${slug},language:${language}`);
    //Get Base Entry
    const contentfulClient = ContentfulClient.getInstance();
    let entry = await contentfulClient.getEntry(entryId);
    entry.fields.title['en-US'] = title;
    entry.fields.slug['en-US'] = slug;
    entry.fields.language['en-US'] = language;
    //Entry update
    entry.update().then((updated) => {
        //state update
        const articlesFolderUri = context.articlesFolderUri;
        let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
        let content = updated.fields.content['en-US'];
        let article = new ArticleContent(fileUri,title,content,slug);
        util.saveState<ArticleContent>(context.extension,entryId,article);
        vscode.window.setStatusBarMessage("記事を保存しました",3000);
    });


  };
};