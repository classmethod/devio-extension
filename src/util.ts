import * as vscode from "vscode";

/**
 * Save workspaceState.
 * @param extensionContext 
 * @param key Key
 * @param value Value. If you want to store an object, make it a JSON String representation.
 */
export function saveState<T>(extensionContext: vscode.ExtensionContext, key: string, value: T) {
	if(value === undefined || value === null) {
		return;
	}
	const state = extensionContext.workspaceState;
	state.update(key, value);
}

/**
 * Get workspaceState.
 * @param extensionContext 
 */
export function getState<T>(extensionContext: vscode.ExtensionContext, key: string) :T | undefined{
	const state = extensionContext.workspaceState;
	return state.get<T>(key);
}

// function convertToString(input: string | object): string {
//     if (typeof input === 'string') {
//         return input;
//     } else {
//         return JSON.stringify(input);
//     }
// }