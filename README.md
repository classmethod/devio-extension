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
    "authorId": "<Your Author ID>",
    "diff": true | false
}
```

### Access Token取得方法

Contentfulダッシュボードにアクセスして、  
[Settings] > [CMA tokens] > [Create personal access token]  
でトークンを生成できます。


### Author ID
authorIdは、自分のIDです。
[Home画面](https://app.contentful.com/spaces/ct0aopd36mqt/home)の
Userセクションで確認できます。

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

現在、DevIO Extensionで下記処理は実行できません。

* 直接画像をアップロードする
* 記事のプレビューを作成する

そのため、コンテキストメニューかコマンドパレットで  
DevIO: Preview Active Editors Entry  
を選択し、Contentfulの画面で処理を実施してください。  

### 記事情報の更新

記事のタイトル、slugを修正するには、ツリービューで記事を選択して
ARTICLE INFORMATIONパネルのUpdate Articleボタンをクリックします。  
また、記事本文の更新は対象のMarkdownファイルを保存すると実行されます。  

### 記事の公開・非公開

ARTICLE INFORMATIONパネルの  
記事を公開/記事を非公開ボタンで行うことが可能です。  

## TODO

* 新規作成したときのテンプレート内容を、もう少し役立つものにする
* WebView周りのリファクタリング

## Release Notes

### 0.1

Initial release


## Licence
Copyright (C) 2018-2023 Classmethod, Inc.

Distributed under the MIT License. See the file LICENSE.md.