import * as vscode from "vscode";
import { AppContext } from "../extension";
import { newArticleCommand } from "../commands/newArticle";
import { listArticleCommand } from "../commands/listArticle";

export const initializeCommands = (context: AppContext): vscode.Disposable[] => {
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
    ];
};