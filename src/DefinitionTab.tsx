import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-sqlserver";
import "./mode-mdsl";

import Alert from "@mui/material/Alert/Alert";
import Typography from "@mui/material/Typography/Typography";
import { Chip, Divider } from "@mui/material";

import { DefinitionType } from "./App";
import { ExamplesMenu } from "./ExamplesMenu";
import { Example } from "./Examples";

import './DefinitionTab.css';

export type DefinitionTabProps = {
    /** The definition value. */
    definition: string;

    /** The definition value. */
    definitionType: DefinitionType;

    /** The callback for definition value changes. */
    onChange(value: string): void

    /** The definition error message. */
    errorMessage?: string;

    readOnly: boolean;

    onExampleSelected(example: Example): void;

    onConvertButtonPress(): void;
}

/**
 * The DefinitionTab component.
 */
 export const DefinitionTab: React.FunctionComponent<DefinitionTabProps> = ({ definition, definitionType, onChange, errorMessage, readOnly, onExampleSelected, onConvertButtonPress }) => {
    return (
        <div className="sidebar-tab definition-tab">
            <div className="definition-tab-header">
                <Typography className="sidebar-tab-title" variant="overline">Definition</Typography>
                <ExamplesMenu onExampleSelected={onExampleSelected} />
                <div className="definition-tab-header-chip-container">
                    {definitionType === DefinitionType.MDSL && <Chip className="definition-tab-header-chip" label="MDSL" size="small"/>}
                    {definitionType === DefinitionType.JSON && <Chip className="definition-tab-header-chip" label="JSON" size="small"/>}
                    {definitionType === DefinitionType.MDSL && !readOnly && <Chip className="definition-tab-header-chip" variant="outlined" label="To JSON" size="small" onClick={() => onConvertButtonPress()}/>}
                </div>
            </div>
            <Divider/>
            <AceEditor
                className="definition-tab-ace-editor"
                value={definition}
                onChange={(value) => onChange(value)}
                readOnly={readOnly}
				width="100%"
                height="inherit"
				mode={definitionType === DefinitionType.JSON ? "json" : "mdsl"}
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
            {errorMessage && <Alert className="sidebar-tab-alert" severity="error">{errorMessage}</Alert>}
        </div>
    );
  }
  