import { join } from "path";
import { readJSON, writeJSON } from "fs-extra";

import { Editor } from "../../../../editor";

import { AssetsBrowserMoveHandler } from "./move-handler";

export class AssetsBrowserMaterialMoveHandler extends AssetsBrowserMoveHandler {
	/**
	 * Defines the list of all extensions handled by the item mover.
	 */
	public extensions: string[] = [".material"];

	private _editor: Editor;

	/**
	 * Constructor.
	 * @param editor defines the reference to the editor.
	 */
	public constructor(editor: Editor) {
		super();

		this._editor = editor;
	}

	/**
	 * Called on the user moves the given file from the previous path to the new path.
	 * @param from defines the previous absolute path to the file being moved.
	 * @param to defines the new absolute path to the file being moved.
	 */
	public async moveFile(from: string, to: string): Promise<void> {
		const materials = this._editor.scene!.materials;
		const newEditorPath = to.replace(join(this._editor.assetsBrowser.assetsDirectory, "/"), "");

		materials.forEach((mat) => {
			const editorPath = mat.metadata?.editorPath;
			if (!editorPath) {
				return;
			}

			const path = join(this._editor.assetsBrowser.assetsDirectory, editorPath);
			if (path === from) {
				mat.metadata.editorPath = newEditorPath;
			}
		});

		try {
			const json = await readJSON(from);
			if (json.metadata) {
				json.metadata.editorPath = newEditorPath;
			}

			await writeJSON(from, json, {
				spaces: "\t",
				encoding: "utf-8",
			});
		} catch (e) {
			// Catch silently.
		}
	}
}
