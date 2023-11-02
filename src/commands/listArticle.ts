import * as vscode from "vscode";
import { AppContext } from "../extension";

export const listArticleCommand = (context: AppContext) => {
  return async () => {
    vscode.window.showInformationMessage("記事リストを返します");
  };
};