import * as vscode from "vscode";
import * as util from "../util";
import { ArticleContent } from "../models/article";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";

/**
 * Function to create filePath Uri and save the article state
 * @param {AppContext} context - context of the application
 * @param {string} entryId - id of the entry
 * @param {vscode.Uri} uri - uri of the article
 * @param {string} title - title of the article
 * @param {string} content - article content
 * @param {string} slug - article slug
 */
function saveState(context: AppContext, entryId: string, uri: vscode.Uri, title: string, content: string, slug: string) {
  const { articlesFolderUri, extension } = context;
  let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
  let article = new ArticleContent(fileUri, title, content, slug);
  util.saveState<ArticleContent>(extension, entryId, article);
}

/**
 * Function to list article entries. To be implemented.
 * @return {function} - a function that shows an information message
 */
export const listArticleCommand = (context: AppContext) => {
  return async () => {
    vscode.window.showInformationMessage("記事リストを返します");
  };
};

/**
 * Function to create a new article entry
 * @return {function} - a function that creates a new article entry
 */
export const newArticleCommand = (context: AppContext) => {
  return async () => {
    // Preparation
    const { articlesFolderUri } = context;
    let contentfulClient = ContentfulClient.getInstance();

    // Creating entry in Contentful
    const newEntry = await contentfulClient.createNewEntry();
    let content = newEntry.fields.content['en-US'];
    let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${newEntry.sys.id}.md`);

    // Writing the entry content into file and save state
    if (await util.fileExists(fileUri) === false) {
      await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(content));
      saveState(context, newEntry.sys.id, fileUri, newEntry.fields.title['en-US'], content, newEntry.fields.slug['en-US']);
    }

    // Updating Treeview
    await vscode.commands.executeCommand("devio-extension.refresh-entry");
    vscode.window.showInformationMessage("記事を作成しました");
  };
};

/**
 * Function to update existing article entry
 * @return {function} - a function to update an article entry
 */
export const updateArticleCommand = (context: AppContext, entryId?: any, title?: any, slug?: any, language?: any) => {
  return async (entryId?: any, title?: any, slug?: any, language?: any) => {
    let contentfulClient = ContentfulClient.getInstance();
    let entry = await contentfulClient.getEntry(entryId);

    // Updating entry
    entry.fields.title['en-US'] = title;
    entry.fields.slug['en-US'] = slug;
    entry.fields.language['en-US'] = language;

    entry.update().then(async (updated) => {
      // Updating state
      let fileUri = vscode.Uri.joinPath(context.articlesFolderUri, `${entryId}.md`);
      saveState(context, entryId, fileUri, title, updated.fields.content['en-US'], slug);

      // Updating Treeview
      await vscode.commands.executeCommand("devio-extension.refresh-entry");
      vscode.window.setStatusBarMessage("記事を保存しました", 3000);
    });
  };
};

/**
 * Function to pull existing article entry
 * @return {function} - a function to pull an article entry
 */
export const pullArticleCommand = (context: AppContext) => {
  return async () => {
    // Preparation
    const { articlesFolderUri } = context;
    let entryId = await vscode.window.showInputBox({ title: '取得する記事のEntry IDを入力してください' });

    if (entryId !== undefined) {
      // Get entry from Contentful and save state
      let contentfulClient = ContentfulClient.getInstance();
      let entry = await contentfulClient.getEntry(entryId);
      let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);

      if (await util.fileExists(fileUri) === false) {
        await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(entry.fields.content['en-US']));

        // Updating state
        saveState(context, entryId, fileUri, entry.fields.title['en-US'], entry.fields.content['en-US'], entry.fields.slug['en-US']);
      }

      // Updating Treeview
      await vscode.commands.executeCommand("devio-extension.refresh-entry");
      vscode.window.showInformationMessage("記事をpullしました");
    }
  };
};