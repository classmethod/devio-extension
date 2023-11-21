import * as vscode from "vscode";
import * as fs from 'fs';
import { initializeCommands } from "./context/commands";
import { initializeTreeView } from "./context/treeview";
import { initializeWebView } from "./context/webview";
import * as listeners from "./context/listeners";

import { WebViewProvider } from "./webview/webViewProvider";
import { ArticlesTreeViewProvider } from "./treeview/articlesTreeViewProvider";

/**
 * Initialize the extension.
 */
async function initialize() {
	// Fetch the latest list of tags
	await vscode.commands.executeCommand("devio-extension.store-tags");
}

/** 
 * Object consolidating communally 
 * information within an extension 
 */
export interface AppContext {
	extension: vscode.ExtensionContext
	articlesFolderUri: vscode.Uri;
	conf: vscode.WorkspaceConfiguration
}

// Function that runs when the extension is activated
export function activate(extensionContext: vscode.ExtensionContext) {
	const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;

	if (!workspaceUri) {
		return vscode.window.showErrorMessage("No workspace found");
	}

	const articleUri = vscode.Uri.joinPath(workspaceUri, "articles");

	if (!fs.existsSync(articleUri.fsPath)) {
		fs.mkdirSync(articleUri.fsPath);
		vscode.window.showInformationMessage("Article directory created");
	}

	const context: AppContext = {
		extension: extensionContext,
		articlesFolderUri: articleUri,
		conf: vscode.workspace.getConfiguration('contentful.general')
	};

	const tviewProvider = new ArticlesTreeViewProvider(context);
	const webViewProvider = new WebViewProvider(context);
	extensionContext.subscriptions.push(
		...initializeCommands(context, tviewProvider),
		...initializeTreeView(context, tviewProvider, webViewProvider),
		...initializeWebView(context, webViewProvider),
		listeners.initializeMarkdownSaveListener(context, webViewProvider)
	);

	initialize().then(async () => {
		vscode.window.showInformationMessage("Extension initialized");
	}, (reason: any) => {
		console.error(reason);
		vscode.window.showErrorMessage("Error initializing extension");
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }