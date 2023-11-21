import * as vscode from "vscode";
import * as path from 'path';
import * as util from "../util";
import * as tag from "../models/tag";
import * as contenfulUtil from "../contentful/contentfulUtil";
import { ArticleContent } from "../models/article";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";
import { Entry } from "contentful-management";

/**
 * Function to create filePath Uri and save the article state
 * @param {AppContext} context - context of the application
 * @param {string} entryId - id of the entry
 * @param {Entry} entry - Entry Object to save
 */
function saveState(context: AppContext, entryId: string, entry: Entry) {
  const { articlesFolderUri, extension } = context;
  const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${entryId}.md`);
  const status = contenfulUtil.getStatus(entry);
  const tags: tag.Tag[] = tag.getTagsByIdArray(entry.fields.tags?.["en-US"]);
  let article = new ArticleContent(fileUri,
    entry.fields.title['en-US'],
    tags,
    entry.fields.content['en-US'],
    entry.fields.slug['en-US'],
    status);
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
    let fileUri = vscode.Uri.joinPath(articlesFolderUri, `${newEntry.sys.id}.md`);

    // Writing the entry content into file and save state
    if (await util.fileExists(fileUri) === false) {
      await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(newEntry.fields.content['en-US']));
      saveState(context, newEntry.sys.id, newEntry);
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
      saveState(context, entryId, updated);
      // Updating Treeview
      await vscode.commands.executeCommand("devio-extension.refresh-entry");
      vscode.window.setStatusBarMessage("記事を保存しました", 3000);
    });
  };
};

/**
 * Function to pull existing article entry from Contentful
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
        saveState(context, entryId, entry);
      }

      // Updating Treeview
      await vscode.commands.executeCommand("devio-extension.refresh-entry");
      vscode.window.showInformationMessage("記事をpullしました");
    }
  };
};

/**
 * Function to change status(publish/unpublish) article entry
 * @return {function} - a function to change status an article entry
 */
export const changeStatusCommand = (context: AppContext, entryId?: any, status?: any) => {
  return async (entryId?: any, status?: any) => {
    let contentfulClient = ContentfulClient.getInstance();
    let beforeEntry = await contentfulClient.getEntry(entryId);

    let updated: Entry;
    let message: string;

    switch (status) {
      case 'publish':
        updated = await beforeEntry.publish();
        message = "記事を公開しました";
        break;
      case 'unpublish':
        updated = await beforeEntry.unpublish();
        message = "記事を非公開にしました";
        break;
      case 'archive':
        updated = await beforeEntry.archive();
        message = "記事をアーカイブしました";
        break;
      case 'unarchive':
        updated = await beforeEntry.unarchive();
        message = "アーカイブ記事を戻しました";
        break;
      default:
        throw new Error("Unknown status");
    }

    // Updating state
    saveState(context, entryId, updated);
    // Updating Treeview
    await vscode.commands.executeCommand("devio-extension.refresh-entry");
    vscode.window.setStatusBarMessage(message, 3000);
  };
};

/**
 * Function to preview entry(open contentful via browser)
 * @return {function} - a function to preview 
 */
export const previewCommand = (context: AppContext) => {
  return async () => {
    //get active editor
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const entryId = path.basename(editor.document.fileName).replace(/\.md$/, "");
      const previewUrl = contenfulUtil.getEntryDetailUrl(entryId);
      const url = vscode.Uri.parse(previewUrl);
      vscode.env.openExternal(url);
    } else {
      vscode.window.showInformationMessage('No active editor!');
    }
  };
};
