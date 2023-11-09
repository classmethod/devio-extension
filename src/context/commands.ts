import * as vscode from "vscode";
import { AppContext } from "../extension";
import { newArticleCommand } from "../commands/newArticle";
import { updateArticleCommand } from "../commands/updateArticle";
import { listArticleCommand } from "../commands/listArticle";
import { pullArticleCommand } from "../commands/pullArticle";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";

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
    // Refresh Treeview
    vscode.commands.registerCommand('devio-extension.refresh-entry',
      () => tviewProvider.refresh())];

};