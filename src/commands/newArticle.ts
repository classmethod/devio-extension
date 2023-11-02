import * as vscode from "vscode";
import { AppContext } from "../extension";

/** 14文字のランダムな文字列を返す */
export const generateSlug = (): string => {
  const a = Math.random().toString(16).substring(2);
  const b = Math.random().toString(16).substring(2);
  return `${a}${b}`.slice(0, 14);
};

/** ランダムに Emoji を返す */
export const pickRandomEmoji = (): string => {
  const emojiList =["😺","📘","📚","📑","😊","😎","👻","🤖","😸","😽","💨","💬","💭","👋", "👌","👏","🙌","🙆","🐕","🐈","🦁","🐷","🦔","🐥","🐡","🐙","🍣","🕌","🌟","🔥","🌊","🎃","✨","🎉","⛳","🔖","📝","🗂","📌"]; // prettier-ignore
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

/** 記事のテンプレート文字列を生成する関数 */
const generateArticleTemplate = () =>
  [
    "---",
    `title: ""`,
    `emoji: "${pickRandomEmoji()}"`,
    `type: "tech" # tech: 技術記事 / idea: アイデア`,
    "topics: []",
    `published: false`,
    "---",
  ].join("\n") + "\n";

/** 記事の新規作成コマンドの実装 */
export const newArticleCommand = (context: AppContext) => {
  return async () => {
    const { articlesFolderUri } = context;

    // 記事のテンプレート文字列を作成
    const text = new TextEncoder().encode(generateArticleTemplate());

    // 記事の保存先のUriを作成
    const aritcleSlug = generateSlug()
    const fileUri = vscode.Uri.joinPath(articlesFolderUri, `${aritcleSlug}.md`)

    // ファイルを作成
    await vscode.workspace.fs.writeFile(fileUri, text);

    vscode.window.showInformationMessage("記事を作成しました");
  };
};