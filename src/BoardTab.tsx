import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-sqlserver";

import Alert from "@mui/material/Alert/Alert";
import Typography from "@mui/material/Typography/Typography";

import './BoardTab.css';

export type BoardTabProps = {
    /** The agent class value. */
    value: string;

    onChange(value: string): void

    /** The definition error message. */
    errorMessage?: string;

    readOnly: boolean;
}

/**
 * The AgentTab component.
 */
 export const AgentTab: React.FunctionComponent<BoardTabProps> = ({ value, onChange, errorMessage, readOnly }) => {
    return (
        <div className="sidebar-tab board-tab">
            <Typography className="sidebar-tab-title" variant="overline">Agent</Typography>
            <AceEditor
                className="board-tab-ace-editor"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
				width="100%"
                height="inherit"
				mode="javascript"
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </div>
    );
  }