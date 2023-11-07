import * as vscode from "vscode";
import { AppContext } from "../extension";
import { newArticleCommand } from "../commands/newArticle";
import { listArticleCommand } from "../commands/listArticle";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";

export const initializeCommands = (context: AppContext, tviewProvider:ArticlesTreeViewProvider): vscode.Disposable[] => {
  return [
    // Create new article
    vscode.commands.registerCommand(
      "devio-extension.new-article",
      newArticleCommand(context)
    ),
    // List Articles
    vscode.commands.registerCommand(
        "devio-extension.list-article",
        listArticleCommand(context)
      ),
    vscode.commands.registerCommand('devio-extension.refresh-entry', 
      () => tviewProvider.refresh())];
};