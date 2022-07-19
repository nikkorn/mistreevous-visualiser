import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-sqlserver";

import Alert from "@mui/material/Alert/Alert";

import './BoardTab.css';

export type BoardTabProps = {
    /** The board value. */
    value: string;

    onChange(value: string): void

    /** The definition error message. */
    errorMessage?: string;

    readOnly: boolean;
}

/**
 * The BoardTab component.
 */
 export const BoardTab: React.FunctionComponent<BoardTabProps> = ({ value, onChange, errorMessage, readOnly }) => {
    return (
        <div className="sidebar-tab board-tab">
            <AceEditor
                className="board-tab-ace-editor"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
				width="100%"
				mode="javascript"
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </div>
    );
  }