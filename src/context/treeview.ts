import * as vscode from "vscode";
import { AppContext } from "../extension";
import { ArticlesTreeViewProvider } from "../treeview/articlesTreeViewProvider";

export const initializeTreeView = (context: AppContext): vscode.Disposable[] => {
  const articlesTreeViewProvider = new ArticlesTreeViewProvider(context);

  return [
    vscode.window.createTreeView("devio-articles-treeview", {
      treeDataProvider: articlesTreeViewProvider,
    }),
  ];
};