import * as vscode from "vscode";
import { AppContext } from "../extension";


export let updateArticleCommand = (context: AppContext,title?:any, slug?:any, language?:any) => {
  return async (title?:any, slug?:any, language?:any) => {
    vscode.window.showInformationMessage(`title:${title},slug:${slug},language:${language}`);
  };
};