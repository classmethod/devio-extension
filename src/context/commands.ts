import * as vscode from "vscode";
import { AppContext } from "../extension";
import {
  newArticleCommand,
  updateArticleCommand,
  listArticleCommand,
  pullArticleCommand,
  changeStatusCommand
} from "../commands/article";
import { storeTagCommand } from "../commands/tag";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";
import { ContentfulClient } from "../contentful/client";

export const initializeCommands = (context: AppContext, tviewProvider: ArticlesTreeViewProvider): vscode.Disposable[] => {
  return [
    // Create new article
    vscode.commands.registerCommand(
      "devio-extension.new-article",
      newArticleCommand(context)
    ),
    // Get article from Contentful
    vscode.commands.registerCommand(
      "devio-extension.pull-article",
      pullArticleCommand(context)
    ),
    // List Articles
    vscode.commands.registerCommand(
      "devio-extension.list-article",
      listArticleCommand(context)
    ),
    // Update article
    vscode.commands.registerCommand(
      "devio-extension.update-article",
      updateArticleCommand(context)
    ),

    // Change Status article
    vscode.commands.registerCommand(
      "devio-extension.change-status-article",
      changeStatusCommand(context)
    ),

    // Get&Store Latest Tags
    vscode.commands.registerCommand(
      "devio-extension.store-tags",
      storeTagCommand(context)
    ),
    // Open Browser
    vscode.commands.registerCommand(
      "devio-extension.open-browser",
      () => {
        const spaceId = ContentfulClient.getInstance().getSpaceId();
        const url = vscode.Uri.parse(`https://app.contentful.com/spaces/${spaceId}/home`);
        vscode.env.openExternal(url);
      }),
    // Refresh Treeview
    vscode.commands.registerCommand('devio-extension.refresh-entry',
      () => tviewProvider.refresh())];
};