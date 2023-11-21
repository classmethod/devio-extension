import * as vscode from "vscode";
import { AppContext } from "../extension";
import { ArticleTreeItem } from "./articleTreeItem";
import { getArticleContents, ArticleContentError } from "../models/article";

type TreeDataProvider = vscode.TreeDataProvider<vscode.TreeItem>;

export class ArticlesTreeViewProvider implements TreeDataProvider {
  private readonly context: AppContext;

  private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  public items: vscode.TreeItem[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }


  constructor(context: AppContext) {
    this.context = context;
  }

  async getTreeItem(element: vscode.TreeItem): Promise<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (element) {
      return [element];
    }

    const articleContents = await getArticleContents(this.context);
    const treeItems = articleContents.map((result: any) => {
      return ArticleContentError.isError(result)
        ? new vscode.TreeItem("記事の取得に失敗しました")
        : new ArticleTreeItem(result);
    });
    return treeItems;
  }
}