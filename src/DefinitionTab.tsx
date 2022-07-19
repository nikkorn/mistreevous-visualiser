import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-sqlserver";
import "./mode-mdsl";

import Alert from "@mui/material/Alert/Alert";

import './DefinitionTab.css';

export type DefinitionTabProps = {
    /** The definition value. */
    value: string;

    /** The callback for definition value changes. */
    onChange(value: string): void

    /** The definition error message. */
    errorMessage?: string;

    readOnly: boolean;
}

/**
 * The DefinitionTab component.
 */
 export const DefinitionTab: React.FunctionComponent<DefinitionTabProps> = ({ value, onChange, errorMessage, readOnly }) => {
    return (
        <div className="sidebar-tab definition-tab">
            <AceEditor
                className="definition-tab-ace-editor"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
				width="100%"
				mode="mdsl"
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </div>
    );
  }
  