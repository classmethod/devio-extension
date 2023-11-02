import * as vscode from "vscode";
import { ArticleContent, getArticleTitle } from "../models/article";

/** 記事を表示するTreeItem */
export class ArticleTreeItem extends vscode.TreeItem {
  constructor(content: ArticleContent) {
    super("", vscode.TreeItemCollapsibleState.None);

    // VSCode のデフォルトの挙動を有効にするのに必要
    this.resourceUri = content.uri;

    // 記事のタイトルを TreeItem に表示する
    this.label = getArticleTitle({
      emoji: content.value.emoji,
      title: content.value.title,
      filename: content.filename,
    });

    // TreeItem をクリックしたときに対応するファイルを開く
    this.command = {
      command: "vscode.open",
      title: "記事ファイルを開く",
      arguments: [content.uri],
    };

    // 記事の状態を表示する
    this.description = [
      content.value.published ? "公開" : "非公開",
      content.value.slug,
    ]
      .join("・");
  }
}