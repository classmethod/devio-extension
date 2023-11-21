import * as vscode from "vscode";
import { diff_match_patch, Diff } from 'diff-match-patch';

/**
 * Save workspaceState.
 * @param extensionContext 
 * @param key Key
 * @param value Value. If you want to store an object, make it a JSON String representation.
 */
export function saveState<T>(extensionContext: vscode.ExtensionContext, key: string, value: T) {
	if (value === undefined || value === null) {
		return;
	}
	const state = extensionContext.workspaceState;
	state.update(key, value);
}

/**
 * Get workspaceState.
 * @param extensionContext 
 */
export function getState<T>(extensionContext: vscode.ExtensionContext, key: string): T | undefined {
	const state = extensionContext.workspaceState;
	return state.get<T>(key);
}


export function getEntryIdFromUri(uri: vscode.Uri): string {
	if (!uri) {
		throw new Error('uri is invalid.');
	}
	//ファイル名を取得して.mdを除去
	const filename = uri.path.split("/").slice(-1)[0];
	return filename.replace(/\.md$/, '');
}

/**
 * Compare two texts using diff-match-patch.
 * @param text1 
 * @param text2 
 */
export function diff(text1: string, text2: string): Diff[] {
	const dmp = new diff_match_patch();
	const diffs: Diff[] = dmp.diff_main(text1, text2);
	dmp.diff_cleanupSemantic(diffs);
	return diffs;
}

/**
 * Check if a file exists at the specified URI.
 *
 * @param {vscode.Uri} uri - The URI of the file to check.
 * @return {Promise<boolean>} Promise that resolves with true if the file exists, false otherwise.
 */
export async function fileExists(uri: vscode.Uri): Promise<boolean> {
	try {
		await vscode.workspace.fs.stat(uri);
		return true;
	} catch {
		return false;
	}
  }
