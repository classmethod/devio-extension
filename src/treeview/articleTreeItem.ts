import * as vscode from "vscode";
import { ArticleContent } from "../models/article";

export class ArticleTreeItem extends vscode.TreeItem {
  constructor(content: ArticleContent) {
    super("", vscode.TreeItemCollapsibleState.None);

    // VSCode のデフォルトの挙動を有効にする
    this.resourceUri = content.uri;

    // 記事のタイトルを TreeItem に表示
    this.label = content.title;

    // TreeItem をクリックしたときに対応するファイルを開く
    this.command = {
      command: "vscode.open",
      title: "記事ファイルを開く",
      arguments: [content.uri],
    };

    // 記事の状態を表示する
    this.description = [content.slug,].join("・");
  }
}