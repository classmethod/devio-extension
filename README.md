# devio-extension README

This is the README for your extension "devio-extension". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

## Settings

settings.jsonに下記情報をセットしてください。

```json
"contentful.general": {
    "accessToken": "<your accecc token>",
    "spaceId": "<your space id>",
    "entryId": "<your entry id>",
    "diff": true | false
}
```

entryIdは、
Contentfulの自分のAuthor記事でわかります.  
ここから自分の記事へ移動して確認してください。
https://app.contentful.com/spaces/ct0aopd36mqt/entries?id=VqeMNgEC2kOMMmVk&title=Overview&contentTypeId=authorProfile&order.fieldId=updatedAt&order.direction=descending&displayedFieldIds=contentType&displayedFieldIds=updatedAt&displayedFieldIds=author&page=0

## Usage

### 記事の作成
    // ドラフトでエントリーを作成する。
    // let draftEntry = environment.createEntry('blogPost', {
    //     fields: {
    //         title: { 'en-US': 'apiで作成' },
    //         slug: { 'en-US': 'api-test-test' },
    //         content: { 'en-US': '## Introduction\napiで作成' },
    //         language: { 'en-US': 'ja' },
    //         author: { 'en-US': {
    //             sys: { type: 'Link', linkType: 'Entry', id: '49IIdXnE4OEYkdApo4KL70' }
    //           } }
    //       }
    // });


### 記事の取得

### 画像アップロード

現在VSCodeから直接画像をアップロードする方法はありません。
そのため、コンテキストメニューかコマンドパレットで  
「DevIO: Open DevIO Contentful Home」
を選択し、Contentfulの画面で画像をアップロードして
画像URLを取得してください。  

### 記事の公開


## TODO

記事作成
プレビュー
publish
メタデータ更新？（タグとか）
