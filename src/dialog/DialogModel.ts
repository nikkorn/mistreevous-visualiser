import React from "react";
import ReactDOM from "react-dom/client";

import { DialogComponent } from "./DialogComponent";
import { DialogFieldType } from "./DialogTypes";

/**
 * A model representing a dialog.
 */
export class DialogModel {
    /** Whether the dialog is currently open. */
    private _isOpen: boolean = false;

    /** The dialog root. */
	private _dialogRoot: ReactDOM.Root | null = null;

    /** The dialog target element. */
	private _dialogTargetElement: HTMLElement | null = null;

    /**
     * Open the dialog.
     * @param fieldType 
     * @param text 
     * @param title 
     */
    public open(fieldType: DialogFieldType, text: string, title?: string): any {
        // If the dialog is already open then close it first.
        if (this._isOpen) {
            this.close();
        }
        
        const dialogTargetElement = document.createElement("div");

        document.body.appendChild(dialogTargetElement);

		this._dialogRoot = ReactDOM.createRoot(dialogTargetElement);

		this._dialogRoot.render(React.createElement(DialogComponent));

        this._isOpen = true;
    }

    /**
     * Close the dialog.
     */
    public close(): any {
        if (!this._isOpen) {
            return;
        }

        this._dialogRoot?.unmount();

        this._dialogTargetElement?.remove();

        this._isOpen = false;
    }
}