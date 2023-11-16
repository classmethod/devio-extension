## Introducntion

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

azure personal access token
https://dev.azure.com/nakamurashuta/_usersSettings/tokens
https://code.visualstudio.com/api/working-with-extensions/publishing-extension

rixfv6zhrdnmhwztubkrwe4e5i33x4mbhw2zgybqvsab67hnbldq

articleディレクトリ？
自分一覧取得？（低）

DONE:記事作成
プレビュー
publish
メタデータ更新？（タグとか）


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 0.1

Initial release

---

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

