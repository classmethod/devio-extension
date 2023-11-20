## Introducntion

新DevIOの、Contentful記事管理用VSCode Extensionについて解説します。  

## Install

現在は配布されたvsixファイルを手動でインストールします。  

1. Visual Studio Codeを起動
2. サイドバーの最下部にある四角いアイコン (Extensions) をクリック
3. 拡張機能ビューが開いたら、右上の ... （More Actions）メニューをクリック
4. ドロップダウンリストから Install from VSIX... オプションを選択
5. ファイルダイアログが表示されるので、配布されたvsixファイルを選択

## Settings

settings.jsonに下記情報を追記してください。
(Shift+Cmd+Pでsettingsと入力)

```json
"contentful.general": {
    "accessToken": "<Your Accecc Token>",
    "spaceId": "<Your Space ID>",
    "entryId": "<Your Entry ID>",
    "diff": true | false
}
```

### Access Token取得方法

Contentfulダッシュボードにアクセスして、  
[Settings] > [CMA tokens] > [Create personal access token]  
でトークンを生成できます。


### Entry ID
entryIdは、
Contentfulの自分のAuthor記事でわかります.  
ここから自分の記事へ移動して確認してください。
https://app.contentful.com/spaces/ct0aopd36mqt/entries?id=VqeMNgEC2kOMMmVk&title=Overview&contentTypeId=authorProfile&order.fieldId=updatedAt&order.direction=descending&displayedFieldIds=contentType&displayedFieldIds=updatedAt&displayedFieldIds=author&page=0


### Space ID

ct0aopd36mqt  
を設定してください。

## Usage

適当なワークスペースを開いて、サイドバーのDevIO Viewを開きます。  
作成/pullした記事はワークスペース直下のarticlesディレクトリに作成されます。  

### 記事の作成

下記の方法で新規記事を作成することができます。  

* ARTICLESパネルの右上にある新規作成アイコンをクリック
* コマンドパレット(Shift + Cmd + P)でDevIO: Create New Articleを実行

### 記事の取得

既存の記事を取得するには、コマンドパレットを開き、
DevIO: Get Article from Contentful
を実行します。
インプットボックスが開くので、取得したい記事のEntry IDを入力します。  

Entry ID(記事固有のID)は、ブラウザで記事をひらいたとき、  
URLのentries以降にある文字列です。

```
https://app.contentful.com/spaces/<Space ID>/entries/<Entry ID>
```

自分の記事じゃなくてももってこれますし、
修正も可能なので注意してください。

### 画像アップロード・プレビュー

現在VSCodeから
* 直接画像をアップロードする方法
* 記事のプレビューを作成する方法
はありません。　　
そのため、コンテキストメニューかコマンドパレットで  
DevIO: Preview Active Editors Entry　　
を選択し、Contentfulの画面で処理を実施してください。  

### 記事情報の更新

記事のタイトル、slugを修正するには、ツリービューで記事を選択して
ARTICLE INFORMATIONパネルの　Update Articleボタンをクリックします。  
また、記事本文の更新は対象のMarkdownファイルを保存すると実行されます。  

タグについては取得のみ実装しています。  

### 記事の公開・非公開

ARTICLE INFORMATIONパネルの  
PUBLISH/UNPUBLISHボタンで行うことが可能です。  

## TODO

DONE:記事作成
DONE:プレビュー
DONE:publish
DONE:タグの取得
タグの更新
新規作成したときのテンプレート内容を、もう少し役立つものにする


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 0.1

Initial release

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Licence
?