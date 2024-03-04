import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-sqlserver";
import "./mode-mdsl";

import Alert from "@mui/material/Alert/Alert";
import Typography from "@mui/material/Typography/Typography";
import { Divider } from "@mui/material";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

import { ExamplesMenu } from "./ExamplesMenu";
import { Example } from "./Examples";

import './DefinitionTab.css';

export type DefinitionTabProps = {
    /** The definition value. */
    value: string;

    /** The callback for definition value changes. */
    onChange(value: string): void

    /** The definition error message. */
    errorMessage?: string;

    readOnly: boolean;

    onExampleSelected(example: Example): void;
}

/**
 * The DefinitionTab component.
 */
 export const DefinitionTab: React.FunctionComponent<DefinitionTabProps> = ({ value, onChange, errorMessage, readOnly, onExampleSelected }) => {
    return (
        <div className="sidebar-tab definition-tab">
            <div className="definition-tab-header">
                <Typography className="sidebar-tab-title" variant="overline">Definition</Typography>
                <ExamplesMenu onExampleSelected={onExampleSelected} />
                <ToggleButtonGroup
                    className="definition-type-toggle"
                    value={"mdsl"}
                    size="small"
                    exclusive>
                    <ToggleButton value="mdsl">
                        <Typography fontSize={12}>MDSL</Typography>
                    </ToggleButton>
                    <ToggleButton value="json">
                        <Typography fontSize={12}>JSON</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Divider/>
            <AceEditor
                className="definition-tab-ace-editor"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
				width="100%"
                height="inherit"
				mode="mdsl"
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
            {errorMessage && <Alert className="sidebar-tab-alert" severity="error">{errorMessage}</Alert>}
        </div>
    );
  }
  